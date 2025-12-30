// Simple in-memory cache with TTL support

class Cache {
    constructor() {
        this.store = new Map();
    }

    /**
     * Set a value in cache with TTL
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {number} ttl - Time to live in milliseconds
     */
    set(key, value, ttl) {
        const expiresAt = Date.now() + ttl;
        this.store.set(key, { value, expiresAt });
    }

    /**
     * Get a value from cache
     * @param {string} key - Cache key
     * @returns {*} Cached value or null if expired/not found
     */
    get(key) {
        const item = this.store.get(key);

        if (!item) {
            return null;
        }

        // Check if expired
        if (Date.now() > item.expiresAt) {
            this.store.delete(key);
            return null;
        }

        return item.value;
    }

    /**
     * Delete a specific key from cache
     * @param {string} key - Cache key
     */
    delete(key) {
        this.store.delete(key);
    }

    /**
     * Clear all cache
     */
    clear() {
        this.store.clear();
    }

    /**
     * Get cache size
     * @returns {number} Number of items in cache
     */
    size() {
        return this.store.size;
    }

    /**
     * Clean up expired entries
     */
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.store.entries()) {
            if (now > item.expiresAt) {
                this.store.delete(key);
            }
        }
    }
}

// Create singleton instance
const cache = new Cache();

// Run cleanup every 10 minutes
setInterval(() => {
    cache.cleanup();
}, 10 * 60 * 1000);

export default cache;
