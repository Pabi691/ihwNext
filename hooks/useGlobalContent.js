import { useEffect, useState } from "react";
import { useGlobal } from "../global/GlobalContext";
import { globalContent } from "../services/globalcontent.service";

const useGlobalContent = () => {
  const { token } = useGlobal();
  const [globalContentData, setGlobalContentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ( !token) return;

    const loadGlobalContent = async () => {
      setLoading(true);

      // Fetch current page SEO
      let apiResponse = await globalContent(token);

      setGlobalContentData(apiResponse);
      setLoading(false);
    };

    loadGlobalContent();
  }, [ token]);

  return { globalContentData, loading };
};

export default useGlobalContent;
