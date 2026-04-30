const DEFAULT_API_URL = "https://connect.indianhairworld.com";
const DEFAULT_WEB_TOKEN = "2|SwAXG9wWqc4rwZPstwG42DUVpRhmkWjO5Vj2VpRF";
const USER_TOEN = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

const sanitizeEnvValue = (value, fallback) => {
  if (value === undefined || value === null) return fallback;
  const normalized = String(value).trim();
  if (!normalized || normalized === "undefined" || normalized === "null") {
    return fallback;
  }
  return normalized;
};

const sanitizeApiUrl = (value) => {
  // In the browser, always use a relative base so requests go through
  // the Next.js proxy at /api/[...path].ts — avoids CORS entirely.
  // On the server (SSR), use the real backend URL for direct calls.
  if (typeof window !== "undefined") {
    return "";
  }
  const base = sanitizeEnvValue(value, DEFAULT_API_URL).replace(/\/+$/, "");
  return base.replace(/\/api\/v1$/i, "");
};

export const ENV = {
  API_URL: sanitizeApiUrl(process.env.NEXT_PUBLIC_API_URL),
  WEB_TOKEN: sanitizeEnvValue(USER_TOEN ?? DEFAULT_WEB_TOKEN),
};
