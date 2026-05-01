const DEFAULT_API_URL = "https://server.indianhairworld.com";
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

const getApiUrl = () => {
  if (typeof window !== "undefined") {
    // Browser: NEXT_PUBLIC_API_URL = same origin as the Next.js app
    // Calls go through pages/api/[...path].ts proxy → no CORS
    return sanitizeEnvValue(process.env.NEXT_PUBLIC_API_URL, DEFAULT_API_URL);
  }
  // Server (SSR/API routes): call backend directly, no CORS for server-to-server
  return sanitizeEnvValue(process.env.API_BACKEND_URL, DEFAULT_API_URL);
};

export const ENV = {
  API_URL: getApiUrl(),
  WEB_TOKEN: sanitizeEnvValue(USER_TOEN ?? DEFAULT_WEB_TOKEN),
};
