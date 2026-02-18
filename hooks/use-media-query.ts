'use client';

import { useSyncExternalStore, useCallback } from 'react';

/**
 * Breakpoint constants for consistent responsive design
 */
export const BREAKPOINTS = {
  /** Mobile devices (max-width: 768px) */
  MOBILE: '(max-width: 768px)',
  /** Tablet devices (min-width: 769px) and (max-width: 1023px) */
  TABLET: '(min-width: 769px) and (max-width: 1023px)',
  /** Desktop devices (min-width: 1024px) */
  DESKTOP: '(min-width: 1024px)',
} as const;

/**
 * Custom hook for responsive design using CSS media queries
 * Uses useSyncExternalStore for proper React 18+ subscription pattern
 *
 * @param query - The CSS media query string (e.g., "(max-width: 768px)")
 * @returns Boolean indicating if the media query matches
 *
 * @example
 * const isNarrow = useMediaQuery('(max-width: 600px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === 'undefined') {
        return () => {};
      }

      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Check if the viewport is mobile-sized (max-width: 768px)
 *
 * @returns Boolean indicating if viewport is mobile size
 *
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) {
 *   // Render mobile-optimized UI
 * }
 */
export function useIsMobile(): boolean {
  return useMediaQuery(BREAKPOINTS.MOBILE);
}

/**
 * Check if the viewport is desktop-sized (min-width: 1024px)
 *
 * @returns Boolean indicating if viewport is desktop size
 *
 * @example
 * const isDesktop = useIsDesktop();
 * if (isDesktop) {
 *   // Render desktop-optimized UI with sidebar
 * }
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(BREAKPOINTS.DESKTOP);
}
