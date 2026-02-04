import React from "react";
import MainLayOut from "@/layout/MainLayOut";

const NotFound = () => {
  return (
    <MainLayOut>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    </MainLayOut>
  );
};

export default NotFound;
