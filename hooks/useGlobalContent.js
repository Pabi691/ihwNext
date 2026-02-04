import { useEffect, useState } from "react";
import { useGlobal } from "../global/GlobalContext";
import { globalContent } from "../services/globalcontent.service";

const useGlobalContent = () => {
  const { token, publicToken } = useGlobal();
  const [globalContentData, setGlobalContentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = publicToken || token;
    if (!fetchToken) return;

    const loadGlobalContent = async () => {
      setLoading(true);

      // Fetch current page SEO
      let apiResponse = await globalContent(fetchToken);

      setGlobalContentData(apiResponse);
      setLoading(false);
    };

    loadGlobalContent();
  }, [token, publicToken]);

  return { globalContentData, loading };
};

export default useGlobalContent;
