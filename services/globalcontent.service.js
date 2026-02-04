import axios from "axios";
import { ENV } from "../config/env";

export const globalContent = async (token) => {
  try {
    if (!ENV.API_URL) {
      console.warn("globalContent: NEXT_PUBLIC_API_URL is missing.");
      return null;
    }
    if (!token) {
      console.warn("globalContent: token is missing. Check NEXT_PUBLIC_WEB_TOKEN.");
      return null;
    }
    // console.log("Fetching global content with token:", token);
    const res = await axios.get(
      `${ENV.API_URL}/api/v1/global-content`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data || null;
  } catch (error) {
    console.error("SEO fetch error:", error);
    return null;
  }
};
