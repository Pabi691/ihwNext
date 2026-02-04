import { useEffect } from "react";
import { useLocation } from "@/components/compat/router";
import { useLoading } from "./LoadingContext";

const LoadingWrapper = ({ children }) => {
  const { setLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);  // Set loading to true when the route changes
    const timer = setTimeout(() => {
      setLoading(false);  // Set loading to false after a brief delay
    }, 1000);  // Adjust the timeout if needed for your preferred loading time

    return () => clearTimeout(timer);  // Cleanup the timeout if necessary
  }, [location, setLoading]);

  return children;
};

export default LoadingWrapper;

