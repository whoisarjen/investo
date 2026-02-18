/**
 * Storage Services
 * Barrel export for all localStorage-related functionality
 *
 * @example
 * import {
 *   getPortfolio,
 *   savePortfolio,
 *   addPurchase,
 *   getCachedPrice,
 *   STORAGE_KEYS
 * } from '@/lib/storage';
 */

// Storage keys and constants
export { STORAGE_KEYS, CURRENT_SCHEMA_VERSION } from './keys';
export type { StorageKey } from './keys';

// Safe JSON utilities
export {
  safeJsonParse,
  safeJsonStringify,
  isLocalStorageAvailable,
  safeGetItem,
  safeSetItem,
  safeRemoveItem,
} from './utils';

// Portfolio service
export {
  getPortfolio,
  initializePortfolio,
  savePortfolio,
  addPurchase,
  updatePurchase,
  deletePurchase,
  getPurchasesByETF,
  exportPortfolio,
  importPortfolio,
  clearAllData,
} from './portfolio.service';

// Price cache service
export {
  CACHE_TTL,
  getPriceCache,
  updatePriceCache,
  getCachedPrice,
  getCacheEntry,
  isCacheStale,
  removeCacheEntry,
  clearPriceCache,
  getCacheStats,
  bulkUpdatePriceCache,
  pruneStaleCache,
} from './price-cache.service';
