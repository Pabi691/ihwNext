const DEFAULT_API_URL = "https://server.indianhairworld.com";
const DEFAULT_WEB_TOKEN = "2|SwAXG9wWqc4rwZPstwG42DUVpRhmkWjO5Vj2VpRF";

const sanitizeEnvValue = (value, fallback) => {
  if (value === undefined || value === null) return fallback;
  const normalized = String(value).trim();
  if (!normalized || normalized === "undefined" || normalized === "null") {
    return fallback;
  }
  return normalized;
};

const sanitizeApiUrl = (value) => sanitizeEnvValue(value, DEFAULT_API_URL).replace(/\/+$/, "");

export const ENV = {
  API_URL: sanitizeApiUrl(process.env.NEXT_PUBLIC_API_URL),
  WEB_TOKEN: sanitizeEnvValue(process.env.NEXT_PUBLIC_WEB_TOKEN, DEFAULT_WEB_TOKEN),
};
