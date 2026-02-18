/**
 * Price fetcher utilities for the Investo app
 * Provides functions to fetch ETF price data from the API
 */

import type { ETFPriceData } from '@/types';

/**
 * Error thrown when price fetching fails
 */
export class PriceFetchError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly symbol?: string
  ) {
    super(message);
    this.name = 'PriceFetchError';
  }
}

/**
 * API response structure for successful requests
 */
interface SuccessResponse {
  success: true;
  data: ETFPriceData;
  timestamp: string;
}

/**
 * API response structure for error requests
 */
interface ErrorResponse {
  success: false;
  error: string;
  code: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

/**
 * Fetch price data for a single ETF
 *
 * @param symbol - The ETF ticker symbol (e.g., "VOO", "SPY")
 * @returns Promise resolving to ETFPriceData
 * @throws PriceFetchError if the request fails
 *
 * @example
 * ```ts
 * const priceData = await fetchETFPrice('VOO');
 * console.log(`VOO is trading at $${priceData.currentPrice}`);
 * ```
 */
export async function fetchETFPrice(symbol: string): Promise<ETFPriceData> {
  if (!symbol || typeof symbol !== 'string') {
    throw new PriceFetchError(
      'Symbol is required',
      'INVALID_INPUT',
      symbol
    );
  }

  const normalizedSymbol = symbol.trim().toUpperCase();

  if (normalizedSymbol.length === 0) {
    throw new PriceFetchError(
      'Symbol cannot be empty',
      'INVALID_INPUT',
      symbol
    );
  }

  try {
    const response = await fetch(`/api/quote/${encodeURIComponent(normalizedSymbol)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Use next.js cache options for better performance
      next: {
        revalidate: 60, // Cache for 60 seconds
      },
    });

    if (!response.ok) {
      // Try to parse error response
      const errorData = await response.json().catch(() => null) as ErrorResponse | null;

      throw new PriceFetchError(
        errorData?.error || `HTTP error: ${response.status}`,
        errorData?.code || 'HTTP_ERROR',
        normalizedSymbol
      );
    }

    const data = await response.json() as ApiResponse;

    if (!data.success) {
      throw new PriceFetchError(
        data.error,
        data.code,
        normalizedSymbol
      );
    }

    return data.data;
  } catch (error) {
    // Re-throw PriceFetchError as-is
    if (error instanceof PriceFetchError) {
      throw error;
    }

    // Wrap other errors
    throw new PriceFetchError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'NETWORK_ERROR',
      normalizedSymbol
    );
  }
}

/**
 * Fetch price data for multiple ETFs in parallel
 *
 * @param symbols - Array of ETF ticker symbols
 * @returns Promise resolving to a Map of symbol to ETFPriceData
 *
 * @example
 * ```ts
 * const prices = await fetchMultipleETFPrices(['VOO', 'VTI', 'QQQ']);
 * prices.forEach((data, symbol) => {
 *   console.log(`${symbol}: $${data.currentPrice}`);
 * });
 * ```
 */
export async function fetchMultipleETFPrices(
  symbols: string[]
): Promise<Map<string, ETFPriceData>> {
  if (!Array.isArray(symbols)) {
    throw new PriceFetchError(
      'Symbols must be an array',
      'INVALID_INPUT'
    );
  }

  // Remove duplicates and normalize symbols
  const uniqueSymbols = [...new Set(
    symbols
      .filter((s) => s && typeof s === 'string')
      .map((s) => s.trim().toUpperCase())
  )];

  if (uniqueSymbols.length === 0) {
    return new Map();
  }

  // Fetch all prices in parallel
  const results = await Promise.allSettled(
    uniqueSymbols.map((symbol) => fetchETFPrice(symbol))
  );

  // Build the result map
  const priceMap = new Map<string, ETFPriceData>();

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      priceMap.set(uniqueSymbols[index], result.value);
    } else {
      // Log errors but don't fail the entire operation
      console.warn(
        `Failed to fetch price for ${uniqueSymbols[index]}:`,
        result.reason instanceof Error ? result.reason.message : result.reason
      );
    }
  });

  return priceMap;
}

/**
 * Fetch price data for multiple ETFs, returning errors alongside results
 * Useful when you need to know which specific fetches failed
 *
 * @param symbols - Array of ETF ticker symbols
 * @returns Promise resolving to an object with results and errors
 */
export async function fetchMultipleETFPricesWithErrors(
  symbols: string[]
): Promise<{
  results: Map<string, ETFPriceData>;
  errors: Map<string, Error>;
}> {
  if (!Array.isArray(symbols)) {
    throw new PriceFetchError(
      'Symbols must be an array',
      'INVALID_INPUT'
    );
  }

  // Remove duplicates and normalize symbols
  const uniqueSymbols = [...new Set(
    symbols
      .filter((s) => s && typeof s === 'string')
      .map((s) => s.trim().toUpperCase())
  )];

  if (uniqueSymbols.length === 0) {
    return { results: new Map(), errors: new Map() };
  }

  // Fetch all prices in parallel
  const settledResults = await Promise.allSettled(
    uniqueSymbols.map((symbol) => fetchETFPrice(symbol))
  );

  // Build result and error maps
  const results = new Map<string, ETFPriceData>();
  const errors = new Map<string, Error>();

  settledResults.forEach((result, index) => {
    const symbol = uniqueSymbols[index];
    if (result.status === 'fulfilled') {
      results.set(symbol, result.value);
    } else {
      errors.set(
        symbol,
        result.reason instanceof Error
          ? result.reason
          : new Error(String(result.reason))
      );
    }
  });

  return { results, errors };
}
