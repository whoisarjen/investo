/**
 * Portfolio Service
 * Handles all portfolio-related localStorage operations
 */

import type { Portfolio, Purchase, PurchaseFormData } from '@/types';
import { generateId } from '@/lib/utils';
import { STORAGE_KEYS, CURRENT_SCHEMA_VERSION } from './keys';
import {
  safeJsonParse,
  safeJsonStringify,
  safeGetItem,
  safeSetItem,
  safeRemoveItem,
} from './utils';

/**
 * Retrieve the portfolio from localStorage
 *
 * @returns The portfolio if it exists, null otherwise
 *
 * @example
 * const portfolio = getPortfolio();
 * if (portfolio) {
 *   console.log(`Portfolio has ${portfolio.purchases.length} purchases`);
 * }
 */
export function getPortfolio(): Portfolio | null {
  const json = safeGetItem(STORAGE_KEYS.PORTFOLIO);
  if (!json) {
    return null;
  }

  const portfolio = safeJsonParse<Portfolio | null>(json, null);

  // Validate basic structure
  if (!portfolio || !portfolio.id || !Array.isArray(portfolio.purchases)) {
    return null;
  }

  return portfolio;
}

/**
 * Initialize a new portfolio with default values
 *
 * @param name - Optional name for the portfolio (defaults to "My Portfolio")
 * @returns The newly created portfolio (also saved to localStorage)
 *
 * @example
 * const portfolio = initializePortfolio("Retirement Fund");
 */
export function initializePortfolio(name: string = 'My Portfolio'): Portfolio {
  const now = new Date().toISOString();

  const portfolio: Portfolio = {
    id: generateId(),
    name,
    purchases: [],
    etfCache: {},
    createdAt: now,
    updatedAt: now,
    version: CURRENT_SCHEMA_VERSION,
  };

  savePortfolio(portfolio);
  return portfolio;
}

/**
 * Save a portfolio to localStorage
 *
 * @param portfolio - The portfolio to save
 * @throws Error if the portfolio cannot be saved
 *
 * @example
 * portfolio.name = "Updated Name";
 * savePortfolio(portfolio);
 */
export function savePortfolio(portfolio: Portfolio): void {
  const updatedPortfolio: Portfolio = {
    ...portfolio,
    updatedAt: new Date().toISOString(),
  };

  const json = safeJsonStringify(updatedPortfolio);
  if (!json) {
    throw new Error('Failed to serialize portfolio data');
  }

  const success = safeSetItem(STORAGE_KEYS.PORTFOLIO, json);
  if (!success) {
    throw new Error('Failed to save portfolio to localStorage');
  }
}

/**
 * Add a new purchase to the portfolio
 *
 * @param portfolio - The current portfolio
 * @param data - The purchase form data
 * @returns The updated portfolio with the new purchase
 *
 * @example
 * const updatedPortfolio = addPurchase(portfolio, {
 *   etfSymbol: "SPY",
 *   purchaseDate: "2024-01-15",
 *   shares: "10",
 *   pricePerShare: "450.00",
 *   fees: "0",
 *   notes: "Monthly DCA"
 * });
 */
