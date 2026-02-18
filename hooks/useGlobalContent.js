import { useEffect, useState } from "react";
import { useGlobal } from "../global/GlobalContext";

const useGlobalContent = () => {
  const { globalContentData: contextData } = useGlobal();
  const [globalContentData, setGlobalContentData] = useState(
    contextData || { head: "", body: "", footer: "" }
  );
  const [loading, setLoading] = useState(!contextData);

  useEffect(() => {
    setGlobalContentData(contextData || { head: "", body: "", footer: "" });
    setLoading(false);
  }, [contextData]);

  return { globalContentData, loading };
};

export default useGlobalContent;
