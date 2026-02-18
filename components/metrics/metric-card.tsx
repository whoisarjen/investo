'use client';

import { type ReactNode } from 'react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface MetricCardProps {
  /** Title of the metric */
  title: string;
  /** Main value to display */
  value: string;
  /** Optional subtitle or additional info */
  subtitle?: string;
  /** Trend direction for visual indicator */
  trend?: TrendDirection;
  /** Optional icon to display */
  icon?: ReactNode;
  /** Additional class names */
  className?: string;
}

const trendColors: Record<TrendDirection, string> = {
  up: 'text-green-600 dark:text-green-400',
  down: 'text-red-600 dark:text-red-400',
  neutral: 'text-gray-600 dark:text-gray-400',
};

const TrendIcon = ({ direction }: { direction: TrendDirection }) => {
  if (direction === 'up') {
    return (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    );
  }

  if (direction === 'down') {
    return (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    );
  }

  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
};

/**
 * Reusable metric display card component
 * Used for displaying portfolio metrics with optional trend indicators
 *
 * @example
 * <MetricCard
 *   title="Total Value"
 *   value="$10,000.00"
 *   subtitle="+$500.00 today"
 *   trend="up"
 * />
 */
export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('p-4 sm:p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p
            className={cn(
              'text-xl font-bold sm:text-2xl',
              trend ? trendColors[trend] : 'text-gray-900 dark:text-white'
            )}
          >
            {value}
          </p>
          {subtitle && (
            <div className="flex items-center gap-1">
              {trend && (
                <span className={trendColors[trend]}>
                  <TrendIcon direction={trend} />
                </span>
              )}
              <p
                className={cn(
                  'text-sm',
                  trend ? trendColors[trend] : 'text-gray-500 dark:text-gray-400'
                )}
              >
                {subtitle}
              </p>
            </div>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
