/**
 * Portfolio metrics calculation functions
 * Calculate overall performance metrics for an entire portfolio
 */

import type { Portfolio, ETFPriceData, PortfolioMetrics, ETFHoldingMetrics } from '@/types';
import { calculateGainLoss, calculateGainLossPercent } from './utils';
import { calculateETFHoldingMetrics } from './etf-holding-metrics';
import { calculateYTDPerformance } from './ytd-calculator';

/**
 * Calculate comprehensive metrics for an entire portfolio
 *
 * This function:
 * 1. Groups all purchases by ETF symbol
 * 2. Calculates metrics for each ETF holding
 * 3. Calculates overall portfolio metrics (total invested, current value, gain/loss)
 * 4. Calculates YTD performance
 *
 * @param portfolio - The portfolio containing purchases and ETF cache
 * @param priceData - Map of ETF symbols to their current price data
 * @returns Complete portfolio metrics including all holdings
 *
 * @example
 * const portfolio = {
 *   id: '1',
 *   name: 'My Portfolio',
 *   purchases: [...],
 *   etfCache: {...},
 *   createdAt: '2024-01-01T00:00:00Z',
 *   updatedAt: '2024-01-01T00:00:00Z',
 *   version: 1,
 * };
 * const priceData = new Map([
 *   ['VOO', { symbol: 'VOO', currentPrice: 420, ... }],
 *   ['QQQ', { symbol: 'QQQ', currentPrice: 380, ... }],
 * ]);
 * const metrics = calculatePortfolioMetrics(portfolio, priceData);
 */
export function calculatePortfolioMetrics(
  portfolio: Portfolio,
  priceData: Map<string, ETFPriceData>
): PortfolioMetrics {
  const { purchases, etfCache } = portfolio;

  // Handle empty portfolio
  if (purchases.length === 0) {
    return {
      totalInvested: 0,
      currentValue: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      ytdGainLoss: 0,
      ytdGainLossPercent: 0,
      holdings: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  // Group purchases by ETF symbol
  const purchasesBySymbol = new Map<string, typeof purchases>();

  for (const purchase of purchases) {
    const existing = purchasesBySymbol.get(purchase.etfSymbol) || [];
    existing.push(purchase);
    purchasesBySymbol.set(purchase.etfSymbol, existing);
  }

  // Calculate total portfolio value first (needed for weight calculations)
  let totalCurrentValue = 0;

  for (const [symbol, etfPurchases] of purchasesBySymbol) {
    const price = priceData.get(symbol);
    if (price) {
      const totalShares = etfPurchases.reduce((sum, p) => sum + p.shares, 0);
      totalCurrentValue += totalShares * price.currentPrice;
    }
  }

  // Calculate metrics for each ETF holding
  const holdings: ETFHoldingMetrics[] = [];

  for (const [symbol, etfPurchases] of purchasesBySymbol) {
    const price = priceData.get(symbol);
    const cacheEntry = etfCache[symbol];

    if (price) {
      const etfName = cacheEntry?.etf?.name || symbol;

      const holdingMetrics = calculateETFHoldingMetrics(
        etfPurchases,
        etfName,
        price.currentPrice,
        totalCurrentValue
      );

      holdings.push(holdingMetrics);
    }
  }

  // Sort holdings by current value (descending)
  holdings.sort((a, b) => b.currentValue - a.currentValue);

  // Calculate total invested (sum of all cost bases)
  const totalInvested = purchases.reduce((sum, p) => sum + p.totalCost, 0);

  // Calculate total gain/loss
  const totalGainLoss = calculateGainLoss(totalInvested, totalCurrentValue);
  const totalGainLossPercent = calculateGainLossPercent(totalInvested, totalCurrentValue);

  // Calculate YTD performance
  const { ytdGainLoss, ytdGainLossPercent } = calculateYTDPerformance(purchases, priceData);

  return {
    totalInvested,
    currentValue: totalCurrentValue,
    totalGainLoss,
    totalGainLossPercent,
    ytdGainLoss,
    ytdGainLossPercent,
    holdings,
    lastUpdated: new Date().toISOString(),
  };
}
