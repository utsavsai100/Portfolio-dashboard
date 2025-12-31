# Portfolio Dashboard: Challenges & Solutions

## 1. Real-Time Data vs. API Limits
**Challenge:**  
The requirement for **15-second auto-updates** clashed with the rate limits of the third-party financial API (Yahoo Finance). Frequent polling from the frontend caused `429 Too Many Requests` errors, blocking the IP.

**Solution:**  
*   **Backend Caching:** Implemented an in-memory cache on the backend with a TTL (Time-To-Live) of 15 seconds. This ensures that no matter how many clients connect, the external API is only hit once every 15 seconds per symbol.
*   **Rate Limiting Strategy:** Configured `express-rate-limit` on the backend to allow bursts of traffic for the batch endpoint (500 requests/window) while protecting the rest of the API.
*   **Frontend Resilience:** Added exponential backoff retry logic in the frontend API service to handle transient network issues gracefully.

## 2. Dynamic Portfolio Calculations
**Challenge:**  
Calculating "Day's Gain" and "Total Returns" dynamically for a portfolio with diverse sectors required combining static transactional data (Buy Price, Quantity) with live market data (CMP).

**Solution:**  
*   **Data Separation:** Kept static portfolio data in a structured constant file and merged it with live market data on the fly.
*   **Sector Aggregation:** Implemented efficient array reduction methods to group stocks by sector and calculate weighted sums for sector-level performance metrics in real-time.

## 3. UI Consistency & Responsiveness
**Challenge:**  
The initial codebase used a mix of inline SVGs and ad-hoc icons, leading to visual inconsistency. Additionally, the dashboard needed to look premium and "alive" without being cluttered.

**Solution:**  
*   **Icon System:** Refactored the entire application to use `lucide-react`. This provided a standardized, customizable set of icons (e.g., using `Wallet` for investment, `Activity` for live status).
*   **Visual Feedback:** Added color-coded indicators (Green/Red) for profits and losses and a "Loading" state to improve user experience during data fetches.

## 4. Production Deployment & CORS
**Challenge:**  
Connecting a frontend hosted on **Vercel** with a backend on **Render** caused Cross-Origin Resource Sharing (CORS) errors. Additionally, Render's build process failed initially due to incorrect root directory configuration.

**Solution:**  
*   **CORS Configuration:** Explicitly allow-listed the Vercel domain in the backend's Express configuration.
*   **Build Optimization:** Corrected Render's "Root Directory" setting to point to the `backend` folder, ensuring dependencies were installed correctly.
*   **Environment Variables:** Secured API endpoints by using environment variables for the base URL, preventing hardcoded local paths in production.
