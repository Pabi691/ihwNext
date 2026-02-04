import axios from "axios";
import { ENV } from "../config/env";

export const globalContent = async (token) => {
  try {
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
