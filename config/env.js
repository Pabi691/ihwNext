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

const getApiUrl = () => {
  // Browser: empty string → relative URL → goes through Next.js proxy → no CORS
  if (typeof window !== "undefined") {
    return "";
  }
  // Server (SSR/API routes): always call the backend directly, no loopback
  return DEFAULT_API_URL;
};

export const ENV = {
  API_URL: getApiUrl(),
  WEB_TOKEN: sanitizeEnvValue(USER_TOEN ?? DEFAULT_WEB_TOKEN),
};
