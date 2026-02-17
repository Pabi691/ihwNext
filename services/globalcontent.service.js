import axios from "axios";
import { ENV } from "../config/env";

export const globalContent = async (token) => {
  const pickString = (obj, keys) => {
    if (!obj || typeof obj !== "object") return "";
    for (const key of keys) {
      const value = obj[key];
      if (typeof value === "string" && value.trim()) return value;
    }
    return "";
  };

  const normalize = (payload) => {
    if (!payload) return null;
    const root =
      payload?.data && typeof payload.data === "object" ? payload.data : payload;

    // Accept multiple API schemas without breaking older deployments.
    const head =
      pickString(root, ["head", "header", "head_content", "header_content"]) ||
      pickString(payload, ["head", "header", "head_content", "header_content"]);
    const body =
      pickString(root, ["body", "body_content"]) ||
      pickString(payload, ["body", "body_content"]);
    const footer =
      pickString(root, ["footer", "footer_content"]) ||
      pickString(payload, ["footer", "footer_content"]);

    return {
      head,
      body,
      footer,
    };
  };

  try {
    if (!ENV.API_URL) {
      console.warn("globalContent: NEXT_PUBLIC_API_URL is missing.");
      return null;
    }

    const apiBase = `${ENV.API_URL}/api`;
    const endpoint = `${apiBase}/v1/global-content`;
    const tokenCandidates = [token, ENV.WEB_TOKEN].filter(
      (t, i, arr) => t && arr.indexOf(t) === i
    );

    // Try user token, then public token, then public/no-auth fetch.
    const attempts = [
      ...tokenCandidates.map((t) => ({
        headers: { Authorization: `Bearer ${t}` },
      })),
      { headers: {} },
    ];

    for (const attempt of attempts) {
      try {
        const res = await axios.get(endpoint, {
          headers: attempt.headers,
          timeout: 3000, // 3 second timeout
        });
        return normalize(res.data);
      } catch (error) {
        const status = error?.response?.status;
        // Retry only auth-related failures.
        if (status !== 401 && status !== 403) {
          throw error;
        }
      }
    }

    // Graceful fallback: do not crash UI on forbidden global content.
    return { head: "", body: "", footer: "" };
  } catch (error) {
    // Keep this silent to avoid noisy runtime errors in the UI.
    return { head: "", body: "", footer: "" };
  }
};
