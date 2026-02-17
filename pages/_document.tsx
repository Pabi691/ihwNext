import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

const Document = () => (
  <Html lang="en">
    <Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NK7P55MK');`,
        }}
      />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-DC5TNC8E6Q" />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-DC5TNC8E6Q');`,
        }}
      />
    </Head>
    <body>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-NK7P55MK"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
