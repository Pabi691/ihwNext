import axios from "axios";
import { ENV } from "../config/env";

export const CategoryService = {
  async getAll() {
    const endpoint = `${ENV.API_URL}/api/v1/categories`;
    const userToken = isBrowser ? localStorage.getItem("userToken") : null;
    const isBrowser = typeof window !== "undefined";

    // Avoid noisy 403s by trying likely-valid modes first.
    const attempts = [
      userToken ? { Authorization: `Bearer ${userToken}` } : null,
      {}, // public access
      ENV.WEB_TOKEN ? { Authorization: `Bearer ${ENV.WEB_TOKEN}` } : null,
    ].filter(Boolean);

    let lastError = null;
    for (const headers of attempts) {
      try {
        return await axios.get(endpoint, { headers, timeout: 4000 });
      } catch (error) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 401 && status !== 403) {
          throw error;
        }
      }
    }

    if (lastError) {
      throw lastError;
    }

    return { status: 200, data: { status: true, category_list: [] } };
  },
};
