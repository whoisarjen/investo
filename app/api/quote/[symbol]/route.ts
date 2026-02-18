/**
 * API Route: GET /api/quote/[symbol]
 * Fetches price data for a specific ETF symbol
 *
 * Returns mock data for development purposes
 * In production, this would connect to a real financial data provider
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ETFPriceData } from '@/types';
import { MOCK_PRICES, generateMockPrice } from '@/data/mock-prices';

/**
 * API response structure for successful requests
 */
interface SuccessResponse {
  success: true;
  data: ETFPriceData;
  timestamp: string;
}

/**
 * API response structure for error requests
 */
interface ErrorResponse {
  success: false;
  error: string;
  code: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

/**
 * Validates an ETF symbol
 * - Must be 1-10 uppercase letters or numbers
 * - No special characters
 */
function isValidSymbol(symbol: string): boolean {
  const symbolRegex = /^[A-Z0-9]{1,10}$/;
  return symbolRegex.test(symbol.toUpperCase());
}

/**
 * Calculate derived price data from mock price entry
 */
function calculatePriceData(
  symbol: string,
  mockData: { price: number; previousClose: number; ytdStartPrice: number; high52Week: number; low52Week: number }
): ETFPriceData {
  const { price, previousClose, ytdStartPrice, high52Week, low52Week } = mockData;

  // Calculate change from previous close
  const change = price - previousClose;
  const changePercent = (change / previousClose) * 100;

  // Calculate YTD change
  const ytdChange = ((price - ytdStartPrice) / ytdStartPrice) * 100;

  return {
    symbol: symbol.toUpperCase(),
    currentPrice: price,
    previousClose,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    high52Week,
    low52Week,
    ytdChange: Math.round(ytdChange * 100) / 100,
  };
}

/**
 * GET handler for fetching ETF price data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { symbol } = await params;

    // Validate symbol parameter
    if (!symbol) {
      return NextResponse.json(
        {
          success: false,
          error: 'Symbol parameter is required',
          code: 'MISSING_SYMBOL',
        },
        { status: 400 }
      );
    }

    const upperSymbol = symbol.toUpperCase();

    // Validate symbol format
    if (!isValidSymbol(upperSymbol)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid symbol format. Symbol must be 1-10 letters or numbers.',
          code: 'INVALID_SYMBOL',
        },
        { status: 400 }
      );
    }

    // Get mock price data
    // First check if we have predefined data for this symbol
    const mockEntry = MOCK_PRICES[upperSymbol];
    const priceData = mockEntry
      ? calculatePriceData(upperSymbol, mockEntry)
      : calculatePriceData(upperSymbol, generateMockPrice(upperSymbol));

    // Add a small artificial delay to simulate network latency (50-150ms)
    // This helps with testing loading states
    await new Promise((resolve) =>
      setTimeout(resolve, 50 + Math.random() * 100)
    );

    return NextResponse.json(
      {
        success: true,
        data: priceData,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching price data:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
