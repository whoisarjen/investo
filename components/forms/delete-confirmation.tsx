'use client';

/**
 * Delete Confirmation Component
 * Confirmation dialog for deleting a purchase
 */

import { Button } from '@/components/ui';
import type { Purchase } from '@/types';

interface DeleteConfirmationProps {
  /** The purchase to be deleted */
  purchase: Purchase;
  /** Callback when deletion is confirmed */
  onConfirm: () => void;
  /** Callback when deletion is cancelled */
  onCancel: () => void;
  /** Whether the delete action is in progress */
  isDeleting?: boolean;
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Delete Confirmation Dialog
 * Shows purchase details and asks for confirmation before deletion
 */
export function DeleteConfirmation({
  purchase,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmationProps) {
  return (
    <div className="space-y-4">
      {/* Warning Icon */}
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      {/* Warning Message */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Delete Investment
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this investment? This action cannot be undone.
        </p>
      </div>

      {/* Purchase Details */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Symbol
            </dt>
            <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {purchase.etfSymbol}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Purchase Date
            </dt>
            <dd className="text-sm text-gray-900 dark:text-gray-100">
              {formatDate(purchase.purchaseDate)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Shares
            </dt>
            <dd className="text-sm text-gray-900 dark:text-gray-100">
              {purchase.shares}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Price Per Share
            </dt>
            <dd className="text-sm text-gray-900 dark:text-gray-100">
              {formatCurrency(purchase.pricePerShare)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Cost
            </dt>
            <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(purchase.totalCost)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={onConfirm}
          isLoading={isDeleting}
        >
          Delete Investment
        </Button>
      </div>
    </div>
  );
}
