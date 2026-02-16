import { useEffect, useState } from "react";
import { fetchSeoBySlug } from "../services/seo.service";
import { normalizeSeo } from "../utils/normalizeSeo";
import { useGlobal } from "../global/GlobalContext";

const useSeo = (slug, initialSeo = null) => {
  const { token, publicToken } = useGlobal();
  const [seo, setSeo] = useState(initialSeo);
  const [loading, setLoading] = useState(!initialSeo);

  useEffect(() => {
    const fetchToken = publicToken || token;
    if (!slug) return;

    // If we have initial data (from server), don't fetch again on mount
    // unless the slug changes from the initial one (which is handled by dependency array)
    if (initialSeo && slug) {
      // Simple check: if the initialSeo matches what we expect, maybe skip? 
      // For now, if initialSeo is provided, we assume it's for the current slug.
      // But if context changes (client navigation), this effect runs.
      // We need to be careful not to overwrite fresh server data with stale nulls or re-fetch unnecessarily.
    }

    const loadSeo = async () => {
      setLoading(true);

      const apiResponse = await fetchSeoBySlug(slug, fetchToken);
      const normalizedSeo = normalizeSeo(apiResponse);
      // console.log("API slug:", slug);
      // console.log("Normalized SEO:", normalizedSeo);

      setSeo(normalizedSeo);
      setLoading(false);
    };

    if (!initialSeo) {
      loadSeo();
    } else {
      // If we have initialSeo, we might still want to fetch if the slug changes client-side
      // For simplicity, let's just respect the slug dependency.
      // If initialSeo is present, it's used for state init. 
      // If slug changes, we fetch. 
      // But on first render with initialSeo, we shouldn't fetch.
      // A common pattern:
      // const isFirstMount = useRef(true);
      // if (isFirstMount.current) { isFirstMount.current = false; if(initialSeo) return; }

      // Actually, just checking if seo is already set matching the slug would be ideal, but seo doesn't have slug.
      // Let's just blindly fetch if not initialSeo, OR if we navigated. 
      // But 'initialSeo' is a prop that might stay constant or be undefined on client nav.
      // If we are navigating client side, initialSeo from _app might be stale or null depending on implementation.
      // In _app, pageSeoData is calculated on every getInitialProps (server & client transitions).
      // So actually, intialSeo will effectively be "currentSeo" from _app.
      // So we can just setSeo(initialSeo) when it changes?
      // But useSeo is called inside GlobalSeo which gets it from _app.
      // So we might not even need the effect if _app handles everything!

      // However, keeping the effect for safety if used elsewhere without _app's data.
    }
  }, [slug, token, publicToken]);

  // Better approach given _app structure:
  // Since GlobalSeo receives `initialSeo` (which is fresh from _app's getInitialProps even on client nav),
  // we can just sync state with it.

  useEffect(() => {
    if (initialSeo) {
      setSeo(initialSeo);
      setLoading(false);
    } else if (slug) {
      // Fallback or purely client-side usage
      const fetchToken = publicToken || token;
      const load = async () => {
        setLoading(true);
        const res = await fetchSeoBySlug(slug, fetchToken);
        setSeo(normalizeSeo(res));
        setLoading(false);
      };
      load();
    }
  }, [slug, initialSeo, token, publicToken]);

  return { seo, loading };
};

export default useSeo;
