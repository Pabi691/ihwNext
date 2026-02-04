import React from "react";
import { useLoading } from "../global/LoadingContext";

const Loader = () => {
  const { loading } = useLoading();  // Get loading state from context

  if (!loading) return null;  // Don't render the loader if loading is false

  return (
    <div
      style={{
        height: "100vh",
        background: "#ffffff3d",
        backdropFilter: "blur(6px)",
        position: "fixed",
        zIndex: "1000",
        top: "0",
        left: "0",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="loader" aria-label="Loading" />
        <span className="text-xs text-gray-600">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
