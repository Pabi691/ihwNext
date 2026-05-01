const DEFAULT_BACKEND = "https://server.indianhairworld.com";

/** Returns the base URL to use for API calls depending on environment (server vs browser). */
function getApiBase() {
  if (typeof window === "undefined") {
    // Server-side: call backend directly
    return (process.env.API_BACKEND_URL || DEFAULT_BACKEND).replace(/\/+$/, "");
  }
  // Browser: call through Next.js proxy (same origin → no CORS)
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
}

/**
 * Prepends the backend assets base URL so images stored as
 * "/uploads/blogs/..." resolve to the correct host.
 */
export function getBlogImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  // In dev: localhost:3000/uploads/... is proxied by next.config.ts rewrites to backend
  return path;
}

export const BlogService = {
  /** Fetch all published blogs (used server-side for SSR pages). */
  async getAll() {
    try {
      const base = getApiBase();
      const res  = await fetch(`${base}/api/v1/blogs`, { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch {
      return [];
    }
  },

  /** Fetch a single published blog by slug. */
  async getBySlug(slug) {
    try {
      const base = getApiBase();
      const res  = await fetch(`${base}/api/v1/blogs/${slug}`, { cache: "no-store" });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.data || null;
    } catch {
      return null;
    }
  },

  /** Get the latest N published blogs. */
  async getLatest(count = 3) {
    const all = await BlogService.getAll();
    return all.slice(0, count);
  },
};
