import React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentInitialProps,
} from "next/document";
import { getSiteCode, EMPTY_SITE_CODE, type SiteCode } from "@/utils/siteCode.server";
import { htmlToElements } from "@/utils/htmlToElements";

type Props = DocumentInitialProps & { siteCode: SiteCode };

/**
 * Site-wide custom code (CRM → Settings → Custom Code) is placed here:
 *   Head        → inside <head>
 *   Body start  → right after <body>
 *   Body end    → just before </body>
 * Page-specific head code (CRM → Pages → Head Code) is added by SeoHead.
 */
class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext): Promise<Props> {
    const [initialProps, siteCode] = await Promise.all([
      Document.getInitialProps(ctx),
      getSiteCode(),
    ]);
    return { ...initialProps, siteCode };
  }

  render() {
    const code = this.props.siteCode || EMPTY_SITE_CODE;
    return (
      <Html lang="en">
        <Head>{htmlToElements(code.head, "site-head")}</Head>
        <body>
          {htmlToElements(code.bodyStart, "site-body-start")}
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
          {htmlToElements(code.bodyEnd, "site-body-end")}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
