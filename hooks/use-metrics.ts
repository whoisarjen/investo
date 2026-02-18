'use client';

import { useMemo } from 'react';
import type {
  Portfolio,
  ETFPriceData,
  PortfolioMetrics,
  ETFHoldingMetrics,
  PurchaseMetrics,
} from '@/types';
import { getDaysBetween } from '@/lib/utils';

/**
 * Calculate the annualized return (CAGR) given an initial value, final value, and time period
 *
 * @param costBasis - The initial investment amount
 * @param currentValue - The current value of the investment
 * @param days - The number of days the investment has been held
 * @returns The annualized return as a percentage
 */
function calculateAnnualizedReturn(
  costBasis: number,
  currentValue: number,
  days: number
): number {
  if (costBasis <= 0 || days <= 0) {
    return 0;
  }

  const years = days / 365;
  const totalReturn = currentValue / costBasis;

  // CAGR formula: (endValue / startValue) ^ (1 / years) - 1
  const cagr = (Math.pow(totalReturn, 1 / years) - 1) * 100;

  return isFinite(cagr) ? cagr : 0;
}

/**
 * Calculate metrics for a single purchase
 *
 * @param purchase - The purchase to calculate metrics for
 * @param currentPrice - The current price of the ETF
 * @returns The purchase metrics
 */
function calculatePurchaseMetrics(
  purchase: {
    id: string;
    etfSymbol: string;
    purchaseDate: string;
    shares: number;
    totalCost: number;
  },
  currentPrice: number
): PurchaseMetrics {
  const costBasis = purchase.totalCost;
  const currentValue = purchase.shares * currentPrice;
  const gainLoss = currentValue - costBasis;
  const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

  const purchaseDate = new Date(purchase.purchaseDate);
  const today = new Date();
  const holdingPeriodDays = getDaysBetween(purchaseDate, today);

  const annualizedReturn = calculateAnnualizedReturn(
    costBasis,
    currentValue,
    holdingPeriodDays
  );

  return {
    purchaseId: purchase.id,
    etfSymbol: purchase.etfSymbol,
    shares: purchase.shares,
    costBasis,
    currentValue,
    gainLoss,
    gainLossPercent,
    holdingPeriodDays,
    annualizedReturn,
  };
}

/**
 * Calculate aggregated metrics for all holdings of a single ETF
 *
 * @param etfSymbol - The ETF symbol
 * @param etfName - The ETF name
 * @param purchases - All purchases of this ETF
 * @param currentPrice - The current price of the ETF
 * @param totalPortfolioValue - The total value of the entire portfolio
 * @returns The ETF holding metrics
 */
function calculateETFHoldingMetrics(
  etfSymbol: string,
  etfName: string,
  purchases: Array<{
    id: string;
    etfSymbol: string;
    purchaseDate: string;
    shares: number;
    totalCost: number;
  }>,
  currentPrice: number,
  totalPortfolioValue: number
): ETFHoldingMetrics {
  // Calculate metrics for each purchase
  const purchaseMetrics = purchases.map((p) =>
    calculatePurchaseMetrics(p, currentPrice)
  );

  // Aggregate values
  const totalShares = purchases.reduce((sum, p) => sum + p.shares, 0);
  const totalCostBasis = purchases.reduce((sum, p) => sum + p.totalCost, 0);
  const currentValue = totalShares * currentPrice;
  const totalGainLoss = currentValue - totalCostBasis;
  const totalGainLossPercent =
    totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;
  const averageCostPerShare = totalShares > 0 ? totalCostBasis / totalShares : 0;
  const weightInPortfolio =
    totalPortfolioValue > 0 ? (currentValue / totalPortfolioValue) * 100 : 0;

  return {
    etfSymbol,
    etfName,
    totalShares,
    averageCostPerShare,
    totalCostBasis,
    currentPrice,
    currentValue,
    totalGainLoss,
    totalGainLossPercent,
    weightInPortfolio,
    purchases: purchaseMetrics,
  };
}

