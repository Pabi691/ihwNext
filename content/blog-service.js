/**
 * Client-safe blog helpers. Anything that talks to the backend lives in
 * content/blog-service.server.js — it must go through backendFetchJson, and
 * that pulls in node:https, which cannot be bundled for the browser.
 */

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
