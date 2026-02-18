'use client';

import { useMemo, useCallback } from 'react';
import { usePortfolio, useUI } from '@/contexts';
import { usePrices, useMetrics } from '@/hooks';
import { Container, PageHeader } from '@/components/layout';
import { Button, Skeleton, ToastContainer } from '@/components/ui';
import { PortfolioSummary, HoldingsTable, EmptyState } from '@/components/portfolio';
import { PurchaseModal } from '@/components/forms';

/**
 * Dashboard Page
 * Main page for viewing portfolio summary and holdings
 */
export default function DashboardPage() {
  const { portfolio, isLoading: isPortfolioLoading, deletePurchase } = usePortfolio();
  const { openAddModal, showToast } = useUI();

  // Get unique ETF symbols from portfolio (normalized: uppercase and trimmed)
  const symbols = useMemo(() => {
    if (!portfolio) return [];
    const uniqueSymbols = new Set(
      portfolio.purchases.map((p) => p.etfSymbol.toUpperCase().trim())
    );
    return Array.from(uniqueSymbols);
  }, [portfolio]);

  // Fetch prices for all symbols
  const { prices, hasLoaded: hasPricesLoaded } = usePrices(symbols);

  // Calculate portfolio metrics
  const metrics = useMetrics(portfolio, prices);

  // Determine if we're in a loading state
  // Show loading if portfolio is loading, OR if we have symbols but prices haven't loaded yet
  const isLoading = isPortfolioLoading || (symbols.length > 0 && !hasPricesLoaded);

  // Check if portfolio is empty
  const isEmpty = !portfolio || portfolio.purchases.length === 0;

  // Handle delete purchase
  const handleDeletePurchase = useCallback((purchaseId: string) => {
    try {
      deletePurchase(purchaseId);
      showToast('Investment deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete purchase:', error);
      showToast('Failed to delete investment', 'error');
    }
  }, [deletePurchase, showToast]);

  // Loading state
  if (isLoading) {
    return (
      <Container as="main" className="py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <Skeleton variant="text" width="200px" height={32} />
          <div className="mt-2">
            <Skeleton variant="text" width="300px" height={20} />
          </div>
        </div>

        {/* Summary cards skeleton */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:p-6"
            >
              <Skeleton variant="text" width="60%" height={16} className="mb-2" />
              <Skeleton variant="text" width="80%" height={28} className="mb-2" />
              <Skeleton variant="text" width="40%" height={16} />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 p-4 dark:border-gray-800">
            <Skeleton variant="text" width="150px" height={24} />
          </div>
          <div className="p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <Skeleton variant="rectangular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width="30%" height={18} className="mb-1" />
                  <Skeleton variant="text" width="50%" height={14} />
                </div>
                <Skeleton variant="text" width="80px" height={18} />
                <Skeleton variant="text" width="80px" height={18} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <Container as="main" className="py-6 sm:py-8">
        <PageHeader
          title="Dashboard"
          description="Track your ETF investments and monitor performance"
          className="mb-6 sm:mb-8"
        />
        <EmptyState onAddInvestment={openAddModal} />
        <PurchaseModal />
        <ToastContainer />
      </Container>
    );
  }

  // Main dashboard view
  return (
    <Container as="main" className="py-6 sm:py-8">
      <PageHeader
        title="Dashboard"
        description="Track your ETF investments and monitor performance"
        action={
          <Button variant="primary" onClick={openAddModal}>
            Add Investment
          </Button>
        }
        className="mb-6 sm:mb-8"
      />

      {/* Portfolio Summary */}
      {metrics && (
        <PortfolioSummary metrics={metrics} className="mb-6 sm:mb-8" />
      )}

      {/* Holdings Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Holdings
        </h2>
        {metrics && <HoldingsTable holdings={metrics.holdings} onDeletePurchase={handleDeletePurchase} />}
      </div>

      {/* Modals and Toasts */}
      <PurchaseModal />
      <ToastContainer />
    </Container>
  );
}
