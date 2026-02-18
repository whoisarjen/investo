/**
 * Purchase metrics calculation functions
 * Calculate performance metrics for individual purchase transactions
 */

import type { Purchase, PurchaseMetrics } from '@/types';
import { getDaysBetween } from '@/lib/utils';
import {
  calculateGainLoss,
  calculateGainLossPercent,
  calculateAnnualizedReturn,
} from './utils';

/**
 * Calculate performance metrics for a single purchase
 *
 * @param purchase - The purchase transaction to calculate metrics for
 * @param currentPrice - The current market price per share of the ETF
 * @returns Complete metrics for the purchase including gain/loss and annualized return
 *
 * @example
 * const purchase = {
 *   id: '123',
 *   etfSymbol: 'VOO',
 *   purchaseDate: '2024-01-15',
 *   shares: 10,
 *   pricePerShare: 400,
 *   totalCost: 4010, // includes $10 fee
 *   fees: 10,
 *   createdAt: '2024-01-15T10:00:00Z',
 *   updatedAt: '2024-01-15T10:00:00Z',
 * };
 * const metrics = calculatePurchaseMetrics(purchase, 450);
 * // Returns:
 * // {
 * //   purchaseId: '123',
 * //   etfSymbol: 'VOO',
 * //   shares: 10,
 * //   costBasis: 4010,
 * //   currentValue: 4500,
 * //   gainLoss: 490,
 * //   gainLossPercent: 12.22,
 * //   holdingPeriodDays: 398,
 * //   annualizedReturn: 11.36,
 * // }
 */
export function calculatePurchaseMetrics(
  purchase: Purchase,
  currentPrice: number
): PurchaseMetrics {
  const costBasis = purchase.totalCost;
  const currentValue = purchase.shares * currentPrice;

  const gainLoss = calculateGainLoss(costBasis, currentValue);
  const gainLossPercent = calculateGainLossPercent(costBasis, currentValue);

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
