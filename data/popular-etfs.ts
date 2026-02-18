/**
 * Popular ETFs data for the Investo app
 * Provides a curated list of commonly traded ETFs across different categories
 */

export type ETFCategory =
  | 'US Total Market'
  | 'S&P 500'
  | 'Tech'
  | 'International'
  | 'Bonds'
  | 'Commodities';

export interface PopularETF {
  /** ETF ticker symbol */
  symbol: string;
  /** Full name of the ETF */
  name: string;
  /** Category classification */
  category: ETFCategory;
}

/**
 * Curated list of popular ETFs across various asset classes
 * These are commonly used ETFs for diversified investment portfolios
 */
export const POPULAR_ETFS: PopularETF[] = [
  // US Total Market
  {
    symbol: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    category: 'US Total Market',
  },
  {
    symbol: 'ITOT',
    name: 'iShares Core S&P Total US Stock Market ETF',
    category: 'US Total Market',
  },

  // S&P 500
  {
    symbol: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    category: 'S&P 500',
  },
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    category: 'S&P 500',
  },
  {
    symbol: 'IVV',
    name: 'iShares Core S&P 500 ETF',
    category: 'S&P 500',
  },

  // Tech
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust (NASDAQ-100)',
    category: 'Tech',
  },
  {
    symbol: 'VGT',
    name: 'Vanguard Information Technology ETF',
    category: 'Tech',
  },

  // International
  {
    symbol: 'VEA',
    name: 'Vanguard FTSE Developed Markets ETF',
    category: 'International',
  },
  {
    symbol: 'VWO',
    name: 'Vanguard FTSE Emerging Markets ETF',
    category: 'International',
  },
  {
    symbol: 'VXUS',
    name: 'Vanguard Total International Stock ETF',
    category: 'International',
  },
  {
    symbol: 'IWM',
    name: 'iShares Russell 2000 ETF',
    category: 'US Total Market',
  },

  // Bonds
  {
    symbol: 'BND',
    name: 'Vanguard Total Bond Market ETF',
    category: 'Bonds',
  },
  {
    symbol: 'AGG',
    name: 'iShares Core U.S. Aggregate Bond ETF',
    category: 'Bonds',
  },
  {
    symbol: 'TLT',
    name: 'iShares 20+ Year Treasury Bond ETF',
    category: 'Bonds',
  },

  // Commodities
  {
    symbol: 'GLD',
    name: 'SPDR Gold Shares',
    category: 'Commodities',
  },
];

/**
 * Get ETFs filtered by category
 */
export function getETFsByCategory(category: ETFCategory): PopularETF[] {
  return POPULAR_ETFS.filter((etf) => etf.category === category);
}

/**
 * Get all unique categories from the popular ETFs list
 */
export function getCategories(): ETFCategory[] {
  return [...new Set(POPULAR_ETFS.map((etf) => etf.category))];
}

/**
 * Find an ETF by symbol
 */
export function findETFBySymbol(symbol: string): PopularETF | undefined {
  return POPULAR_ETFS.find(
    (etf) => etf.symbol.toUpperCase() === symbol.toUpperCase()
  );
}
