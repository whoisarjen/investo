/**
 * Mock price data for popular ETFs
 * Used for development and testing when external API access is not available
 *
 * Prices are based on realistic values as of early 2024
 */

export interface MockPriceEntry {
  /** Current market price per share */
  price: number;
  /** Previous trading day's closing price */
  previousClose: number;
  /** Price at the start of the current year (for YTD calculations) */
  ytdStartPrice: number;
  /** 52-week high price */
  high52Week: number;
  /** 52-week low price */
  low52Week: number;
}

/**
 * Mock prices for popular ETFs
 * Values represent realistic price levels for these ETFs
 */
export const MOCK_PRICES: Record<string, MockPriceEntry> = {
  // S&P 500 ETFs
  VOO: {
    price: 477.85,
    previousClose: 475.32,
    ytdStartPrice: 437.92,
    high52Week: 485.47,
    low52Week: 382.61,
  },
  SPY: {
    price: 519.42,
    previousClose: 516.73,
    ytdStartPrice: 475.31,
    high52Week: 527.89,
    low52Week: 415.23,
  },
  IVV: {
    price: 522.15,
    previousClose: 519.48,
    ytdStartPrice: 478.25,
    high52Week: 530.12,
    low52Week: 417.95,
  },

  // US Total Market
  VTI: {
    price: 262.34,
    previousClose: 260.87,
    ytdStartPrice: 239.42,
    high52Week: 268.94,
    low52Week: 210.53,
  },
  ITOT: {
    price: 117.82,
    previousClose: 117.15,
    ytdStartPrice: 107.65,
    high52Week: 120.45,
    low52Week: 94.72,
  },
  IWM: {
    price: 201.56,
    previousClose: 199.42,
    ytdStartPrice: 198.75,
    high52Week: 211.34,
    low52Week: 166.29,
  },

  // Tech
  QQQ: {
    price: 431.27,
    previousClose: 427.54,
    ytdStartPrice: 403.62,
    high52Week: 445.82,
    low52Week: 311.74,
  },
  VGT: {
    price: 524.68,
    previousClose: 520.35,
    ytdStartPrice: 487.23,
    high52Week: 542.15,
    low52Week: 378.42,
  },

  // International
  VEA: {
    price: 48.73,
    previousClose: 48.52,
    ytdStartPrice: 45.87,
    high52Week: 50.23,
    low52Week: 41.35,
  },
  VWO: {
    price: 41.92,
    previousClose: 41.78,
    ytdStartPrice: 40.15,
    high52Week: 44.12,
    low52Week: 36.54,
  },
  VXUS: {
    price: 58.45,
    previousClose: 58.21,
    ytdStartPrice: 54.87,
    high52Week: 60.15,
    low52Week: 49.82,
  },

  // Bonds
  BND: {
    price: 72.84,
    previousClose: 72.95,
    ytdStartPrice: 71.25,
    high52Week: 75.42,
    low52Week: 69.15,
  },
  AGG: {
    price: 98.52,
    previousClose: 98.67,
    ytdStartPrice: 96.35,
    high52Week: 101.24,
    low52Week: 93.48,
  },
  TLT: {
    price: 95.42,
    previousClose: 95.87,
    ytdStartPrice: 91.25,
    high52Week: 107.58,
    low52Week: 82.36,
  },

  // Commodities
  GLD: {
    price: 192.35,
    previousClose: 191.82,
    ytdStartPrice: 188.45,
    high52Week: 198.72,
    low52Week: 168.23,
  },
};

/**
 * Generate a deterministic hash from a string
 * Used to create consistent "random" prices for unknown ETF symbols
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate mock price data for an unknown ETF symbol
 * Uses a deterministic algorithm based on the symbol to ensure consistency
 */
export function generateMockPrice(symbol: string): MockPriceEntry {
  const hash = hashString(symbol.toUpperCase());

  // Generate a base price between 20 and 500
  const basePrice = 20 + (hash % 480);

  // Add some decimal variation
  const price = basePrice + (hash % 100) / 100;

  // Previous close is slightly different (within 2%)
  const changePercent = ((hash % 400) - 200) / 10000; // -2% to +2%
  const previousClose = price / (1 + changePercent);

  // YTD start price (within 15% of current price)
  const ytdChangePercent = ((hash % 3000) - 1500) / 10000; // -15% to +15%
  const ytdStartPrice = price / (1 + ytdChangePercent);

  // 52-week high (5-20% above current)
  const highPercent = 0.05 + (hash % 15) / 100;
  const high52Week = price * (1 + highPercent);

  // 52-week low (10-30% below current)
  const lowPercent = 0.1 + (hash % 20) / 100;
  const low52Week = price * (1 - lowPercent);

  return {
    price: Math.round(price * 100) / 100,
    previousClose: Math.round(previousClose * 100) / 100,
    ytdStartPrice: Math.round(ytdStartPrice * 100) / 100,
    high52Week: Math.round(high52Week * 100) / 100,
    low52Week: Math.round(low52Week * 100) / 100,
  };
}
