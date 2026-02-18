/**
 * Price Cache Service
 * Handles caching of ETF price data to reduce API calls
 * Uses different TTL values based on market hours
 */

import type { ETFCache, ETFCacheEntry, ETFPriceData } from '@/types';
import { isMarketOpen } from '@/lib/utils';
import { STORAGE_KEYS } from './keys';
import {
  safeJsonParse,
  safeJsonStringify,
  safeGetItem,
  safeSetItem,
  safeRemoveItem,
} from './utils';

/**
 * Cache Time-To-Live (TTL) constants in milliseconds
 */
export const CACHE_TTL = {
  /** TTL during market hours - 5 minutes */
  MARKET_HOURS: 5 * 60 * 1000,
  /** TTL during after hours - 30 minutes */
  AFTER_HOURS: 30 * 60 * 1000,
  /** TTL for weekends/holidays - 1 hour */
  CLOSED: 60 * 60 * 1000,
} as const;

/**
 * Get the appropriate cache TTL based on current market status
 *
 * @returns The TTL in milliseconds
 */
function getCurrentCacheTTL(): number {
  if (isMarketOpen()) {
    return CACHE_TTL.MARKET_HOURS;
  }

  // Check if it's a weekend (US market closed)
  const now = new Date();
  const day = now.getDay();
  if (day === 0 || day === 6) {
    return CACHE_TTL.CLOSED;
  }

  return CACHE_TTL.AFTER_HOURS;
}

/**
 * Retrieve the entire price cache from localStorage
 *
 * @returns The ETF price cache object
 *
 * @example
 * const cache = getPriceCache();
 * const spyData = cache["SPY"];
 */
export function getPriceCache(): ETFCache {
  const json = safeGetItem(STORAGE_KEYS.PRICE_CACHE);
  if (!json) {
    return {};
  }

  return safeJsonParse<ETFCache>(json, {});
}

/**
 * Save the price cache to localStorage
 *
 * @param cache - The cache object to save
 */
function savePriceCache(cache: ETFCache): void {
  const json = safeJsonStringify(cache);
  if (json) {
    safeSetItem(STORAGE_KEYS.PRICE_CACHE, json);
  }
}

/**
 * Update or add price data for a specific ETF in the cache
 *
 * @param symbol - The ETF symbol
 * @param data - The price data to cache
 *
 * @example
 * updatePriceCache("SPY", {
 *   symbol: "SPY",
 *   currentPrice: 450.25,
 *   previousClose: 448.50,
 *   change: 1.75,
 *   changePercent: 0.39,
 *   high52Week: 480.00,
 *   low52Week: 410.00,
 *   ytdChange: 12.5
 * });
 */
export function updatePriceCache(symbol: string, data: ETFPriceData): void {
  const normalizedSymbol = symbol.toUpperCase().trim();
  const cache = getPriceCache();
  const now = new Date().toISOString();

  const cacheEntry: ETFCacheEntry = {
    etf: {
      symbol: normalizedSymbol,
      name: '', // Will be populated if available
      currency: 'USD',
    },
    currentPrice: data.currentPrice,
    previousClose: data.previousClose,
    lastUpdated: now,
    ytdStartPrice: data.currentPrice / (1 + data.ytdChange / 100),
  };

  cache[normalizedSymbol] = cacheEntry;
  savePriceCache(cache);
}

/**
 * Get cached price for a specific ETF
 * Returns the price and whether it's considered stale
 *
 * @param symbol - The ETF symbol to look up
 * @returns Object with price and stale status, or null if not cached
 *
 * @example
 * const cached = getCachedPrice("SPY");
 * if (cached && !cached.stale) {
 *   // Use cached price
 *   console.log(`SPY price: $${cached.price}`);
 * } else {
 *   // Fetch fresh price from API
 * }
 */
export function getCachedPrice(
  symbol: string
): { price: number; stale: boolean } | null {
  const normalizedSymbol = symbol.toUpperCase().trim();
  const cache = getPriceCache();
  const entry = cache[normalizedSymbol];

  if (!entry) {
    return null;
  }

  const lastUpdated = new Date(entry.lastUpdated).getTime();
  const now = Date.now();
  const age = now - lastUpdated;
  const ttl = getCurrentCacheTTL();

  return {
    price: entry.currentPrice,
    stale: age > ttl,
  };
}

