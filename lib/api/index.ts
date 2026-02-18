/**
 * API utilities barrel export
 * Import API functions from this file for cleaner imports
 *
 * @example
 * import { fetchETFPrice, fetchMultipleETFPrices } from '@/lib/api';
 */

export {
  fetchETFPrice,
  fetchMultipleETFPrices,
  fetchMultipleETFPricesWithErrors,
  PriceFetchError,
} from './price-fetcher';
