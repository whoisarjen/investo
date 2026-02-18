'use client';

/**
 * Portfolio Context
 * Provides portfolio state management throughout the application
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Portfolio, PurchaseFormData } from '@/types';
import {
  getPortfolio,
  initializePortfolio,
  addPurchase as addPurchaseToStorage,
  updatePurchase as updatePurchaseInStorage,
  deletePurchase as deletePurchaseFromStorage,
  exportPortfolio as exportPortfolioFromStorage,
  importPortfolio as importPortfolioToStorage,
  clearAllData,
} from '@/lib/storage';

/**
 * Portfolio context state and actions
 */
interface PortfolioContextValue {
  /** Current portfolio data */
  portfolio: Portfolio | null;
  /** Loading state while fetching portfolio from localStorage */
  isLoading: boolean;
  /** Error message if any operation fails */
  error: string | null;
  /** Add a new purchase to the portfolio */
  addPurchase: (data: PurchaseFormData) => void;
  /** Update an existing purchase */
  updatePurchase: (id: string, data: Partial<PurchaseFormData>) => void;
  /** Delete a purchase by ID */
  deletePurchase: (id: string) => void;
  /** Refresh portfolio from localStorage */
  refreshPortfolio: () => void;
  /** Export portfolio as JSON string */
  exportPortfolio: () => string;
  /** Import portfolio from JSON string */
  importPortfolio: (json: string) => void;
  /** Clear all portfolio data */
  clearPortfolio: () => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

/**
 * Props for PortfolioProvider component
 */
interface PortfolioProviderProps {
  children: ReactNode;
}

/**
 * Portfolio Provider Component
 * Wraps the application to provide portfolio state and actions
 *
 * @example
 * <PortfolioProvider>
 *   <App />
 * </PortfolioProvider>
 */
export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load portfolio from localStorage on mount
   */
  useEffect(() => {
    try {
      const storedPortfolio = getPortfolio();
      if (storedPortfolio) {
        setPortfolio(storedPortfolio);
      } else {
        // Initialize a new portfolio if none exists
        const newPortfolio = initializePortfolio();
        setPortfolio(newPortfolio);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load portfolio'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a new purchase to the portfolio
   */
  const addPurchase = useCallback(
    (data: PurchaseFormData) => {
      if (!portfolio) {
        setError('No portfolio available');
        return;
      }

      try {
        setError(null);
        const updatedPortfolio = addPurchaseToStorage(portfolio, data);
        setPortfolio(updatedPortfolio);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to add purchase'
        );
      }
    },
    [portfolio]
  );

  /**
   * Update an existing purchase
   */
  const updatePurchase = useCallback(
    (id: string, data: Partial<PurchaseFormData>) => {
      if (!portfolio) {
        setError('No portfolio available');
        return;
      }

      try {
        setError(null);
        const updatedPortfolio = updatePurchaseInStorage(portfolio, id, data);
        setPortfolio(updatedPortfolio);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update purchase'
        );
      }
    },
    [portfolio]
  );

  /**
   * Delete a purchase by ID
   */
  const deletePurchase = useCallback(
    (id: string) => {
      if (!portfolio) {
        setError('No portfolio available');
        return;
      }

      try {
        setError(null);
        const updatedPortfolio = deletePurchaseFromStorage(portfolio, id);
        setPortfolio(updatedPortfolio);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to delete purchase'
        );
      }
    },
    [portfolio]
  );

  /**
   * Refresh portfolio from localStorage
   */
  const refreshPortfolio = useCallback(() => {
    try {
      setError(null);
      setIsLoading(true);
      const storedPortfolio = getPortfolio();
      if (storedPortfolio) {
        setPortfolio(storedPortfolio);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to refresh portfolio'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Export portfolio as JSON string
   */
  const exportPortfolio = useCallback((): string => {
    if (!portfolio) {
      throw new Error('No portfolio available to export');
    }

    try {
      return exportPortfolioFromStorage(portfolio);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to export portfolio';
      setError(message);
      throw new Error(message);
    }
  }, [portfolio]);

  /**
   * Import portfolio from JSON string
   */
  const importPortfolio = useCallback((json: string) => {
    try {
      setError(null);
      const importedPortfolio = importPortfolioToStorage(json);
      setPortfolio(importedPortfolio);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to import portfolio';
      setError(message);
      throw new Error(message);
    }
  }, []);

  /**
   * Clear all portfolio data
   */
  const clearPortfolio = useCallback(() => {
    try {
      setError(null);
      clearAllData();
      // Initialize a new empty portfolio
      const newPortfolio = initializePortfolio();
      setPortfolio(newPortfolio);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to clear portfolio'
      );
    }
  }, []);

  const value: PortfolioContextValue = {
    portfolio,
    isLoading,
    error,
    addPurchase,
    updatePurchase,
    deletePurchase,
    refreshPortfolio,
    exportPortfolio,
    importPortfolio,
    clearPortfolio,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

/**
 * Hook to access portfolio context
 * Must be used within a PortfolioProvider
 *
 * @returns Portfolio context value with state and actions
 * @throws Error if used outside of PortfolioProvider
 *
 * @example
 * const { portfolio, addPurchase, isLoading } = usePortfolio();
 */
export function usePortfolio(): PortfolioContextValue {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }

  return context;
}