export function addPurchase(
  portfolio: Portfolio,
  data: PurchaseFormData
): Portfolio {
  const now = new Date().toISOString();

  const shares = parseFloat(data.shares);
  const pricePerShare = parseFloat(data.pricePerShare);
  const fees = parseFloat(data.fees) || 0;

  const purchase: Purchase = {
    id: generateId(),
    etfSymbol: data.etfSymbol.toUpperCase().trim(),
    purchaseDate: data.purchaseDate,
    shares,
    pricePerShare,
    totalCost: shares * pricePerShare + fees,
    fees,
    notes: data.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  const updatedPortfolio: Portfolio = {
    ...portfolio,
    purchases: [...portfolio.purchases, purchase],
    updatedAt: now,
  };

  savePortfolio(updatedPortfolio);
  return updatedPortfolio;
}

/**
 * Update an existing purchase in the portfolio
 *
 * @param portfolio - The current portfolio
 * @param id - The ID of the purchase to update
 * @param data - The partial purchase data to update
 * @returns The updated portfolio
 * @throws Error if the purchase is not found
 *
 * @example
 * const updatedPortfolio = updatePurchase(portfolio, "purchase-123", {
 *   shares: "15",
 *   notes: "Increased position"
 * });
 */
export function updatePurchase(
  portfolio: Portfolio,
  id: string,
  data: Partial<PurchaseFormData>
): Portfolio {
  const purchaseIndex = portfolio.purchases.findIndex((p) => p.id === id);

  if (purchaseIndex === -1) {
    throw new Error(`Purchase with ID ${id} not found`);
  }

  const now = new Date().toISOString();
  const existingPurchase = portfolio.purchases[purchaseIndex];

  // Parse numeric fields if provided
  const shares =
    data.shares !== undefined
      ? parseFloat(data.shares)
      : existingPurchase.shares;
  const pricePerShare =
    data.pricePerShare !== undefined
      ? parseFloat(data.pricePerShare)
      : existingPurchase.pricePerShare;
  const fees =
    data.fees !== undefined ? parseFloat(data.fees) : existingPurchase.fees;

  const updatedPurchase: Purchase = {
    ...existingPurchase,
    etfSymbol:
      data.etfSymbol?.toUpperCase().trim() ?? existingPurchase.etfSymbol,
    purchaseDate: data.purchaseDate ?? existingPurchase.purchaseDate,
    shares,
    pricePerShare,
    totalCost: shares * pricePerShare + fees,
    fees,
    notes:
      data.notes !== undefined
        ? data.notes.trim() || undefined
        : existingPurchase.notes,
    updatedAt: now,
  };

  const updatedPurchases = [...portfolio.purchases];
  updatedPurchases[purchaseIndex] = updatedPurchase;

  const updatedPortfolio: Portfolio = {
    ...portfolio,
    purchases: updatedPurchases,
    updatedAt: now,
  };

  savePortfolio(updatedPortfolio);
  return updatedPortfolio;
}

/**
 * Delete a purchase from the portfolio
 *
 * @param portfolio - The current portfolio
 * @param id - The ID of the purchase to delete
 * @returns The updated portfolio without the deleted purchase
 * @throws Error if the purchase is not found
 *
 * @example
 * const updatedPortfolio = deletePurchase(portfolio, "purchase-123");
 */
export function deletePurchase(portfolio: Portfolio, id: string): Portfolio {
  const purchaseIndex = portfolio.purchases.findIndex((p) => p.id === id);

  if (purchaseIndex === -1) {
    throw new Error(`Purchase with ID ${id} not found`);
  }

  const updatedPortfolio: Portfolio = {
    ...portfolio,
    purchases: portfolio.purchases.filter((p) => p.id !== id),
    updatedAt: new Date().toISOString(),
  };

  savePortfolio(updatedPortfolio);
  return updatedPortfolio;
}

/**
 * Get all purchases for a specific ETF
 *
 * @param portfolio - The portfolio to search
 * @param symbol - The ETF symbol to filter by
 * @returns Array of purchases for the specified ETF
 *
 * @example
 * const spyPurchases = getPurchasesByETF(portfolio, "SPY");
 * console.log(`You have ${spyPurchases.length} SPY purchases`);
 */
export function getPurchasesByETF(
  portfolio: Portfolio,
  symbol: string
): Purchase[] {
  const normalizedSymbol = symbol.toUpperCase().trim();
  return portfolio.purchases.filter((p) => p.etfSymbol === normalizedSymbol);
}

/**
 * Export portfolio data as a JSON string
 * Suitable for backup or transfer to another device
 *
 * @param portfolio - The portfolio to export
 * @returns JSON string representation of the portfolio
 *
 * @example
 * const json = exportPortfolio(portfolio);
 * // Save to file or copy to clipboard
 */
export function exportPortfolio(portfolio: Portfolio): string {
  const exportData = {
    ...portfolio,
    exportedAt: new Date().toISOString(),
    version: CURRENT_SCHEMA_VERSION,
  };

  const json = safeJsonStringify(exportData);
  if (!json) {
    throw new Error('Failed to export portfolio data');
  }

  return json;
}

/**
 * Import portfolio data from a JSON string
 * Validates the data structure before importing
 *
 * @param json - The JSON string to import
 * @returns The imported portfolio (also saved to localStorage)
 * @throws Error if the JSON is invalid or data structure is incorrect
 *
 * @example
 * try {
 *   const portfolio = importPortfolio(jsonString);
 *   console.log("Portfolio imported successfully");
 * } catch (error) {
 *   console.error("Import failed:", error.message);
 * }
 */
export function importPortfolio(json: string): Portfolio {
  const data = safeJsonParse<Portfolio | null>(json, null);

  if (!data) {
    throw new Error('Invalid JSON format');
  }

  // Validate required fields
  if (!data.id || typeof data.id !== 'string') {
    throw new Error('Invalid portfolio: missing or invalid id');
  }

  if (!data.name || typeof data.name !== 'string') {
    throw new Error('Invalid portfolio: missing or invalid name');
  }

  if (!Array.isArray(data.purchases)) {
    throw new Error('Invalid portfolio: purchases must be an array');
  }

  // Validate each purchase
  for (const purchase of data.purchases) {
    if (!purchase.id || typeof purchase.id !== 'string') {
      throw new Error('Invalid purchase: missing or invalid id');
    }
    if (!purchase.etfSymbol || typeof purchase.etfSymbol !== 'string') {
      throw new Error('Invalid purchase: missing or invalid etfSymbol');
    }
    if (typeof purchase.shares !== 'number' || purchase.shares <= 0) {
      throw new Error('Invalid purchase: shares must be a positive number');
    }
    if (
      typeof purchase.pricePerShare !== 'number' ||
      purchase.pricePerShare <= 0
    ) {
      throw new Error(
        'Invalid purchase: pricePerShare must be a positive number'
      );
    }
  }

  const now = new Date().toISOString();

  // Create a new portfolio with validated data
  const portfolio: Portfolio = {
    id: data.id,
    name: data.name,
    purchases: data.purchases.map((p) => ({
      ...p,
      // Ensure timestamps exist
      createdAt: p.createdAt || now,
      updatedAt: p.updatedAt || now,
    })),
    etfCache: data.etfCache || {},
    createdAt: data.createdAt || now,
    updatedAt: now,
    version: CURRENT_SCHEMA_VERSION,
  };

  savePortfolio(portfolio);
  return portfolio;
}

/**
 * Clear all application data from localStorage
 * This removes the portfolio, settings, and price cache
 *
 * @example
 * if (confirm("Are you sure you want to delete all data?")) {
 *   clearAllData();
 * }
 */
export function clearAllData(): void {
  safeRemoveItem(STORAGE_KEYS.PORTFOLIO);
  safeRemoveItem(STORAGE_KEYS.SETTINGS);
  safeRemoveItem(STORAGE_KEYS.PRICE_CACHE);
  safeRemoveItem(STORAGE_KEYS.SCHEMA_VERSION);
}
