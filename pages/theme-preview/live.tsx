import React, { useEffect, useState } from "react";
import Head from "next/head";
import NewUIPreview from "@/components/newui/NewUIPreview";
import { FestivalThemeProvider } from "@/components/newui/FestivalThemeContext";

/**
 * Embedded live preview for the CRM. The admin page iframes this and pushes the
 * in-editor festival theme via postMessage on every change; here we apply it as
 * `forcedTheme`. With no message yet, the provider falls back to fetching the
 * currently-active theme. Not linked anywhere, noindex.
 */
export default function ThemePreviewLive() {
  const [theme, setTheme] = useState<any>(null);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const ok =
        e.origin === window.location.origin ||
        /localhost(:\d+)?$/.test(e.origin) ||
        /\.indianhairworld\.com$/.test(e.origin);
      if (!ok || !e.data || e.data.type !== "ihw-festival-theme") return;
      try {
        const raw = e.data.theme;
        setTheme(typeof raw === "string" ? JSON.parse(raw) : raw);
      } catch {
        /* ignore malformed */
      }
    };
    window.addEventListener("message", onMsg);
    // tell the CRM the iframe is mounted and ready to receive
    try {
      window.parent?.postMessage({ type: "ihw-preview-ready" }, "*");
    } catch {}
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <>
      <Head>
        <title>Live theme preview</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {/* embed tweaks — this page is only ever shown inside the CRM iframe */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html { scrollbar-width: none; }
            ::-webkit-scrollbar { width: 0; height: 0; display: none; }
            .floating-contact { display: none !important; }
            /* lift the fixed mobile bottom-nav off the frame edge */
            .ihw-bottom-nav {
              left: 10px !important; right: 10px !important; width: auto !important;
              bottom: 14px !important; border-radius: 22px !important;
              overflow: visible; /* let the raised centre call button show */
            }
            body { padding-bottom: 28px; }
          `,
        }}
      />
      <FestivalThemeProvider forcedTheme={theme ? { ...theme, active: true } : null}>
        <NewUIPreview />
      </FestivalThemeProvider>
    </>
  );
}
