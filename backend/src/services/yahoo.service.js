import yahooFinance from "yahoo-finance2";
import cache from "../utils/cache.js";
import { CACHE_TTL } from "../config/constants.js";

/**
 * Get current market price and basic quote data from Yahoo Finance
 * @param {string} symbol - Stock symbol (e.g., 'RELIANCE.NS', 'AAPL')
 * @returns {Promise<Object>} Quote data including CMP, change, etc.
 */
export async function getYahooQuote(symbol) {
  const cacheKey = `yahoo_quote_${symbol}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const quote = await yahooFinance.quote(symbol);

    const data = {
      symbol: quote.symbol,
      cmp: quote.regularMarketPrice || null,
      change: quote.regularMarketChange || null,
      changePercent: quote.regularMarketChangePercent || null,
      previousClose: quote.regularMarketPreviousClose || null,
      open: quote.regularMarketOpen || null,
      dayHigh: quote.regularMarketDayHigh || null,
      dayLow: quote.regularMarketDayLow || null,
      volume: quote.regularMarketVolume || null,
      marketCap: quote.marketCap || null,
      currency: quote.currency || 'USD',
      marketState: quote.marketState || 'CLOSED',
      exchangeName: quote.fullExchangeName || null,
      longName: quote.longName || quote.shortName || null,
    };

    // Cache for 5 minutes
    cache.set(cacheKey, data, CACHE_TTL.QUOTE);

    return data;
  } catch (error) {
    console.error(`Error fetching Yahoo quote for ${symbol}:`, error.message);
    throw new Error(`Failed to fetch quote data for ${symbol}: ${error.message}`);
  }
}

/**
 * Get fundamentals data (P/E ratio, EPS, etc.) from Yahoo Finance
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Fundamentals data
 */
export async function getYahooFundamentals(symbol) {
  const cacheKey = `yahoo_fundamentals_${symbol}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const result = await yahooFinance.quoteSummary(symbol, {
      modules: ["summaryDetail", "defaultKeyStatistics", "earnings", "financialData"]
    });

    const financialData = result?.financialData || {};
    const summaryDetail = result?.summaryDetail || {};
    const keyStats = result?.defaultKeyStatistics || {};

    const data = {
      peRatio: summaryDetail?.trailingPE ?? keyStats?.trailingPE ?? null,
      forwardPE: summaryDetail?.forwardPE ?? null,
      eps: keyStats?.trailingEps ?? null,
      dividendYield: summaryDetail?.dividendYield ?? null,
      fiftyTwoWeekHigh: summaryDetail?.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: summaryDetail?.fiftyTwoWeekLow ?? null,
      beta: keyStats?.beta ?? null,

      // New fields from financialData
      ebitda: financialData?.ebitda?.raw ?? financialData?.ebitda ?? null,
      revenue: financialData?.totalRevenue?.raw ?? financialData?.totalRevenue ?? null,
      pat: financialData?.netIncomeToCommon?.raw ?? financialData?.netIncomeToCommon ?? null,
      ebitdaMargin: financialData?.ebitdaMargins?.raw ?? financialData?.ebitdaMargins ?? null,
      profitMargin: financialData?.profitMargins?.raw ?? financialData?.profitMargins ?? null,

      marketCap: summaryDetail?.marketCap?.raw ?? summaryDetail?.marketCap ?? null,
      priceToSales: summaryDetail?.priceToSalesTrailing12Months?.raw ?? summaryDetail?.priceToSalesTrailing12Months ?? null,
      priceToBook: summaryDetail?.priceToBook?.raw ?? summaryDetail?.priceToBook ?? null,
    };

    // Cache for 1 hour (fundamentals change less frequently)
    cache.set(cacheKey, data, CACHE_TTL.FUNDAMENTALS);

    return data;
  } catch (error) {
    console.error(`Error fetching Yahoo fundamentals for ${symbol}:`, error.message);
    // Return null values instead of throwing to allow partial data
    return {
      peRatio: null,
      forwardPE: null,
      eps: null,
      dividendYield: null,
      fiftyTwoWeekHigh: null,
      fiftyTwoWeekLow: null,
      beta: null,
    };
  }
}

/**
 * Search for stock symbols
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of search results
 */
export async function searchYahooSymbols(query) {
  const cacheKey = `yahoo_search_${query.toLowerCase()}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const results = await yahooFinance.search(query);

    const formattedResults = results.quotes
      .filter(quote => quote.isYahooFinance) // Only Yahoo Finance results
      .slice(0, 10) // Limit to 10 results
      .map(quote => ({
        symbol: quote.symbol,
        name: quote.longname || quote.shortname,
        exchange: quote.exchDisp || quote.exchange,
        type: quote.quoteType,
      }));

    // Cache search results for 24 hours
    cache.set(cacheKey, formattedResults, CACHE_TTL.SEARCH);

    return formattedResults;
  } catch (error) {
    console.error(`Error searching Yahoo symbols for "${query}":`, error.message);
    throw new Error(`Failed to search symbols: ${error.message}`);
  }
}

/**
 * Get complete stock data (quote + fundamentals)
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Combined quote and fundamentals data
 */
export async function getCompleteYahooData(symbol) {
  const [quote, fundamentals] = await Promise.allSettled([
    getYahooQuote(symbol),
    getYahooFundamentals(symbol)
  ]);

  return {
    ...(quote.status === 'fulfilled' ? quote.value : {}),
    ...(fundamentals.status === 'fulfilled' ? fundamentals.value : {}),
    hasError: quote.status === 'rejected',
    errorMessage: quote.status === 'rejected' ? quote.reason.message : null
  };
}
