export const CACHE_TTL = {
    QUOTE: 15 * 1000,
    FUNDAMENTALS: 60 * 60 * 1000,
    SEARCH: 24 * 60 * 60 * 1000
};

export const RATE_LIMIT = {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 300
};

export const API_TIMEOUT = 10000;

export const EXCHANGE_SUFFIXES = {
    NSE: '.NS',
    BSE: '.BO',
    NASDAQ: '',
    NYSE: '',
};

export const GOOGLE_EXCHANGE_MAP = {
    '.NS': 'NSE',
    '.BO': 'BOM',
    '': 'NASDAQ'
};

export const DEFAULT_CURRENCY = {
    '.NS': 'INR',
    '.BO': 'INR',
    '': 'USD'
};
