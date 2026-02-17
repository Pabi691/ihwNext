import { useEffect, useState } from "react";
import { useGlobal } from "../global/GlobalContext";
import { globalContent } from "../services/globalcontent.service";
import { ENV } from "../config/env";

const useGlobalContent = () => {
  const { token, publicToken, globalContentData: contextData } = useGlobal();
  const [globalContentData, setGlobalContentData] = useState(contextData || null);
  const [loading, setLoading] = useState(!contextData);

  useEffect(() => {
    const fetchToken = publicToken || token || ENV.WEB_TOKEN;
    if (!fetchToken) return;

    const loadGlobalContent = async () => {
      // Only set loading if we don't need to show existing data, but typically we want to show loading indicator if fetching new data
      setLoading(true);
      try {
        const apiResponse = await globalContent(fetchToken);
        setGlobalContentData(apiResponse || { head: "", body: "", footer: "" });
      } catch (_error) {
        setGlobalContentData({ head: "", body: "", footer: "" });
      } finally {
        setLoading(false);
      }
    };

    loadGlobalContent();
  }, [token, publicToken]);

  return { globalContentData, loading };
};

export default useGlobalContent;
