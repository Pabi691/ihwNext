import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ENV } from "@/config/env";

/**
 * Festival theme — read-only on the storefront.
 *
 * The theme is authored in the CRM (admin Settings → Festival Theme) and
 * persisted by the Laravel backend as a single JSON value under the
 * `festival_theme` key in `app_settings`. This provider fetches it from
 * `/api/v1/get_public_settings` and, when the theme is marked active,
 * applies:
 *   • a colour palette that overrides the --rb-* tokens from index.css
 *   • hero copy (eyebrow / title lines / tagline)
 *   • promo-strip copy
 *   • the CRM-generated decorative hero image
 *
 * The palette is injected as a <style> element appended to <head> AFTER
 * index.css, so at equal specificity it wins the cascade. When no active
 * theme exists, components fall back to DEFAULT_THEME below (the current
 * hardcoded Raksha Bandhan strings), so nothing breaks.
 */

const STYLE_EL_ID = "ihw-festival-theme-vars";
const SETTINGS_KEY = "festival_theme";

export const DEFAULT_THEME = {
  name: null,
  active: false,
  palette: null, // null => use the :root values in index.css
  hero: {
    eyebrow: "Celebrate",
    titleLines: ["Raksha", "Bandhan"],
    tagline: "Instant Confidence, Instant Style",
    trustedBy: "Vindu Dara Singh",
  },
  promo: {
    label: "RAKSHA BANDHAN – 28 AUG, FRIDAY",
    subtitle: "Celebrate the bond with love & care.",
  },
  backgroundImage: null,   // null => NHero uses /images/bannerIhw.png
  backgroundImages: [],    // 0..3 CDN URLs — cross-fade in the mobile hero
  rangoli: [],             // 0..3 { url, position, size, rotation, opacity } — [] => drawn SVG motif
  bottomNav: null,         // { bg, bgImage, icons:[4] } — mobile BottomFixedNav overrides
  saleSection: null,       // { bg } — NSaleOffers section background override
};

function normalizeBottomNav(data) {
  const b = data && data.bottomNav;
  if (!b || typeof b !== "object") return null;
  const bg = typeof b.bg === "string" ? b.bg.trim() : "";
  const bgImage = typeof b.bgImage === "string" ? b.bgImage.trim() : "";
  const icons = Array.isArray(b.icons)
    ? [0, 1, 2, 3].map((i) => (typeof b.icons[i] === "string" ? b.icons[i].trim() : ""))
    : ["", "", "", ""];
  if (!bg && !bgImage && !icons.some(Boolean)) return null;
  return { bg, bgImage, icons };
}

const RANGOLI_DEFAULT = { url: "", position: "top-right", size: 40, rotation: 0, opacity: 20 };

function normalizeRangoli(data) {
  if (Array.isArray(data.rangoli)) {
    return data.rangoli
      .filter((r) => r && typeof r.url === "string" && r.url.trim())
      .map((r) => ({
        url: r.url.trim(),
        position: r.position || "top-right",
        size: Number(r.size) || 40,
        rotation: Number(r.rotation) || 0,
        opacity: r.opacity == null ? 20 : Number(r.opacity),
      }))
      .slice(0, 3);
  }
  if (typeof data.rangoliImage === "string" && data.rangoliImage.trim()) {
    return [{ ...RANGOLI_DEFAULT, url: data.rangoliImage.trim() }];
  }
  return [];
}

const PALETTE_KEYS = [
  "--rb-primary",
  "--rb-primary-hover",
  "--rb-primary-mid",
  "--rb-primary-mid2",
  "--rb-dark",
  "--rb-accent",
  "--rb-accent-light",
  "--rb-accent-lighter",
  "--rb-cream",
  "--rb-cream-border",
];
const HEX = /^#[0-9a-fA-F]{6}$/;

