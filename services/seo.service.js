import axios from "axios";
import { ENV } from "../config/env";

export const fetchSeoBySlug = async (slug, token) => {
  try {
    const res = await axios.get(
      `${ENV.API_URL}/api/v1/get_slug_data/${slug}`,
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
