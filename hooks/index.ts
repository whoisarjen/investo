/**
 * Custom React Hooks for the Investo app
 * Barrel export for all hooks
 *
 * @example
 * import {
 *   useLocalStorage,
 *   useDebounce,
 *   useMediaQuery,
 *   useIsMobile,
 *   usePrices,
 *   useMetrics,
 * } from '@/hooks';
 */

// Local storage hook
export { useLocalStorage } from './use-local-storage';

// Debounce hook
export { useDebounce } from './use-debounce';

// Media query hooks
export {
  useMediaQuery,
  useIsMobile,
  useIsDesktop,
  BREAKPOINTS,
} from './use-media-query';

// Price fetching hook
export { usePrices } from './use-prices';

// Portfolio metrics hook
export { useMetrics } from './use-metrics';
