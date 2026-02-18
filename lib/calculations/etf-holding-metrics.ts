/**
 * ETF holding metrics calculation functions
 * Calculate aggregated metrics for all purchases of a single ETF
 */

import type { Purchase, ETFHoldingMetrics, PurchaseMetrics } from '@/types';
import {
  calculateGainLoss,
  calculateGainLossPercent,
  calculateWeightedAverageCost,
  calculatePortfolioWeight,
} from './utils';
import { calculatePurchaseMetrics } from './purchase-metrics';

/**
 * Calculate aggregated metrics for all holdings of a single ETF
 *
 * This function aggregates all purchases of the same ETF and calculates:
 * - Total shares owned
 * - Weighted average cost per share
 * - Total cost basis and current value
 * - Total gain/loss and percentage
 * - Portfolio weight
 * - Individual purchase metrics
 *
 * @param purchases - Array of purchases for this ETF (should all have the same etfSymbol)
 * @param etfName - The full name of the ETF
 * @param currentPrice - The current market price per share
 * @param totalPortfolioValue - The total value of the entire portfolio (for weight calculation)
 * @returns Aggregated metrics for the ETF holding
 *
 * @example
 * const purchases = [
 *   { id: '1', etfSymbol: 'VOO', shares: 10, totalCost: 4000, ... },
 *   { id: '2', etfSymbol: 'VOO', shares: 5, totalCost: 2100, ... },
 * ];
 * const metrics = calculateETFHoldingMetrics(purchases, 'Vanguard S&P 500 ETF', 420, 25000);
 * // Returns aggregated metrics for all VOO holdings
 */
export function calculateETFHoldingMetrics(
  purchases: Purchase[],
  etfName: string,
  currentPrice: number,
  totalPortfolioValue: number
): ETFHoldingMetrics {
  if (purchases.length === 0) {
    const etfSymbol = '';
    return {
      etfSymbol,
      etfName,
      totalShares: 0,
      averageCostPerShare: 0,
      totalCostBasis: 0,
      currentPrice,
      currentValue: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      weightInPortfolio: 0,
      purchases: [],
    };
  }

  // Use the symbol from the first purchase (all should be the same)
  const etfSymbol = purchases[0].etfSymbol;

  // Calculate totals
  const totalShares = purchases.reduce((sum, p) => sum + p.shares, 0);
  const totalCostBasis = purchases.reduce((sum, p) => sum + p.totalCost, 0);
  const currentValue = totalShares * currentPrice;

  // Calculate weighted average cost
  const averageCostPerShare = calculateWeightedAverageCost(purchases);

  // Calculate gain/loss
  const totalGainLoss = calculateGainLoss(totalCostBasis, currentValue);
  const totalGainLossPercent = calculateGainLossPercent(totalCostBasis, currentValue);

  // Calculate portfolio weight
  const weightInPortfolio = calculatePortfolioWeight(currentValue, totalPortfolioValue);

  // Calculate individual purchase metrics
  const purchaseMetrics: PurchaseMetrics[] = purchases.map((purchase) =>
    calculatePurchaseMetrics(purchase, currentPrice)
  );

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
