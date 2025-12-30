# Portfolio Backend API

Node.js/Express backend for fetching real-time stock market data from Yahoo Finance and Google Finance.

## Features

- 📈 **Real-time Stock Quotes** - Fetch current market prices (CMP) from Yahoo Finance
- 📊 **Fundamentals Data** - Get P/E ratios and earnings from Google Finance
- 🚀 **Batch Processing** - Fetch multiple stocks in a single request
- 💾 **Smart Caching** - In-memory cache with TTL to reduce API calls
- 🛡️ **Rate Limiting** - Prevent API abuse and blocking
- 🌍 **Multi-Exchange Support** - NSE, BSE, NASDAQ, NYSE, and more
- ⚡ **Fast & Reliable** - Promise-based async operations with error handling

## API Endpoints

### 1. Get Single Stock Quote
```
GET /api/market/:symbol
```

**Example:**
```bash
curl http://localhost:5001/api/market/RELIANCE.NS
```

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "RELIANCE.NS",
    "name": "Reliance Industries Limited",
    "cmp": 2456.75,
    "change": 12.50,
    "changePercent": 0.51,
    "peRatio": 28.5,
    "latestEarnings": 86.23,
    "currency": "INR",
    "marketState": "CLOSED",
    "lastUpdated": "2025-12-29T02:00:00.000Z"
  }
}
```

### 2. Batch Stock Quotes
```
POST /api/market/batch
```

**Request Body:**
```json
{
  "symbols": ["RELIANCE.NS", "TCS.NS", "INFY.NS"]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "RELIANCE.NS",
      "cmp": 2456.75,
      "peRatio": 28.5,
      "latestEarnings": 86.23,
      ...
    }
  ],
  "count": 3
}
```

### 3. Search Symbols
```
GET /api/market/search?q=reliance
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "symbol": "RELIANCE.NS",
      "name": "Reliance Industries Limited",
      "exchange": "NSE"
    }
  ]
}
```

### 4. Health Check
```
GET /api/health
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5001`

## Stock Symbol Format

- **NSE (India)**: `RELIANCE.NS`, `TCS.NS`
- **BSE (India)**: `RELIANCE.BO`, `TCS.BO`
- **NASDAQ (US)**: `AAPL`, `GOOGL`, `MSFT`
- **NYSE (US)**: `JPM`, `BAC`

## Architecture

```
backend/
├── src/
│   ├── config/
│   │   └── constants.js       # Configuration constants
│   ├── controllers/
│   │   └── marketData.js      # Request handlers
│   ├── middleware/
│   │   ├── errorHandler.js    # Error handling
│   │   └── rateLimiter.js     # Rate limiting
│   ├── routes/
│   │   └── market.routes.js   # API routes
│   ├── services/
│   │   ├── yahoo.service.js   # Yahoo Finance integration
│   │   └── google.service.js  # Google Finance scraping
│   ├── utils/
│   │   └── cache.js           # In-memory cache
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
└── package.json
```

## Caching Strategy

- **Stock Quotes**: 5 minutes TTL
- **Fundamentals (P/E, EPS)**: 1 hour TTL
- **Search Results**: 24 hours TTL

## Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Batch Endpoint**: 20 requests per 15 minutes

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Human-readable error message"
}
```

## Technical Challenges Addressed

### 1. Unofficial APIs
- Yahoo Finance: Using `yahoo-finance2` library (unofficial but reliable)
- Google Finance: Web scraping with Axios + Cheerio

### 2. Rate Limiting
- In-memory caching reduces API calls
- Express rate limiter prevents abuse
- Batch endpoint for efficient multi-stock fetching

### 3. Data Accuracy
- Combines data from multiple sources
- Fallback mechanisms when one source fails
- Promise.allSettled for graceful error handling

### 4. Exchange Support
- Automatic exchange detection from symbol suffix
- Support for NSE, BSE, NASDAQ, NYSE, and more
- Currency detection based on exchange

## Production Deployment

For production, consider:

1. **Use Redis** for distributed caching
2. **Add authentication** if needed
3. **Set up monitoring** (e.g., PM2, New Relic)
4. **Use environment variables** for sensitive config
5. **Enable HTTPS**
6. **Add request logging** (e.g., Morgan, Winston)

## Limitations

- Yahoo Finance may change their API structure
- Google Finance scraping may break with site updates
- Rate limits apply to prevent being blocked
- Some symbols may not be available on all exchanges

## License

MIT
