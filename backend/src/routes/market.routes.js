import express from "express";
import { getStockQuote, searchSymbols, getBatchQuotes } from "../controllers/marketData.js";
import { batchLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Search must come before /:symbol to avoid conflicts
router.get("/search", searchSymbols);

// Batch endpoint for fetching multiple stocks
router.post("/batch", batchLimiter, getBatchQuotes);

// Single stock quote
router.get("/:symbol", getStockQuote);

export default router;
