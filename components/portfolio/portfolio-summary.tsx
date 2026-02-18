'use client';

import type { PortfolioMetrics } from '@/types';
import { MetricCard, type TrendDirection } from '@/components/metrics';
import { formatCurrency, formatPercent } from '@/lib/utils';

export interface PortfolioSummaryProps {
  /** Portfolio metrics to display */
  metrics: PortfolioMetrics;
  /** Additional class names */
  className?: string;
}

/**
 * Get trend direction based on value
 */
function getTrend(value: number): TrendDirection {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'neutral';
}

/**
 * Format gain/loss value with sign
 */
function formatGainLoss(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatCurrency(value)}`;
}

/**
 * Portfolio Summary component
 * Displays 4 key metrics in a responsive grid:
 * - Total Invested
 * - Current Value
 * - Total Gain/Loss
 * - YTD Performance
 *
 * @example
 * const metrics = useMetrics(portfolio, prices);
 * {metrics && <PortfolioSummary metrics={metrics} />}
 */
export function PortfolioSummary({ metrics, className = '' }: PortfolioSummaryProps) {
  const {
    totalInvested,
    currentValue,
    totalGainLoss,
    totalGainLossPercent,
    ytdGainLoss,
    ytdGainLossPercent,
  } = metrics;

  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
    >
      {/* Total Invested */}
      <MetricCard
        title="Total Invested"
        value={formatCurrency(totalInvested)}
        icon={
          <svg
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />

      {/* Current Value */}
      <MetricCard
        title="Current Value"
        value={formatCurrency(currentValue)}
        subtitle={formatGainLoss(totalGainLoss)}
        trend={getTrend(totalGainLoss)}
        icon={
          <svg
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        }
      />

      {/* Total Gain/Loss */}
      <MetricCard
        title="Total Gain/Loss"
        value={formatGainLoss(totalGainLoss)}
        subtitle={formatPercent(totalGainLossPercent / 100)}
        trend={getTrend(totalGainLoss)}
        icon={
          <svg
            className={`h-5 w-5 ${
              totalGainLoss >= 0
                ? 'text-green-500 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            {totalGainLoss >= 0 ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            )}
          </svg>
        }
      />

      {/* YTD Performance */}
      <MetricCard
        title="YTD Performance"
        value={formatPercent(ytdGainLossPercent / 100)}
        subtitle={formatGainLoss(ytdGainLoss)}
        trend={getTrend(ytdGainLoss)}
        icon={
          <svg
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        }
      />
    </div>
  );
}
