import { backendFetchJson } from "@/utils/backendFetch";

/**
 * Server-side blog fetches.
 *
 * Kept apart from content/blog-service.js because that module is also imported
 * by client components (getBlogImageUrl), and backendFetch pulls in node:https.
 *
 * These go through backendFetchJson rather than a plain fetch(): on the
 * production host the Node process cannot reach https://server.indianhairworld.com
 * over the public CDN/WAF edge, so a direct fetch fails there while working
 * everywhere else. backendFetchJson honours API_BACKEND_RESOLVE and connects
 * over loopback with SNI and the Host header intact.
 *
 * Failures are logged. The previous silent `catch { return [] }` turned an
 * unreachable backend into an empty "No articles yet" page with nothing in the
 * logs to explain it.
 */
export const BlogService = {
  /** All published blogs. */
  async getAll() {
    try {
      const data = await backendFetchJson("/api/v1/blogs");
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err) {
      console.error("[blogs] getAll failed:", err?.message || err);
      return [];
    }
  },

  /** One published blog by slug. */
  async getBySlug(slug) {
    try {
      const data = await backendFetchJson(`/api/v1/blogs/${encodeURIComponent(slug)}`);
      return data?.data || null;
    } catch (err) {
      console.error(`[blogs] getBySlug(${slug}) failed:`, err?.message || err);
      return null;
    }
  },

  /** The latest N published blogs. */
  async getLatest(count = 3) {
    const all = await BlogService.getAll();
    return all.slice(0, count);
  },
};
