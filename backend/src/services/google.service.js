import axios from "axios";
import * as cheerio from "cheerio";
import cache from "../utils/cache.js";
import { CACHE_TTL, GOOGLE_EXCHANGE_MAP } from "../config/constants.js";

/**
 * Get exchange code for Google Finance from Yahoo symbol
 * @param {string} symbol - Yahoo Finance symbol (e.g., 'RELIANCE.NS')
 * @returns {string} Google Finance exchange code
 */
function getGoogleExchange(symbol) {
  if (symbol.endsWith('.NS')) return 'NSE';
  if (symbol.endsWith('.BO')) return 'BOM';
  if (symbol.endsWith('.L')) return 'LON';
  // Default to NASDAQ for US stocks
  return 'NASDAQ';
}

/**
 * Remove exchange suffix from symbol
 * @param {string} symbol - Full symbol (e.g., 'RELIANCE.NS')
 * @returns {string} Symbol without suffix
 */
function getBaseSymbol(symbol) {
  return symbol.split('.')[0];
}

/**
 * Scrape Google Finance for P/E ratio and earnings data
 * @param {string} symbol - Stock symbol (e.g., 'RELIANCE.NS', 'AAPL')
 * @returns {Promise<Object>} P/E ratio and earnings data
 */
export async function getGoogleFinancials(symbol) {
  const cacheKey = `google_financials_${symbol}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const exchange = getGoogleExchange(symbol);
    const baseSymbol = getBaseSymbol(symbol);
    const url = `https://www.google.com/finance/quote/${baseSymbol}:${exchange}`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    // Extract P/E Ratio
    let peRatio = null;
    $('div.gyFHrc').each((i, elem) => {
      const label = $(elem).find('div.mfs7Fc').text().trim();
      if (label === 'P/E ratio' || label === 'PE ratio') {
        const value = $(elem).find('div.P6K39c').text().trim();
        peRatio = value && value !== '-' ? parseFloat(value) : null;
      }
    });

    // Extract Latest Earnings (EPS)
    let latestEarnings = null;
    $('div.gyFHrc').each((i, elem) => {
      const label = $(elem).find('div.mfs7Fc').text().trim();
      if (label === 'EPS' || label.includes('Earnings per share')) {
        const value = $(elem).find('div.P6K39c').text().trim();
        latestEarnings = value && value !== '-' ? parseFloat(value) : null;
      }
    });

    // Also try to get current price and change as backup
    const rawPrice = $('div[data-last-price]').attr("data-last-price");
    const rawChange = $('span[jsname="Fe7oBc"]').first().text();

    const price = rawPrice ? parseFloat(rawPrice) : null;
    const change = rawChange ? parseFloat(rawChange.replace(/[^\d.-]/g, "")) : null;
    const changePercent = (price !== null && change !== null && price !== change)
      ? (change / (price - change)) * 100
      : null;

    const result = {
      peRatio,
      latestEarnings,
      price, // Backup price
      change,
      changePercent,
      exchange,
      source: 'google-finance',
    };

    // Cache for 1 hour
    cache.set(cacheKey, result, CACHE_TTL.FUNDAMENTALS);

    return result;
  } catch (error) {
    console.error(`Error scraping Google Finance for ${symbol}:`, error.message);
    // Return null values instead of throwing
    return {
      peRatio: null,
      latestEarnings: null,
      price: null,
      exchange: null,
      source: 'google-finance',
      error: error.message
    };
  }
}

/**
 * Get market price data from Google Finance (backup for Yahoo)
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Market data
 */
export async function getGoogleMarketData(symbol) {
  const cacheKey = `google_market_${symbol}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const exchange = getGoogleExchange(symbol);
    const baseSymbol = getBaseSymbol(symbol);
    const url = `https://www.google.com/finance/quote/${baseSymbol}:${exchange}`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    const rawPrice = $('div[data-last-price]').attr("data-last-price");
    const rawChange = $('span[jsname="Fe7oBc"]').first().text();

    const price = rawPrice ? parseFloat(rawPrice) : null;
    const change = rawChange
      ? parseFloat(rawChange.replace(/[^\d.-]/g, ""))
      : null;

    const changePercent =
      price !== null && change !== null
        ? (change / (price - change)) * 100
        : null;

    const result = {
      price,
      change,
      changePercent,
      currency: symbol.endsWith('.NS') || symbol.endsWith('.BO') ? 'INR' : 'USD',
      marketState: "CLOSED",
      exchange,
    };

    cache.set(cacheKey, result, CACHE_TTL.QUOTE);

    return result;
  } catch (error) {
    console.error(`Error scraping Google market data for ${symbol}:`, error.message);
    throw new Error(`Failed to fetch Google market data: ${error.message}`);
  }
}
