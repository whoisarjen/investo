/**
 * Utility functions for financial calculations
 * All functions are pure and have no side effects
 */

import type { Purchase } from '@/types';

/**
 * Calculate the gain or loss amount
 *
 * @param costBasis - The original cost basis
 * @param currentValue - The current market value
 * @returns The gain (positive) or loss (negative) amount
 *
 * @example
 * calculateGainLoss(1000, 1200) // 200
 * calculateGainLoss(1000, 800)  // -200
 */
export function calculateGainLoss(costBasis: number, currentValue: number): number {
  return currentValue - costBasis;
}

/**
 * Calculate the gain or loss as a percentage
 *
 * @param costBasis - The original cost basis
 * @param currentValue - The current market value
 * @returns The percentage gain (positive) or loss (negative)
 *
 * @example
 * calculateGainLossPercent(1000, 1200) // 20
 * calculateGainLossPercent(1000, 800)  // -20
 */
export function calculateGainLossPercent(costBasis: number, currentValue: number): number {
  if (costBasis === 0) {
    return 0;
  }

  return ((currentValue - costBasis) / costBasis) * 100;
}

/**
 * Calculate the weighted average cost per share across multiple purchases
 *
 * The weighted average cost considers the number of shares in each purchase,
 * giving more weight to larger purchases.
 *
 * @param purchases - Array of purchases to calculate weighted average for
 * @returns The weighted average cost per share
 *
 * @example
 * const purchases = [
 *   { shares: 10, totalCost: 1000 }, // $100/share
 *   { shares: 20, totalCost: 2400 }, // $120/share
 * ];
 * calculateWeightedAverageCost(purchases) // 113.33 ($3400 / 30 shares)
 */
export function calculateWeightedAverageCost(purchases: Purchase[]): number {
  if (purchases.length === 0) {
    return 0;
  }

  const totalShares = purchases.reduce((sum, p) => sum + p.shares, 0);
  const totalCost = purchases.reduce((sum, p) => sum + p.totalCost, 0);

  if (totalShares === 0) {
    return 0;
  }

  return totalCost / totalShares;
}

/**
 * Calculate the annualized return using the CAGR (Compound Annual Growth Rate) formula
 *
 * CAGR = ((endValue / startValue) ^ (365 / days)) - 1
 *
 * @param startValue - The initial investment value
 * @param endValue - The current/final value
 * @param days - The number of days the investment was held
 * @returns The annualized return as a percentage
 *
 * @example
 * // $1000 grew to $1200 over 365 days = 20% annual return
 * calculateAnnualizedReturn(1000, 1200, 365) // 20
 *
 * // $1000 grew to $1100 over 180 days = ~20.6% annualized
 * calculateAnnualizedReturn(1000, 1100, 180) // 20.6
 */
export function calculateAnnualizedReturn(
  startValue: number,
  endValue: number,
  days: number
): number {
  // Handle edge cases
  if (startValue <= 0 || days <= 0) {
    return 0;
  }

  // If end value is negative or zero, return -100% (total loss)
  if (endValue <= 0) {
    return -100;
  }

  // Calculate CAGR
  const ratio = endValue / startValue;
  const yearsHeld = days / 365;

  // Use the CAGR formula: (ratio ^ (1/years)) - 1
  const cagr = Math.pow(ratio, 1 / yearsHeld) - 1;

  // Convert to percentage
  return cagr * 100;
}

/**
 * Calculate the weight of a holding as a percentage of total portfolio value
 *
 * @param holdingValue - The current value of the holding
 * @param totalValue - The total portfolio value
 * @returns The weight as a percentage (0-100)
 *
 * @example
 * calculatePortfolioWeight(2500, 10000) // 25
 * calculatePortfolioWeight(0, 10000)    // 0
 */
export function calculatePortfolioWeight(holdingValue: number, totalValue: number): number {
  if (totalValue === 0) {
    return 0;
  }

  return (holdingValue / totalValue) * 100;
}
