// src/utils/cacheManager.js

const DEFAULT_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const cacheManager = {
  set(key, data, duration = DEFAULT_CACHE_DURATION) {
    const now = Date.now();
    const cacheData = {
      data,
      expiry: now + duration,
    };
    sessionStorage.setItem(key, JSON.stringify(cacheData));
  },

  get(key) {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;

    try {
      const parsed = JSON.parse(cached);
      if (Date.now() > parsed.expiry) {
        // Cache expired
        sessionStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch (error) {
      console.error("Cache parsing error for key:", key, error);
      sessionStorage.removeItem(key);
      return null;
    }
  },

  remove(key) {
    sessionStorage.removeItem(key);
  },

  clear() {
    sessionStorage.clear();
  },
};
