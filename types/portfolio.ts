/**
 * Portfolio type definitions for the Investo ETF tracking app
 */

/**
 * Represents an Exchange-Traded Fund (ETF)
 */
export interface ETF {
  /** Unique ticker symbol (e.g., "SPY", "VOO") */
  symbol: string;
  /** Full name of the ETF */
  name: string;
  /** Stock exchange where the ETF is traded (e.g., "NYSE", "NASDAQ") */
  exchange?: string;
  /** Currency code for the ETF's trading currency (e.g., "USD", "EUR") */
  currency: string;
}

/**
 * Represents a single purchase transaction of an ETF
 */
export interface Purchase {
  /** Unique identifier for the purchase */
  id: string;
  /** Symbol of the ETF that was purchased */
  etfSymbol: string;
  /** Date of purchase in ISO 8601 format (e.g., "2024-01-15") */
  purchaseDate: string;
  /** Number of shares purchased */
  shares: number;
  /** Price paid per share at time of purchase */
  pricePerShare: number;
  /** Total cost of the purchase (shares * pricePerShare + fees) */
  totalCost: number;
  /** Transaction fees or commissions paid */
  fees: number;
  /** Optional notes about the purchase */
  notes?: string;
  /** Timestamp when the purchase record was created (ISO 8601) */
  createdAt: string;
  /** Timestamp when the purchase record was last updated (ISO 8601) */
  updatedAt: string;
}

/**
 * Cached ETF data including current pricing information
 */
export interface ETFCacheEntry {
  /** ETF details */
  etf: ETF;
  /** Current market price per share */
  currentPrice: number;
  /** Previous trading day's closing price */
  previousClose: number;
  /** Timestamp when the cache was last updated (ISO 8601) */
  lastUpdated: string;
  /** Price at the start of the current year (for YTD calculations) */
  ytdStartPrice: number;
}

/**
 * Cache of ETF data indexed by symbol
 */
export type ETFCache = Record<string, ETFCacheEntry>;

/**
 * Represents a user's investment portfolio
 */
export interface Portfolio {
  /** Unique identifier for the portfolio */
  id: string;
  /** User-defined name for the portfolio */
  name: string;
  /** Array of all purchase transactions in this portfolio */
  purchases: Purchase[];
  /** Cached ETF data for quick access to prices and details */
  etfCache: ETFCache;
  /** Timestamp when the portfolio was created (ISO 8601) */
  createdAt: string;
  /** Timestamp when the portfolio was last updated (ISO 8601) */
  updatedAt: string;
  /** Schema version for data migration purposes */
  version: number;
}

/**
 * Current price data for an ETF
 */
export interface ETFPriceData {
  /** ETF ticker symbol */
  symbol: string;
  /** Current market price per share */
  currentPrice: number;
  /** Previous trading day's closing price */
  previousClose: number;
  /** Price change from previous close (currentPrice - previousClose) */
  change: number;
  /** Percentage change from previous close */
  changePercent: number;
  /** 52-week high price */
  high52Week: number;
  /** 52-week low price */
  low52Week: number;
  /** Year-to-date percentage change */
  ytdChange: number;
}

/**
 * Performance metrics for a single purchase
 */
export interface PurchaseMetrics {
  /** ID of the purchase this metrics relates to */
  purchaseId: string;
  /** Symbol of the ETF */
  etfSymbol: string;
  /** Number of shares in this purchase */
  shares: number;
  /** Original cost basis (total amount paid including fees) */
  costBasis: number;
  /** Current market value of the shares */
  currentValue: number;
  /** Unrealized gain or loss (currentValue - costBasis) */
  gainLoss: number;
  /** Percentage gain or loss */
  gainLossPercent: number;
  /** Number of days since purchase */
  holdingPeriodDays: number;
  /** Annualized return percentage (CAGR) */
  annualizedReturn: number;
}

/**
 * Aggregated metrics for all holdings of a single ETF
 */
export interface ETFHoldingMetrics {
  /** Symbol of the ETF */
  etfSymbol: string;
  /** Full name of the ETF */
  etfName: string;
  /** Total shares owned across all purchases */
  totalShares: number;
  /** Weighted average cost per share */
  averageCostPerShare: number;
  /** Total cost basis for all shares of this ETF */
  totalCostBasis: number;
  /** Current price per share */
  currentPrice: number;
  /** Current market value of all shares */
  currentValue: number;
  /** Total unrealized gain or loss */
  totalGainLoss: number;
  /** Percentage gain or loss */
  totalGainLossPercent: number;
  /** Percentage of total portfolio value this ETF represents */
  weightInPortfolio: number;
  /** Individual purchase metrics for this ETF */
  purchases: PurchaseMetrics[];
}

/**
 * Overall portfolio performance metrics
 */
export interface PortfolioMetrics {
  /** Total amount invested (sum of all cost bases) */
  totalInvested: number;
  /** Current market value of entire portfolio */
  currentValue: number;
  /** Total unrealized gain or loss */
  totalGainLoss: number;
  /** Percentage gain or loss for entire portfolio */
  totalGainLossPercent: number;
  /** Year-to-date gain or loss in currency */
  ytdGainLoss: number;
  /** Year-to-date percentage gain or loss */
  ytdGainLossPercent: number;
  /** Metrics for each ETF holding in the portfolio */
  holdings: ETFHoldingMetrics[];
  /** Timestamp when metrics were last calculated (ISO 8601) */
  lastUpdated: string;
}

/**
 * Form data for adding a new purchase
 * Uses string types for form inputs that will be parsed before submission
 */
export interface PurchaseFormData {
  /** ETF ticker symbol */
  etfSymbol: string;
  /** Date of purchase (YYYY-MM-DD format) */
  purchaseDate: string;
  /** Number of shares (as string for form input) */
  shares: string;
  /** Price per share (as string for form input) */
  pricePerShare: string;
  /** Transaction fees (as string for form input) */
  fees: string;
  /** Optional notes about the purchase */
  notes: string;
}
