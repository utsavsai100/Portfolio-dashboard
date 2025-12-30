# Portfolio Backend API Documentation

## Base URL
```
http://localhost:5001/api
```

---

## 📊 Market Data Endpoints

### 1. Get Batch Quotes ✅
Fetch market data for multiple stocks in a single request (most efficient for dashboards).

**Endpoint:**
```
POST /market/batch
```

**Request Body:**
```json
{
  "symbols": ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS"]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "RELIANCE.NS",
      "name": "Reliance Industries Limited",
      "cmp": 1546.40,
      "change": -12.50,
      "changePercent": -0.80,
      "peRatio": 25.18,
      "latestEarnings": 61.42,
      "currency": "INR",
      "marketState": "CLOSED"
    }
  ],
  "count": 4,
  "lastUpdated": "2025-12-29T06:13:39.855Z"
}
```

**Rate Limit:** 60 requests per 15 minutes  
**Cache:** 5 minutes

**cURL Example:**
```bash
curl -X POST http://localhost:5001/api/market/batch \
  -H "Content-Type: application/json" \
  -d '{"symbols": ["RELIANCE.NS", "TCS.NS"]}'
```

---

### 2. Get Single Stock Quote
Fetch detailed market data for a single stock symbol.

**Endpoint:**
```
GET /market/:symbol
```

**Parameters:**
- `symbol` (required) - Stock symbol (e.g., `RELIANCE.NS`, `AAPL`)

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "RELIANCE.NS",
    "name": "Reliance Industries Limited",
    "exchange": "NSE",
    "cmp": 1546.40,
    "change": -12.50,
    "changePercent": -0.80,
    "previousClose": 1558.90,
    "open": 1555.00,
    "dayHigh": 1560.20,
    "dayLow": 1542.10,
    "volume": 12500000,
    "peRatio": 25.18,
    "latestEarnings": 61.42,
    "marketCap": 10450000000000,
    "fiftyTwoWeekHigh": 1650.00,
    "fiftyTwoWeekLow": 1200.00,
    "currency": "INR",
    "marketState": "CLOSED",
    "lastUpdated": "2025-12-29T06:13:47.994Z"
  },
  "sources": {
    "yahoo": true,
    "google": true
  }
}
```

**Rate Limit:** 100 requests per 15 minutes  
**Cache:** 5 minutes for quotes, 1 hour for fundamentals

**cURL Example:**
```bash
curl http://localhost:5001/api/market/RELIANCE.NS
```

---

### 3. Search Symbols
Search for stock symbols by name or ticker.

**Endpoint:**
```
GET /market/search
```

**Query Parameters:**
- `q` (required) - Search query (e.g., `reliance`, `apple`)

**Response:**
```json
{
  "success": true,
  "query": "reliance",
  "results": [
    {
      "symbol": "RELIANCE.NS",
      "name": "Reliance Industries Limited",
      "exchange": "NSE",
      "type": "EQUITY"
    }
  ],
  "count": 10
}
```

**Rate Limit:** 100 requests per 15 minutes  
**Cache:** 24 hours

**cURL Example:**
```bash
curl "http://localhost:5001/api/market/search?q=reliance"
```

---

## 🔐 Rate Limiting

All endpoints are rate-limited to prevent abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/market/batch` | 60 requests | 15 minutes |
| `/market/:symbol` | 100 requests | 15 minutes |
| `/market/search` | 100 requests | 15 minutes |

**Rate Limit Headers:**
```
RateLimit-Limit: 60
RateLimit-Remaining: 55
RateLimit-Reset: 1735455600
```

**429 Response:**
```json
{
  "success": false,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Maximum 60 requests per 15 minutes.",
  "retryAfter": 900
}
```

---

## 💾 Caching

The backend implements intelligent caching to reduce external API calls:

| Data Type | Cache Duration |
|-----------|----------------|
| Stock Quotes (CMP, Change) | 5 minutes |
| Fundamentals (P/E, EPS) | 1 hour |
| Search Results | 24 hours |

---

## 📝 Stock Symbol Format

### Indian Stocks (NSE)
```
RELIANCE.NS
TCS.NS
INFY.NS
HDFCBANK.NS
```

### Indian Stocks (BSE)
```
RELIANCE.BO
TCS.BO
```

### US Stocks
```
AAPL      (Apple)
GOOGL     (Google)
MSFT      (Microsoft)
TSLA      (Tesla)
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Stock symbol is required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Unable to fetch data for symbol: XYZ. Please check if the symbol is correct."
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Maximum 60 requests per 15 minutes.",
  "retryAfter": 900
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred. Please try again later."
}
```

---

## 🧪 Testing with Different Tools

### Using cURL
```bash
# Batch request
curl -X POST http://localhost:5001/api/market/batch \
  -H "Content-Type: application/json" \
  -d '{"symbols": ["RELIANCE.NS", "TCS.NS"]}' \
  | python3 -m json.tool

# Single stock
curl http://localhost:5001/api/market/RELIANCE.NS | python3 -m json.tool

# Search
curl "http://localhost:5001/api/market/search?q=tata" | python3 -m json.tool
```

### Using Browser
1. Batch API: Use a REST client extension (e.g., Thunder Client, REST Client)
2. Single Stock: `http://localhost:5001/api/market/RELIANCE.NS`
3. Search: `http://localhost:5001/api/market/search?q=reliance`

### Using JavaScript (Frontend)
```javascript
// Batch
const response = await fetch('http://localhost:5001/api/market/batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ symbols: ['RELIANCE.NS', 'TCS.NS'] })
});
const data = await response.json();

// Single
const response = await fetch('http://localhost:5001/api/market/RELIANCE.NS');
const data = await response.json();

// Search
const response = await fetch('http://localhost:5001/api/market/search?q=reliance');
const data = await response.json();
```

---

## 📌 Notes

- **Market hours:** Data is more accurate during market hours (9:15 AM - 3:30 PM IST for NSE)
- **Weekends/Holidays:** Markets are closed, data won't update
- **Symbol validation:** Always use correct exchange suffixes (.NS for NSE, .BO for BSE)
- **Null values:** Some fields may be null if data is unavailable from the source
