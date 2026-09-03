import React, { useEffect, useState } from "react";
import Head from "next/head";
import NewUIPreview from "@/components/newui/NewUIPreview";
import { FestivalThemeProvider } from "@/components/newui/FestivalThemeContext";

/**
 * Embedded live preview for the CRM. The admin page iframes this and pushes the
 * in-editor festival theme via postMessage on every change; here we apply it as
 * `forcedTheme`. With no message yet, the provider falls back to fetching the
 * currently-active theme. Not linked anywhere, noindex.
 *
 * View mode: `?view=desktop` (or a postMessage `{ view }`) renders the page at
 * its natural width so the desktop breakpoints kick in — the admin frames this
 * wide and scales it down. Default is the phone layout.
 */
export default function ThemePreviewLive() {
  const [theme, setTheme] = useState<any>(null);
  const [view, setView] = useState<"phone" | "desktop">("phone");

  useEffect(() => {
    // initial view from the query string, e.g. /theme-preview/live?view=desktop
    const q = new URLSearchParams(window.location.search).get("view");
    if (q === "desktop" || q === "phone") setView(q);

    const adminOrigin = process.env.NEXT_PUBLIC_ADMIN_ORIGIN || "";
    const onMsg = (e: MessageEvent) => {
      // This page is only ever embedded by the CRM Settings editor. Accept
      // messages from the window that framed us (any origin — the admin lives
      // on a different host in every deployment) or from a known origin.
      const fromEmbedder = window.parent !== window && e.source === window.parent;
      const originOk =
        e.origin === window.location.origin ||
        (adminOrigin && e.origin === adminOrigin) ||
        /localhost(:\d+)?$/.test(e.origin) ||
        /\.indianhairworld\.com$/.test(e.origin) ||
        /\.vercel\.app$/.test(e.origin);
      if ((!fromEmbedder && !originOk) || !e.data) return;
      if (e.data.type !== "ihw-festival-theme") return;
      if (e.data.view === "desktop" || e.data.view === "phone") setView(e.data.view);
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
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Head>
      {/* embed tweaks — this page is only ever shown inside the CRM iframe */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html { scrollbar-width: none; }
            ::-webkit-scrollbar { width: 0; height: 0; display: none; }
            .floating-contact { display: none !important; }
            ${
              view === "phone"
                ? `
            /* lift the fixed mobile bottom-nav off the frame edge */
            .ihw-bottom-nav {
              left: 10px !important; right: 10px !important; width: auto !important;
              bottom: 14px !important; border-radius: 22px !important;
              overflow: visible; /* let the raised centre call button show */
            }
            body { padding-bottom: 28px; }
            `
                : ""
            }
          `,
        }}
      />
      <FestivalThemeProvider forcedTheme={theme ? { ...theme, active: true } : null}>
        <NewUIPreview />
      </FestivalThemeProvider>
    </>
  );
}
