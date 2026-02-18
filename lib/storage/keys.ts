/**
 * Storage key constants for localStorage persistence
 * All keys are prefixed with 'investo_' to avoid conflicts with other applications
 */

/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  /** Key for storing the user's portfolio data */
  PORTFOLIO: 'investo_portfolio',
  /** Key for storing user settings/preferences */
  SETTINGS: 'investo_settings',
  /** Key for storing cached ETF price data */
  PRICE_CACHE: 'investo_price_cache',
  /** Key for storing the current schema version for migrations */
  SCHEMA_VERSION: 'investo_schema_version',
} as const;

/**
 * Current schema version for data migration purposes
 * Increment this when making breaking changes to data structures
 */
export const CURRENT_SCHEMA_VERSION = 1;

/**
 * Type for storage keys
 */
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
