// Global error handling middleware

export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            message: err.message,
            details: err.details || null
        });
    }

    if (err.name === 'NotFoundError') {
        return res.status(404).json({
            success: false,
            error: 'Not Found',
            message: err.message
        });
    }

    // API/Network errors
    if (err.isAxiosError || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        return res.status(503).json({
            success: false,
            error: 'Service Unavailable',
            message: 'Unable to fetch data from external API. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? err.message : null
        });
    }

    // Rate limit errors
    if (err.status === 429) {
        return res.status(429).json({
            success: false,
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: err.retryAfter || null
        });
    }

    // Default server error
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'An unexpected error occurred. Please try again later.',
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
};

// 404 handler for undefined routes
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
};
