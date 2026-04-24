import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

const Document = () => (
  <Html lang="en">
    <Head />
    <body>
      {/* GTM noscript fallback — scripts moved to _app.tsx via next/script */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-NK7P55MK"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=8204283123019412&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
