/**
 * Date utilities for the Investo app
 */

/**
 * Format a date as a readable string
 *
 * @param date - The date to format (string or Date object)
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 *
 * @example
 * formatDate(new Date()) // "Feb 18, 2026"
 * formatDate('2024-01-15') // "Jan 15, 2024"
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Get January 1st of the current year
 *
 * @returns Date object representing the start of the current year
 *
 * @example
 * getYearStart() // Date for Jan 1, 2026
 */
export function getYearStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1);
}

/**
 * Calculate the number of days between two dates
 *
 * @param start - The start date
 * @param end - The end date
 * @returns Number of days between the dates (can be negative if end is before start)
 *
 * @example
 * getDaysBetween(new Date('2024-01-01'), new Date('2024-01-10')) // 9
 */
export function getDaysBetween(start: Date, end: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const startTime = start.getTime();
  const endTime = end.getTime();

  return Math.floor((endTime - startTime) / msPerDay);
}

/**
 * Check if the US stock market is currently open
 * Market hours: Monday-Friday, 9:30 AM - 4:00 PM Eastern Time
 *
 * Note: This does not account for market holidays
 *
 * @returns true if market is open, false otherwise
 *
 * @example
 * isMarketOpen() // true/false based on current time
 */
export function isMarketOpen(): boolean {
  const now = new Date();

  // Convert to Eastern Time
  const eastern = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));

  const dayOfWeek = eastern.getDay();
  const hours = eastern.getHours();
  const minutes = eastern.getMinutes();
  const currentTimeInMinutes = hours * 60 + minutes;

  // Market hours: 9:30 AM (570 minutes) to 4:00 PM (960 minutes)
  const marketOpen = 9 * 60 + 30; // 9:30 AM = 570 minutes
  const marketClose = 16 * 60;     // 4:00 PM = 960 minutes

  // Check if it's a weekday (Monday = 1, Friday = 5)
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

  // Check if within market hours
  const isDuringMarketHours = currentTimeInMinutes >= marketOpen && currentTimeInMinutes < marketClose;

  return isWeekday && isDuringMarketHours;
}

/**
 * Format a date as an ISO date string (YYYY-MM-DD)
 *
 * @param date - The date to format
 * @returns ISO date string (e.g., "2024-01-15")
 *
 * @example
 * toISODateString(new Date('2024-01-15')) // "2024-01-15"
 */
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
