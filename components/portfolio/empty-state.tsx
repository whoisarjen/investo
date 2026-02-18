'use client';

import { Button } from '@/components/ui';

export interface EmptyStateProps {
  /** Callback when Add Investment button is clicked */
  onAddInvestment: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * Empty state component displayed when the portfolio has no investments
 * Shows a friendly message and a CTA to add the first investment
 */
export function EmptyState({ onAddInvestment, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-16 dark:border-gray-700 dark:bg-gray-900 ${className}`}
    >
      {/* Message */}
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        No investments yet
      </h3>
      <p className="mb-6 max-w-sm text-center text-sm text-gray-500 dark:text-gray-400">
        Start building your portfolio by adding your first ETF investment. Track
        your holdings and monitor performance all in one place.
      </p>

      {/* CTA Button */}
      <Button variant="primary" size="lg" onClick={onAddInvestment}>
        Add Your First Investment
      </Button>
    </div>
  );
}
