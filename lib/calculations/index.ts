/**
 * Metrics calculation engine for the Investo app
 * Barrel export for all calculation functions
 */

// Utility calculation functions
export {
  calculateGainLoss,
  calculateGainLossPercent,
  calculateWeightedAverageCost,
  calculateAnnualizedReturn,
  calculatePortfolioWeight,
} from './utils';

// Purchase metrics
export { calculatePurchaseMetrics } from './purchase-metrics';

// ETF holding metrics
export { calculateETFHoldingMetrics } from './etf-holding-metrics';

// YTD calculator
export { calculateYTDPerformance } from './ytd-calculator';
export type { YTDPerformance } from './ytd-calculator';

// Portfolio metrics
export { calculatePortfolioMetrics } from './portfolio-metrics';
