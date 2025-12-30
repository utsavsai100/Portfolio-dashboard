import express from "express";
import cors from "cors";
import marketRoutes from "./routes/market.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);


// Routes
app.use("/api/market", marketRoutes);

// Error handling (must be after routes)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
