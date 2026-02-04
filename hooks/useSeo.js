import { useEffect, useState } from "react";
import { fetchSeoBySlug } from "../services/seo.service";
import { normalizeSeo } from "../utils/normalizeSeo";
import { useGlobal } from "../global/GlobalContext";

const useSeo = (slug) => {
  const { token } = useGlobal();
  const [seo, setSeo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !token) return;

    const loadSeo = async () => {
      setLoading(true);

      const apiResponse = await fetchSeoBySlug(slug, token);
      const normalizedSeo = normalizeSeo(apiResponse);
      // console.log("API slug:", slug);
      // console.log("Normalized SEO:", normalizedSeo);

      setSeo(normalizedSeo);
      setLoading(false);
    };

    loadSeo();
  }, [slug, token]);

  return { seo, loading };
};

export default useSeo;