/**
 * Custom hook for calculating portfolio metrics
 * Memoized to prevent unnecessary recalculations
 *
 * @param portfolio - The portfolio to calculate metrics for
 * @param prices - Map of symbol to current price data
 * @returns The portfolio metrics or null if portfolio is not available
 *
 * @example
 * const { prices } = usePrices(['SPY', 'VOO']);
 * const metrics = useMetrics(portfolio, prices);
 *
 * if (metrics) {
 *   console.log(`Portfolio value: $${metrics.currentValue}`);
 *   console.log(`Total gain/loss: ${metrics.totalGainLossPercent}%`);
 * }
 */
export function useMetrics(
  portfolio: Portfolio | null,
  prices: Map<string, ETFPriceData>
): PortfolioMetrics | null {
  return useMemo(() => {
    if (!portfolio || portfolio.purchases.length === 0) {
      return null;
    }

    // Group purchases by ETF symbol
    const purchasesByETF = new Map<
      string,
      Array<{
        id: string;
        etfSymbol: string;
        purchaseDate: string;
        shares: number;
        totalCost: number;
      }>
    >();

    for (const purchase of portfolio.purchases) {
      // Normalize symbol (uppercase and trim) to match usePrices
      const symbol = purchase.etfSymbol.toUpperCase().trim();
      const existing = purchasesByETF.get(symbol) || [];
      existing.push({
        id: purchase.id,
        etfSymbol: symbol,
        purchaseDate: purchase.purchaseDate,
        shares: purchase.shares,
        totalCost: purchase.totalCost,
      });
      purchasesByETF.set(symbol, existing);
    }

    // Calculate total portfolio value first (for weight calculations)
    let totalCurrentValue = 0;
    let totalInvested = 0;

    for (const [symbol, purchases] of purchasesByETF) {
      const priceData = prices.get(symbol);
      const currentPrice = priceData?.currentPrice || 0;

      const shares = purchases.reduce((sum, p) => sum + p.shares, 0);
      const cost = purchases.reduce((sum, p) => sum + p.totalCost, 0);

      totalCurrentValue += shares * currentPrice;
      totalInvested += cost;
    }

    // Calculate metrics for each ETF holding
    const holdings: ETFHoldingMetrics[] = [];

    for (const [symbol, purchases] of purchasesByETF) {
      const priceData = prices.get(symbol);
      const currentPrice = priceData?.currentPrice || 0;

      // Get ETF name from cache if available
      const cachedEntry = portfolio.etfCache[symbol];
      const etfName = cachedEntry?.etf.name || symbol;

      const holdingMetrics = calculateETFHoldingMetrics(
        symbol,
        etfName,
        purchases,
        currentPrice,
        totalCurrentValue
      );

      holdings.push(holdingMetrics);
    }

    // Sort holdings by current value (descending)
    holdings.sort((a, b) => b.currentValue - a.currentValue);

    // Calculate overall portfolio metrics
    const totalGainLoss = totalCurrentValue - totalInvested;
    const totalGainLossPercent =
      totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    // Calculate YTD metrics
    // This is a simplified calculation - would need YTD start values for accuracy
    let ytdGainLoss = 0;
    let ytdStartValue = 0;

    for (const [symbol, purchases] of purchasesByETF) {
      const priceData = prices.get(symbol);
      // Skip if no price data or price is 0
      if (!priceData || priceData.currentPrice <= 0) continue;

      const shares = purchases.reduce((sum, p) => sum + p.shares, 0);

      // Estimate YTD start value using ytdChange
      const ytdChangeDecimal = (priceData.ytdChange || 0) / 100;
      // Protect against division by zero or invalid values
      const divisor = 1 + ytdChangeDecimal;
      const estimatedStartPrice =
        divisor > 0 && isFinite(divisor)
          ? priceData.currentPrice / divisor
          : priceData.currentPrice;

      // Only add if the value is valid
      if (isFinite(estimatedStartPrice)) {
        ytdStartValue += shares * estimatedStartPrice;
      }
    }

    ytdGainLoss = totalCurrentValue - ytdStartValue;
    const ytdGainLossPercent =
      ytdStartValue > 0 && isFinite(ytdStartValue)
        ? (ytdGainLoss / ytdStartValue) * 100
        : 0;

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
  }, [portfolio, prices]);
}
