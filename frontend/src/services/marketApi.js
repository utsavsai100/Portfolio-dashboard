import apiClient from "./apiClient";

/**
 * Fetch market data for a single stock symbol
 * @param {string} symbol - Stock symbol (e.g., 'RELIANCE.NS', 'AAPL')
 * @returns {Promise<Object>} Stock data with CMP, P/E ratio, earnings, etc.
 */
export const fetchMarketData = async (symbol) => {
  if (!symbol) throw new Error("Symbol is required");

  try {
    const { data } = await apiClient.get(`/market/${symbol}`);

    // Backend returns { success: true, data: {...} }
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch stock data');
    }

    return data.data; // Extract the nested data object
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetch market data for multiple stocks in a single batch request
 * This is much more efficient than calling fetchMarketData for each symbol
 * @param {string[]} symbols - Array of stock symbols
 * @param {number} retryCount - Current retry attempt (internal use)
 * @returns {Promise<Array>} Array of stock data objects
 */
export const fetchBatchQuotes = async (symbols, retryCount = 0) => {
  if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
    throw new Error("Array of symbols is required");
  }

  try {
    const { data } = await apiClient.post('/market/batch', { symbols });

    // Backend returns { success: true, data: [...], count: N }
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch batch quotes');
    }

    return data.data; // Array of stock data
  } catch (error) {
    // Handle rate limit errors with exponential backoff
    if (error.response?.status === 429 && retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      console.warn(`Rate limit hit. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/3)`);

      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchBatchQuotes(symbols, retryCount + 1);
    }

    console.error('Error fetching batch quotes:', error);
    throw error;
  }
};

/**
 * Search for stock symbols by query
 * @param {string} query - Search query (e.g., 'reliance', 'apple')
 * @returns {Promise<Array>} Array of search results
 */
export const searchSymbols = async (query) => {
  if (!query || query.trim().length === 0) {
    throw new Error("Search query is required");
  }

  try {
    const { data } = await apiClient.get('/market/search', {
      params: { q: query.trim() },
    });

    if (!data.success) {
      throw new Error(data.message || 'Failed to search symbols');
    }

    return data.results; // Array of search results
  } catch (error) {
    console.error(`Error searching for "${query}":`, error);
    throw error;
  }
};
