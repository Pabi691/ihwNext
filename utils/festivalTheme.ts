import { backendFetchJson } from "@/utils/backendFetch";

/**
 * The active festival theme, resolved server-side so a page can hand it to
 * FestivalThemeProvider (as pageProps.festivalTheme) and ship the palette in
 * the SSR HTML — no first-paint flash of the default colours.
 *
 * Returns null when no theme is active or the backend can't be read. That null
 * is what keeps theming reversible: the provider then injects nothing, and
 * every --site-* token falls back to its index.css default, which is the exact
 * colour it replaced.
 *
 * get_public_settings is cached process-wide for a minute and shared by every
 * page that calls this. Hitting the backend on each render (bots + traffic)
 * previously tripped the host WAF.
 */
const TTL_MS = 60 * 1000;
let cache: { at: number; data: any } | null = null;

async function getPublicSettings(): Promise<any> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;
  const json = await backendFetchJson("/api/v1/get_public_settings");
  cache = { at: Date.now(), data: json };
  return json;
}

export async function getActiveFestivalTheme(): Promise<any | null> {
  try {
    const json = await getPublicSettings();
    const raw = json?.settings?.festival_theme;
    const ft = typeof raw === "string" ? JSON.parse(raw || "{}") : raw;
    return ft && ft.active ? ft : null;
  } catch {
    return null;
  }
}