/**
 * Get a full cache entry for a specific ETF
 *
 * @param symbol - The ETF symbol to look up
 * @returns The cache entry or null if not found
 *
 * @example
 * const entry = getCacheEntry("SPY");
 * if (entry) {
 *   console.log(`Previous close: $${entry.previousClose}`);
 * }
 */
export function getCacheEntry(symbol: string): ETFCacheEntry | null {
  const normalizedSymbol = symbol.toUpperCase().trim();
  const cache = getPriceCache();
  return cache[normalizedSymbol] || null;
}

/**
 * Check if a cached entry is stale based on current market conditions
 *
 * @param symbol - The ETF symbol to check
 * @returns true if stale or not cached, false if fresh
 *
 * @example
 * if (isCacheStale("SPY")) {
 *   await refreshPrice("SPY");
 * }
 */
export function isCacheStale(symbol: string): boolean {
  const cached = getCachedPrice(symbol);
  return !cached || cached.stale;
}

/**
 * Remove a specific ETF from the cache
 *
 * @param symbol - The ETF symbol to remove
 *
 * @example
 * removeCacheEntry("SPY");
 */
export function removeCacheEntry(symbol: string): void {
  const normalizedSymbol = symbol.toUpperCase().trim();
  const cache = getPriceCache();

  if (cache[normalizedSymbol]) {
    delete cache[normalizedSymbol];
    savePriceCache(cache);
  }
}

/**
 * Clear all cached price data
 *
 * @example
 * clearPriceCache();
 * // All ETF prices will need to be fetched fresh
 */
export function clearPriceCache(): void {
  safeRemoveItem(STORAGE_KEYS.PRICE_CACHE);
}

/**
 * Get cache statistics for debugging/display
 *
 * @returns Object with cache statistics
 *
 * @example
 * const stats = getCacheStats();
 * console.log(`${stats.totalEntries} ETFs cached, ${stats.staleEntries} stale`);
 */
export function getCacheStats(): {
  totalEntries: number;
  staleEntries: number;
  freshEntries: number;
  symbols: string[];
} {
  const cache = getPriceCache();
  const symbols = Object.keys(cache);
  const ttl = getCurrentCacheTTL();
  const now = Date.now();

  let staleCount = 0;
  let freshCount = 0;

  for (const symbol of symbols) {
    const entry = cache[symbol];
    const lastUpdated = new Date(entry.lastUpdated).getTime();
    const age = now - lastUpdated;

    if (age > ttl) {
      staleCount++;
    } else {
      freshCount++;
    }
  }

  return {
    totalEntries: symbols.length,
    staleEntries: staleCount,
    freshEntries: freshCount,
    symbols,
  };
}

/**
 * Bulk update multiple ETF prices at once
 *
 * @param priceData - Array of ETF price data to cache
 *
 * @example
 * bulkUpdatePriceCache([
 *   { symbol: "SPY", currentPrice: 450.25, ... },
 *   { symbol: "VOO", currentPrice: 420.50, ... }
 * ]);
 */
export function bulkUpdatePriceCache(priceData: ETFPriceData[]): void {
  const cache = getPriceCache();
  const now = new Date().toISOString();

  for (const data of priceData) {
    const normalizedSymbol = data.symbol.toUpperCase().trim();

    const cacheEntry: ETFCacheEntry = {
      etf: {
        symbol: normalizedSymbol,
        name: '',
        currency: 'USD',
      },
      currentPrice: data.currentPrice,
      previousClose: data.previousClose,
      lastUpdated: now,
      ytdStartPrice: data.currentPrice / (1 + data.ytdChange / 100),
    };

    cache[normalizedSymbol] = cacheEntry;
  }

  savePriceCache(cache);
}

/**
 * Prune stale entries from the cache
 * Useful for cleaning up old data
 *
 * @param maxAge - Maximum age in milliseconds (defaults to 24 hours)
 * @returns Number of entries removed
 *
 * @example
 * const removed = pruneStaleCache();
 * console.log(`Removed ${removed} stale entries`);
 */
export function pruneStaleCache(maxAge: number = 24 * 60 * 60 * 1000): number {
  const cache = getPriceCache();
  const now = Date.now();
  let removedCount = 0;

  for (const symbol of Object.keys(cache)) {
    const entry = cache[symbol];
    const lastUpdated = new Date(entry.lastUpdated).getTime();
    const age = now - lastUpdated;

    if (age > maxAge) {
      delete cache[symbol];
      removedCount++;
    }
  }

  if (removedCount > 0) {
    savePriceCache(cache);
  }

  return removedCount;
}
