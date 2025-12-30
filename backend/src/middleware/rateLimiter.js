import rateLimit from 'express-rate-limit';
import { RATE_LIMIT } from '../config/constants.js';

export const apiLimiter = rateLimit({
    windowMs: RATE_LIMIT.WINDOW_MS,
    max: RATE_LIMIT.MAX_REQUESTS,
    message: {
        success: false,
        error: 'Too Many Requests',
        message: 'You have exceeded the rate limit. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: 'Too Many Requests',
            message: `Rate limit exceeded. Maximum ${RATE_LIMIT.MAX_REQUESTS} requests per ${RATE_LIMIT.WINDOW_MS / 60000} minutes.`,
            retryAfter: Math.ceil(RATE_LIMIT.WINDOW_MS / 1000)
        });
    }
});

export const batchLimiter = rateLimit({
    windowMs: RATE_LIMIT.WINDOW_MS,
    max: 500,
    message: {
        success: false,
        error: 'Too Many Requests',
        message: 'Batch request rate limit exceeded. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
