// src/utils/cacheManager.js

const DEFAULT_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const CACHE_KEY_PREFIX = "ihw-cache:v3:";

const resolveCacheKey = (key) => `${CACHE_KEY_PREFIX}${key}`;

export const cacheManager = {
  set(key, data, duration = DEFAULT_CACHE_DURATION) {
    const now = Date.now();
    const cacheData = {
      data,
      expiry: now + duration,
    };
    sessionStorage.setItem(resolveCacheKey(key), JSON.stringify(cacheData));
  },

  get(key) {
    const cached = sessionStorage.getItem(resolveCacheKey(key));
    if (!cached) return null;

    try {
      const parsed = JSON.parse(cached);
      if (Date.now() > parsed.expiry) {
        // Cache expired
        sessionStorage.removeItem(resolveCacheKey(key));
        return null;
      }
      return parsed.data;
    } catch (error) {
      console.error("Cache parsing error for key:", key, error);
      sessionStorage.removeItem(resolveCacheKey(key));
      return null;
    }
  },

  remove(key) {
    sessionStorage.removeItem(resolveCacheKey(key));
  },

  clear() {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(CACHE_KEY_PREFIX))
      .forEach((key) => sessionStorage.removeItem(key));
  },
};