// "#rrggbb" -> "r g b" (space-separated channels for rgb(... / <alpha>))
function hexToRgbTriplet(hex) {
  const n = parseInt(String(hex).slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

function normalizePalette(input) {
  if (!input || typeof input !== "object") return null;
  const out = {};
  for (const k of PALETTE_KEYS) {
    const v = typeof input[k] === "string" ? input[k].trim().toLowerCase() : "";
    if (HEX.test(v)) out[k] = v;
  }
  return Object.keys(out).length ? out : null;
}

function parseFestivalTheme(raw) {
  if (!raw) return DEFAULT_THEME;
  let data;
  try {
    data = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return DEFAULT_THEME;
  }
  if (!data || typeof data !== "object" || !data.active) return DEFAULT_THEME;

  // Active theme stores hero.titleLines; library entries store hero.line1/line2.
  // Blank lines are dropped — an empty field renders nothing in the hero.
  const rawLines = Array.isArray(data.hero?.titleLines) && data.hero.titleLines.length
    ? data.hero.titleLines
    : [data.hero?.line1, data.hero?.line2];
  const titleLines = rawLines.map((s) => String(s || "").trim()).filter(Boolean).slice(0, 2);

  const images = Array.isArray(data.heroImages)
    ? data.heroImages.filter((s) => typeof s === "string" && s.trim()).slice(0, 3)
    : (data.heroImageUrl ? [data.heroImageUrl] : []);

  return {
    name: data.name || null,
    active: true,
    palette: normalizePalette(data.palette),
    // No fallbacks — a field left blank in the CRM renders blank in the hero.
    hero: {
      eyebrow: String(data.hero?.eyebrow || "").trim(),
      titleLines,
      tagline: String(data.hero?.tagline || "").trim(),
      trustedBy: String(data.hero?.trustedBy || "").trim(),
    },
    promo: {
      label: String(data.promo?.label || "").trim(),
      subtitle: String(data.promo?.subtitle || "").trim(),
    },
    backgroundImage: images[0] || null,
    backgroundImages: images,
    rangoli: normalizeRangoli(data),
    bottomNav: normalizeBottomNav(data),
    saleSection:
      data.saleSection && typeof data.saleSection.bg === "string" && data.saleSection.bg.trim()
        ? { bg: data.saleSection.bg.trim() }
        : null,
  };
}

const FestivalThemeContext = createContext({ theme: DEFAULT_THEME, loading: true });

// The provider sits in _app.tsx, so without this it re-fetches get_public_settings
// on every client-side navigation. Cache the raw value briefly and share one
// in-flight request across all mounts.
const PUBLIC_SETTINGS_TTL_MS = 60 * 1000;
const PUBLIC_SETTINGS_CACHE_KEY = "ihw:get_public_settings:v1";
let inFlightPublicSettings = null;

async function fetchPublicSettingsRaw() {
  // 1. fresh value stashed this session?
  try {
    const cached = JSON.parse(sessionStorage.getItem(PUBLIC_SETTINGS_CACHE_KEY) || "null");
    if (cached && Date.now() - cached.at < PUBLIC_SETTINGS_TTL_MS) return cached.raw;
  } catch {
    /* ignore */
  }
  // 2. a request already going out? ride it.
  if (inFlightPublicSettings) return inFlightPublicSettings;

  inFlightPublicSettings = (async () => {
    try {
      const res = await fetch(`${ENV.API_URL}/api/v1/get_public_settings`, {
        headers: { Accept: "application/json" },
      });
      const json = await res.json();
      const raw = json?.settings?.[SETTINGS_KEY];
      try {
        sessionStorage.setItem(PUBLIC_SETTINGS_CACHE_KEY, JSON.stringify({ at: Date.now(), raw }));
      } catch {
        /* ignore quota */
      }
      return raw;
    } finally {
      inFlightPublicSettings = null;
    }
  })();
  return inFlightPublicSettings;
}

export function FestivalThemeProvider({ children, forcedTheme = null }) {
  // forcedTheme (used by the theme-preview routes): render a specific saved
  // theme, always active, and skip the network read. Additive — no forcedTheme
  // => the original storefront behaviour (fetch the active theme) is unchanged.
  const [theme, setTheme] = useState(
    forcedTheme ? parseFestivalTheme({ ...forcedTheme, active: true }) : DEFAULT_THEME
  );
  const [loading, setLoading] = useState(!forcedTheme);

  useEffect(() => {
    if (forcedTheme) {
      setTheme(parseFestivalTheme({ ...forcedTheme, active: true }));
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const raw = await fetchPublicSettingsRaw();
        if (!cancelled) setTheme(parseFestivalTheme(raw));
      } catch {
        if (!cancelled) setTheme(DEFAULT_THEME);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [forcedTheme]);

  // Keep a <style> tag in <head> in sync with the active palette.
  useEffect(() => {
    if (typeof document === "undefined") return;
    let el = document.getElementById(STYLE_EL_ID);

    if (!theme.palette) {
      if (el) el.remove();
      return;
    }
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_EL_ID;
      document.head.appendChild(el);
    }
    const p = theme.palette;
    const rbVars = Object.entries(p).map(([k, v]) => `${k}:${v}`).join(";");
    // Also drive the live-site --site-* tokens (index.css) from the same palette,
    // so an active festival theme re-skins the real storefront, not just the
    // newui preview. Removed together with rbVars on deactivate — clean revert.
    const siteVars = [
      `--site-primary:${p["--rb-primary"]}`,
      `--site-primary-hover:${p["--rb-primary-hover"]}`,
      `--site-accent:${p["--rb-accent"]}`,
      `--site-hero-from:${p["--rb-primary-mid2"]}`,
      `--site-hero-via:${p["--rb-primary-mid"]}`,
      `--site-hero-to:${p["--rb-accent-lighter"]}`,
      `--site-promo-from:${p["--rb-primary-mid2"]}`,
      `--site-promo-to:${p["--rb-primary"]}`,
      `--site-dark:${p["--rb-dark"]}`,
      `--site-light:${p["--rb-cream"]}`,
      `--site-cta-from:${p["--rb-primary"]}`,
      `--site-cta-to:${p["--rb-primary-hover"]}`,
      `--site-nav-bg:${p["--rb-dark"]}`,
      `--site-primary-rgb:${hexToRgbTriplet(p["--rb-primary"])}`,
      `--site-accent-rgb:${hexToRgbTriplet(p["--rb-accent"])}`,
      `--site-dark-rgb:${hexToRgbTriplet(p["--rb-dark"])}`,
    ].join(";");
    el.textContent = `:root{${rbVars};${siteVars}}`;
  }, [theme.palette]);

  // Clean up the style tag if the provider unmounts.
  useEffect(() => {
    return () => {
      const el =
        typeof document !== "undefined" && document.getElementById(STYLE_EL_ID);
      if (el) el.remove();
    };
  }, []);

  const value = useMemo(() => ({ theme, loading }), [theme, loading]);

  return (
    <FestivalThemeContext.Provider value={value}>
      {children}
    </FestivalThemeContext.Provider>
  );
}

export function useFestivalTheme() {
  return useContext(FestivalThemeContext);
}
