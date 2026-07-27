"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
class MemoryCache {
    store = new Map();
    set(key, data, ttlSeconds = 300) {
        const expiresAt = Date.now() + ttlSeconds * 1000;
        this.store.set(key, { data, expiresAt });
    }
    get(key) {
        const entry = this.store.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.data;
    }
    del(key) {
        this.store.delete(key);
    }
    clear() {
        this.store.clear();
    }
}
exports.cache = new MemoryCache();
