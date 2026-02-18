'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ETFPriceData } from '@/types';
import {
  getCachedPrice,
  updatePriceCache,
  CACHE_TTL,
} from '@/lib/storage';
import { isMarketOpen } from '@/lib/utils';

/**
 * Return type for the usePrices hook
 */
interface UsePricesResult {
  /** Map of symbol to price data */
  prices: Map<string, ETFPriceData>;
  /** Whether prices are currently being fetched */
  isLoading: boolean;
  /** Whether the initial fetch has completed */
  hasLoaded: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Function to manually refresh prices */
  refresh: () => void;
}

/**
 * API response structure
 */
interface ApiResponse {
  success: boolean;
  data?: ETFPriceData;
  error?: string;
}

/**
 * Fetch price data for a single symbol from the API
 *
 * @param symbol - The ETF symbol to fetch
 * @returns The price data or null if fetch failed
 */
async function fetchPrice(symbol: string): Promise<ETFPriceData | null> {
  try {
    const response = await fetch(`/api/quote/${symbol}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch price for ${symbol}`);
    }

    const json: ApiResponse = await response.json();

    if (!json.success || !json.data) {
      throw new Error(json.error || `No data for ${symbol}`);
    }

    return json.data;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Custom hook for fetching and caching ETF prices
 * Automatically refreshes prices during market hours
 *
 * @param symbols - Array of ETF symbols to fetch prices for
 * @returns Object containing prices, loading state, error, and refresh function
 *
 * @example
 * const { prices, isLoading, error, refresh } = usePrices(['SPY', 'VOO', 'QQQ']);
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage message={error} />;
 *
 * const spyPrice = prices.get('SPY');
 * console.log(`SPY: $${spyPrice?.currentPrice}`);
 */
export function usePrices(symbols: string[]): UsePricesResult {
  const [prices, setPrices] = useState<Map<string, ETFPriceData>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Track which symbolsKey the current prices correspond to
  const [loadedSymbolsKey, setLoadedSymbolsKey] = useState<string>('');

  // Use ref to track mounted state and avoid memory leaks
  const isMountedRef = useRef<boolean>(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasFetchedRef = useRef<boolean>(false);

  // Normalize symbols to uppercase
  const normalizedSymbols = symbols.map((s) => s.toUpperCase().trim());
  const symbolsKey = normalizedSymbols.sort().join(',');

  // Compute hasLoaded based on whether current prices match the requested symbols
  const hasLoaded = symbolsKey === '' || loadedSymbolsKey === symbolsKey;

  // Track the current fetch operation to prevent race conditions
  const currentFetchIdRef = useRef<number>(0);

  /**
   * Fetch prices for all symbols from API
   * Always fetches fresh data to ensure accuracy
   */
  const fetchPrices = useCallback(async () => {
    // Parse symbols from stable symbolsKey
    const symbolsToProcess = symbolsKey ? symbolsKey.split(',').filter(Boolean) : [];

    if (symbolsToProcess.length === 0) {
      setPrices(new Map());
      setLoadedSymbolsKey('');
      return;
    }

    // Increment fetch ID to track this specific fetch operation
    const fetchId = ++currentFetchIdRef.current;

    setIsLoading(true);
    setError(null);

    const newPrices = new Map<string, ETFPriceData>();
    let failedCount = 0;

    // Fetch all symbols from API (always fetch fresh to ensure data consistency)
    const fetchPromises = symbolsToProcess.map((symbol) => fetchPrice(symbol));
    const results = await Promise.all(fetchPromises);

    // Check if this fetch is still the current one (prevent race conditions)
    if (fetchId !== currentFetchIdRef.current) {
      return; // A newer fetch has started, discard these results
    }

    for (let i = 0; i < symbolsToProcess.length; i++) {
      const symbol = symbolsToProcess[i];
      const result = results[i];

      if (result) {
        newPrices.set(symbol, result);
        // Update cache with fresh data
        updatePriceCache(symbol, result);
      } else {
        failedCount++;
        // Try to use cache as fallback
        const cached = getCachedPrice(symbol);
        if (cached) {
          newPrices.set(symbol, {
            symbol,
            currentPrice: cached.price,
            previousClose: 0,
            change: 0,
            changePercent: 0,
            high52Week: 0,
            low52Week: 0,
            ytdChange: 0,
          });
        }
      }
    }

    if (failedCount > 0 && failedCount === symbolsToProcess.length) {
      setError('Failed to fetch price data. Please try again later.');
    } else if (failedCount > 0) {
      setError(`Failed to fetch ${failedCount} of ${symbolsToProcess.length} prices.`);
    }

    if (isMountedRef.current && fetchId === currentFetchIdRef.current) {
      setPrices(newPrices);
      setIsLoading(false);
      // Mark which symbols have been loaded
      setLoadedSymbolsKey(symbolsKey);
    }
  }, [symbolsKey]);

  /**
   * Manual refresh function
   */
  const refresh = useCallback(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Store previous symbolsKey to detect changes
  const prevSymbolsKeyRef = useRef<string>('');

  // Setup subscription for initial fetch and auto-refresh
  useEffect(() => {
    isMountedRef.current = true;

    // Reset hasFetched if symbols changed
    if (prevSymbolsKeyRef.current !== symbolsKey) {
      hasFetchedRef.current = false;
      prevSymbolsKeyRef.current = symbolsKey;
    }

    // Set up auto-refresh during market hours
    const setupAutoRefresh = () => {
      // Clear any existing interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }

      // Only auto-refresh if market is open
      if (isMarketOpen()) {
        refreshIntervalRef.current = setInterval(() => {
          if (isMountedRef.current && isMarketOpen()) {
            fetchPrices();
          }
        }, CACHE_TTL.MARKET_HOURS);
      }
    };

    // Initial fetch - wrapped in async IIFE for proper async handling
    if (!hasFetchedRef.current && symbolsKey) {
      hasFetchedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchPrices();
    }

    setupAutoRefresh();

    // Check market status every minute to start/stop auto-refresh
    const marketCheckInterval = setInterval(() => {
      setupAutoRefresh();
    }, 60 * 1000);

    return () => {
      isMountedRef.current = false;
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      clearInterval(marketCheckInterval);
    };
  }, [fetchPrices, symbolsKey]);

  return {
    prices,
    isLoading,
    hasLoaded,
    error,
    refresh,
  };
}
