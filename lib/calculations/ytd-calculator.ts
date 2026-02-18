/**
 * Year-to-date (YTD) performance calculation functions
 * Calculate YTD returns considering both new investments and value changes
 */

import type { Purchase, ETFPriceData } from '@/types';
import { getYearStart } from '@/lib/utils';

/**
 * YTD performance result
 */
export interface YTDPerformance {
  /** Year-to-date gain or loss in currency */
  ytdGainLoss: number;
  /** Year-to-date gain or loss as a percentage */
  ytdGainLossPercent: number;
}

/**
 * Calculate year-to-date (YTD) performance for a portfolio
 *
 * YTD performance considers:
 * 1. Holdings from previous years: Value change from year start to now
 * 2. New investments this year: Value change from purchase date to now
 *
 * The calculation:
 * - For holdings from previous years: (current value - value at year start)
 * - For new investments this year: (current value - cost basis)
 *
 * YTD % = (total YTD gain/loss) / (value at year start + new investments) * 100
 *
 * @param purchases - All purchases in the portfolio
 * @param priceData - Map of ETF symbols to their price data (including YTD start price)
 * @returns YTD performance metrics
 *
 * @example
 * const purchases = [
 *   { etfSymbol: 'VOO', purchaseDate: '2023-06-15', shares: 10, ... }, // Previous year
 *   { etfSymbol: 'VOO', purchaseDate: '2024-03-01', shares: 5, ... },  // This year
 * ];
 * const priceData = new Map([
 *   ['VOO', { currentPrice: 420, ytdChange: 5, ... }],
 * ]);
 * const ytd = calculateYTDPerformance(purchases, priceData);
 */
export function calculateYTDPerformance(
  purchases: Purchase[],
  priceData: Map<string, ETFPriceData>
): YTDPerformance {
  const yearStart = getYearStart();
  const yearStartTime = yearStart.getTime();

  let ytdGainLoss = 0;
  let valueAtYearStart = 0;
  let newInvestmentsThisYear = 0;

  // Group purchases by ETF symbol for efficient calculation
  const purchasesBySymbol = new Map<string, Purchase[]>();

  for (const purchase of purchases) {
    const existing = purchasesBySymbol.get(purchase.etfSymbol) || [];
    existing.push(purchase);
    purchasesBySymbol.set(purchase.etfSymbol, existing);
  }

  // Calculate YTD performance for each ETF
  for (const [symbol, etfPurchases] of purchasesBySymbol) {
    const price = priceData.get(symbol);

    if (!price) {
      // Skip if we don't have price data for this ETF
      continue;
    }

    const currentPrice = price.currentPrice;

    // Calculate YTD start price from the ytdChange percentage
    // ytdChange = ((currentPrice - ytdStartPrice) / ytdStartPrice) * 100
    // Solving for ytdStartPrice: ytdStartPrice = currentPrice / (1 + ytdChange/100)
    const ytdStartPrice = price.ytdChange !== 0
      ? currentPrice / (1 + price.ytdChange / 100)
      : currentPrice;

    for (const purchase of etfPurchases) {
      const purchaseDate = new Date(purchase.purchaseDate);
      const purchaseTime = purchaseDate.getTime();
      const currentValue = purchase.shares * currentPrice;

      if (purchaseTime < yearStartTime) {
        // Holdings from previous years
        // Calculate value at year start
        const valueAtStart = purchase.shares * ytdStartPrice;
        valueAtYearStart += valueAtStart;

        // YTD gain/loss = current value - value at year start
        ytdGainLoss += currentValue - valueAtStart;
      } else {
        // New investments this year
        // YTD gain/loss = current value - cost basis
        ytdGainLoss += currentValue - purchase.totalCost;
        newInvestmentsThisYear += purchase.totalCost;
      }
    }
  }

  // Calculate YTD percentage
  // Base = value at year start + new investments made this year
  const base = valueAtYearStart + newInvestmentsThisYear;
  const ytdGainLossPercent = base > 0 ? (ytdGainLoss / base) * 100 : 0;

  return {
    ytdGainLoss,
    ytdGainLossPercent,
  };
}
