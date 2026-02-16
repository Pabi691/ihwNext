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
    if (!ENV.API_URL && typeof window === "undefined") {
      console.warn("globalContent: NEXT_PUBLIC_API_URL is missing.");
      return null;
    }
    const authToken = token || ENV.WEB_TOKEN;
    if (!authToken) {
      console.warn("globalContent: token is missing. Check NEXT_PUBLIC_WEB_TOKEN.");
      return null;
    }

    const endpoint = `${ENV.API_URL}/api/v1/global-content`;
    const res = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      timeout: 3000, // 3 second timeout
    });
    return normalize(res.data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Global content fetch error:", error);
    }
    return null;
  }
};
