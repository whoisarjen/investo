/**
 * Safe JSON utilities for localStorage operations
 * These functions handle errors gracefully and provide fallback values
 */

/**
 * Safely parse a JSON string with error handling
 * Returns the fallback value if parsing fails
 *
 * @param json - The JSON string to parse
 * @param fallback - The fallback value to return if parsing fails
 * @returns The parsed value or the fallback
 *
 * @example
 * const data = safeJsonParse<Portfolio>(jsonString, null);
 * const settings = safeJsonParse<Settings>(settingsJson, defaultSettings);
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(json) as T;
    return parsed;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to parse JSON:', error);
    }
    return fallback;
  }
}

/**
 * Safely stringify a value to JSON with error handling
 * Returns null if stringification fails (e.g., circular references)
 *
 * @param data - The data to stringify
 * @returns The JSON string or null if stringification fails
 *
 * @example
 * const json = safeJsonStringify(portfolio);
 * if (json) {
 *   localStorage.setItem('portfolio', json);
 * }
 */
export function safeJsonStringify(data: unknown): string | null {
  try {
    return JSON.stringify(data);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to stringify JSON:', error);
    }
    return null;
  }
}

/**
 * Check if localStorage is available
 * This is useful for SSR environments where localStorage may not exist
 *
 * @returns true if localStorage is available, false otherwise
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely get an item from localStorage
 * Returns null if localStorage is unavailable or item doesn't exist
 *
 * @param key - The storage key
 * @returns The stored value or null
 */
export function safeGetItem(key: string): string | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safely set an item in localStorage
 * Silently fails if localStorage is unavailable
 *
 * @param key - The storage key
 * @param value - The value to store
 * @returns true if successful, false otherwise
 */
export function safeSetItem(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    // Handle quota exceeded or other errors
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to set localStorage item:', error);
    }
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 *
 * @param key - The storage key to remove
 * @returns true if successful, false otherwise
 */
export function safeRemoveItem(key: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
