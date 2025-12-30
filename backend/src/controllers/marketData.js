import { getCompleteYahooData, searchYahooSymbols } from "../services/yahoo.service.js";
import { getGoogleFinancials } from "../services/google.service.js";

export async function getStockQuote(req, res, next) {
    try {
        const { symbol } = req.params;

        if (!symbol) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Stock symbol is required'
            });
        }

        const [yahooData, googleData] = await Promise.allSettled([
            getCompleteYahooData(symbol.toUpperCase()),
            getGoogleFinancials(symbol.toUpperCase())
        ]);

        const yahoo = yahooData.status === 'fulfilled' ? yahooData.value : {};
        const google = googleData.status === 'fulfilled' ? googleData.value : {};

        const response = {
            success: true,
            data: {
                symbol: symbol.toUpperCase(),
                name: yahoo.longName || null,
                exchange: yahoo.exchangeName || google.exchange || null,

                cmp: yahoo.cmp || google.price || null,
                change: yahoo.change ?? google.change ?? null,
                changePercent: yahoo.changePercent ?? google.changePercent ?? null,
                previousClose: yahoo.previousClose || null,
                open: yahoo.open || null,
                dayHigh: yahoo.dayHigh || null,
                dayLow: yahoo.dayLow || null,
                volume: yahoo.volume || null,

                peRatio: google.peRatio ?? yahoo.peRatio ?? null,
                latestEarnings: google.latestEarnings ?? yahoo.eps ?? null,

                marketCap: yahoo.marketCap || null,
                fiftyTwoWeekHigh: yahoo.fiftyTwoWeekHigh || null,
                fiftyTwoWeekLow: yahoo.fiftyTwoWeekLow || null,

                currency: yahoo.currency || (symbol.endsWith('.NS') || symbol.endsWith('.BO') ? 'INR' : 'USD'),
                marketState: yahoo.marketState || 'CLOSED',
                lastUpdated: new Date().toISOString(),
            },
            sources: {
                yahoo: yahooData.status === 'fulfilled',
                google: googleData.status === 'fulfilled'
            }
        };

        if (!response.data.cmp) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: `Unable to fetch data for symbol: ${symbol}. Please check if the symbol is correct.`
            });
        }

        res.json(response);
    } catch (error) {
        next(error);
    }
}

export async function getBatchQuotes(req, res, next) {
    try {
        const { symbols } = req.body;

        if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Array of stock symbols is required in request body'
            });
        }

        if (symbols.length > 50) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Maximum 50 symbols allowed per batch request'
            });
        }

        const results = await Promise.allSettled(
            symbols.map(async (symbol) => {
                const [yahooData, googleData] = await Promise.allSettled([
                    getCompleteYahooData(symbol.toUpperCase()),
                    getGoogleFinancials(symbol.toUpperCase())
                ]);

                const yahoo = yahooData.status === 'fulfilled' ? yahooData.value : {};
                const google = googleData.status === 'fulfilled' ? googleData.value : {};

                return {
                    symbol: symbol.toUpperCase(),
                    name: yahoo.longName || null,
                    cmp: yahoo.cmp || google.price || null,
                    change: yahoo.change ?? google.change ?? null,
                    changePercent: yahoo.changePercent ?? google.changePercent ?? null,
                    peRatio: google.peRatio ?? yahoo.peRatio ?? null,
                    latestEarnings: google.latestEarnings ?? yahoo.eps ?? null,
                    currency: yahoo.currency || (symbol.endsWith('.NS') || symbol.endsWith('.BO') ? 'INR' : 'USD'),
                    marketState: yahoo.marketState || 'CLOSED',

                    marketCap: yahoo.marketCap || null,
                    revenue: yahoo.revenue || null,
                    ebitda: yahoo.ebitda || null,
                    pat: yahoo.pat || null,
                    ebitdaMargin: yahoo.ebitdaMargin || null,
                    profitMargin: yahoo.profitMargin || null,
                    priceToSales: yahoo.priceToSales || null,
                    priceToBook: yahoo.priceToBook || null,
                };
            })
        );

        const data = [];
        const errors = [];

        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                data.push(result.value);
            } else {
                errors.push({
                    symbol: symbols[index],
                    error: result.reason.message
                });
            }
        });

        res.json({
            success: true,
            data,
            errors: errors.length > 0 ? errors : undefined,
            count: data.length,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
}

export async function searchSymbols(req, res, next) {
    try {
        const { q } = req.query;

        if (!q || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Search query parameter "q" is required'
            });
        }

        const results = await searchYahooSymbols(q.trim());

        res.json({
            success: true,
            query: q.trim(),
            results,
            count: results.length
        });
    } catch (error) {
        next(error);
    }
}
