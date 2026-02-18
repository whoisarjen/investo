/**
 * UUID generation utility
 */

/**
 * Generate a unique identifier
 * Uses crypto.randomUUID() if available, falls back to a custom implementation
 *
 * @returns A unique identifier string (UUID v4 format)
 *
 * @example
 * generateId() // "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateId(): string {
  // Use native crypto.randomUUID() if available (modern browsers and Node.js 19+)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback implementation for older environments
  // Generates a UUID v4 format string
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
