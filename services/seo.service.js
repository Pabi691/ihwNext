import axios from "axios";
import { ENV } from "../config/env";

export const fetchSeoBySlug = async (slug, token) => {
  const tryFetch = async (candidateSlug) => {
    console.log("Candidate Slug:", candidateSlug);
    const url = `${ENV.API_URL}/api/v1/get_slug_data/${candidateSlug}`;
    console.log("URL:", url);
    const config = token
      ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      : {};

    const res = await axios.get(url, config);
    return res.data || null;
  };

  try {
    if (!slug) return null;

    const data = await tryFetch(slug);
    if (data?.pageData || data?.product_details) {
      return data;
    }

    return null;
  } catch (error) {
    console.error("SEO fetch error:", error);
    return null;
  }
};
