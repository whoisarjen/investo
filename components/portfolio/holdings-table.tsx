'use client';

import { useState, Fragment } from 'react';
import type { ETFHoldingMetrics, PurchaseMetrics } from '@/types';
import { Card, Button, Modal, ModalHeader, ModalContent, ModalFooter } from '@/components/ui';
import { GainLossBadge } from '@/components/metrics';
import { formatCurrency, formatPercent, formatNumber, cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks';

export interface HoldingsTableProps {
  /** Array of ETF holding metrics to display */
  holdings: ETFHoldingMetrics[];
  /** Callback when a purchase is deleted */
  onDeletePurchase?: (purchaseId: string) => void;
  /** Additional class names */
  className?: string;
}

interface ExpandedRowProps {
  purchases: PurchaseMetrics[];
  onDelete?: (purchaseId: string) => void;
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  purchase: PurchaseMetrics | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

/**
 * Delete confirmation modal
 */
function DeleteConfirmModal({ isOpen, purchase, onConfirm, onCancel, isDeleting }: DeleteConfirmModalProps) {
  if (!purchase) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} className="max-w-sm">
      <ModalHeader onClose={onCancel}>Delete Investment</ModalHeader>
      <ModalContent>
        <div className="space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this investment? This action cannot be undone.
          </p>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Symbol</p>
                <p className="font-medium text-gray-900 dark:text-white">{purchase.etfSymbol}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Shares</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatNumber(purchase.shares, 4)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Cost Basis</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(purchase.costBasis)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Current Value</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(purchase.currentValue)}</p>
              </div>
            </div>
          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/**
 * Expanded row showing individual purchases for an ETF
 */
function ExpandedRow({ purchases, onDelete }: ExpandedRowProps) {
  return (
    <tr className="bg-gray-50 dark:bg-gray-800/50">
      <td colSpan={10} className="px-6 py-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Individual Purchases
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                  <th className="pb-2 pr-4 font-medium">Shares</th>
                  <th className="pb-2 pr-4 font-medium">Cost Basis</th>
                  <th className="pb-2 pr-4 font-medium">Current Value</th>
                  <th className="pb-2 pr-4 font-medium">Gain/Loss</th>
                  <th className="pb-2 pr-4 font-medium">Return</th>
                  {onDelete && <th className="pb-2 font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.purchaseId} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-2 pr-4">{formatNumber(purchase.shares, 4)}</td>
                    <td className="py-2 pr-4">{formatCurrency(purchase.costBasis)}</td>
                    <td className="py-2 pr-4">{formatCurrency(purchase.currentValue)}</td>
                    <td className="py-2 pr-4">
                      <span
                        className={cn(
                          'font-medium',
                          purchase.gainLoss >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        )}
                      >
                        {purchase.gainLoss >= 0 ? '+' : ''}{formatCurrency(purchase.gainLoss)}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <GainLossBadge value={purchase.gainLossPercent} isPercent size="sm" />
                    </td>
                    {onDelete && (
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() => onDelete(purchase.purchaseId)}
                          className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          aria-label="Delete purchase"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
  );
}

/**
 * Mobile card view for a single holding
 */
function MobileHoldingCard({
  holding,
  onDelete
}: {
  holding: ETFHoldingMetrics;
  onDelete?: (purchaseId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-4">
      <div
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {holding.etfSymbol}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {holding.etfName}
            </p>
          </div>
          <GainLossBadge value={holding.totalGainLossPercent} isPercent />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Shares</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatNumber(holding.totalShares, 4)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Avg Cost</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(holding.averageCostPerShare)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Current Price</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(holding.currentPrice)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Current Value</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(holding.currentValue)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Gain/Loss</p>
            <p
              className={cn(
                'font-medium',
                holding.totalGainLoss >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {holding.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(holding.totalGainLoss)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Weight</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatPercent(holding.weightInPortfolio / 100)}
            </p>
          </div>
        </div>

        {/* Expand indicator */}
        <div className="mt-3 flex items-center justify-center">
          <svg
            className={cn(
              'h-5 w-5 text-gray-400 transition-transform',
              isExpanded && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded purchases */}
      {isExpanded && holding.purchases.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Individual Purchases
          </p>
          <div className="space-y-3">
            {holding.purchases.map((purchase) => (
              <div
                key={purchase.purchaseId}
                className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {formatNumber(purchase.shares, 4)} shares
                  </span>
                  <div className="flex items-center gap-2">
                    <GainLossBadge value={purchase.gainLossPercent} isPercent size="sm" />
                    {onDelete && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(purchase.purchaseId);
                        }}
                        className="rounded p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                        aria-label="Delete purchase"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Cost: {formatCurrency(purchase.costBasis)}</span>
                  <span>Value: {formatCurrency(purchase.currentValue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

/**
 * Holdings Table component
 * Displays all ETF holdings with expandable rows for individual purchases
 * Responsive: shows card layout on mobile, table on desktop
 */
export function HoldingsTable({ holdings, onDeletePurchase, className = '' }: HoldingsTableProps) {
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const [deleteModalPurchase, setDeleteModalPurchase] = useState<PurchaseMetrics | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isMobile = useIsMobile();

  const toggleExpanded = (symbol: string) => {
    setExpandedSymbol(expandedSymbol === symbol ? null : symbol);
  };

  // Find all purchases across all holdings for delete lookup
  const allPurchases = holdings.flatMap(h => h.purchases);

  const handleDeleteClick = (purchaseId: string) => {
    const purchase = allPurchases.find(p => p.purchaseId === purchaseId);
    if (purchase) {
      setDeleteModalPurchase(purchase);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalPurchase || !onDeletePurchase) return;

    setIsDeleting(true);
    try {
      onDeletePurchase(deleteModalPurchase.purchaseId);
      setDeleteModalPurchase(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalPurchase(null);
  };

  // Mobile view: card layout
  if (isMobile) {
    return (
      <>
        <div className={cn('space-y-4', className)}>
          {holdings.map((holding) => (
            <MobileHoldingCard
              key={holding.etfSymbol}
              holding={holding}
              onDelete={onDeletePurchase ? handleDeleteClick : undefined}
            />
          ))}
        </div>
        <DeleteConfirmModal
          isOpen={!!deleteModalPurchase}
          purchase={deleteModalPurchase}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      </>
    );
  }

  // Desktop view: table layout
  return (
    <>
      <Card className={cn('overflow-hidden', className)}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  ETF
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Shares
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Avg Cost
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Current Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Current Value
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Gain/Loss ($)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Gain/Loss (%)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Weight
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {holdings.map((holding) => {
                const isExpanded = expandedSymbol === holding.etfSymbol;
                const hasPurchases = holding.purchases.length > 0;

                return (
                  <Fragment key={holding.etfSymbol}>
                    <tr
                      className={cn(
                        'transition-colors hover:bg-gray-50 dark:hover:bg-gray-800',
                        hasPurchases && 'cursor-pointer'
                      )}
                      onClick={() => hasPurchases && toggleExpanded(holding.etfSymbol)}
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {holding.etfSymbol}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {holding.etfName}
                          </p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                        {formatNumber(holding.totalShares, 4)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                        {formatCurrency(holding.averageCostPerShare)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                        {formatCurrency(holding.currentPrice)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(holding.currentValue)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <span
                          className={cn(
                            'text-sm font-medium',
                            holding.totalGainLoss >= 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          )}
                        >
                          {holding.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(holding.totalGainLoss)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <GainLossBadge value={holding.totalGainLossPercent} isPercent size="sm" />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                        {formatPercent(holding.weightInPortfolio / 100)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Delete button for single purchase holdings */}
                          {holding.purchases.length === 1 && onDeletePurchase && (
                            <button
                              type="button"
                              className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(holding.purchases[0].purchaseId);
                              }}
                              aria-label="Delete investment"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                          {/* Expand button for multiple purchases */}
                          {hasPurchases && (
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded(holding.etfSymbol);
                              }}
                              aria-expanded={isExpanded}
                              aria-label={isExpanded ? 'Collapse purchases' : 'Expand purchases'}
                            >
                              <svg
                                className={cn(
                                  'h-5 w-5 transition-transform',
                                  isExpanded && 'rotate-180'
                                )}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                aria-hidden="true"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && hasPurchases && (
                      <ExpandedRow
                        purchases={holding.purchases}
                        onDelete={onDeletePurchase ? handleDeleteClick : undefined}
                      />
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <DeleteConfirmModal
        isOpen={!!deleteModalPurchase}
        purchase={deleteModalPurchase}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting}
      />
    </>
  );
}
