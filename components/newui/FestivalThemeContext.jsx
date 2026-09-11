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
  heroMedia: "images",     // "images" | "video" — what fills the hero slot
  heroVideo: "",           // video URL, used when heroMedia === "video"
  backgroundImage: null,   // null => NHero uses /images/bannerIhw.png
  backgroundImages: [],    // 0..3 CDN URLs — cross-fade in the mobile hero
  rangoli: [],             // 0..3 { url, position, size, rotation, opacity } — [] => drawn SVG motif
  bottomNav: null,         // { bg, bgImage, icons:[4] } — mobile BottomFixedNav overrides
  saleSection: null,       // { bg } — NSaleOffers section background override
  branchPages: {},         // { [branchSlug]: { hero, content } } — copy specific to one branch page
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

// Branch-page copy is deliberately separate from the storefront hero. The
// same festive art and palette are shared, but each location can have its own
// headline and message in the CRM.
function normalizeBranchPages(data) {
  const source = data && data.branchPages;
  if (!source || typeof source !== "object" || Array.isArray(source)) return {};

  const pages = {};
  for (const [slug, value] of Object.entries(source)) {
    if (!/^[a-z0-9-]+$/i.test(slug) || !value || typeof value !== "object") continue;
    const rawLines = Array.isArray(value.hero?.titleLines) && value.hero.titleLines.length
      ? value.hero.titleLines
      : [value.hero?.line1, value.hero?.line2];
    const titleLines = rawLines
      .map((line) => String(line || "").trim())
      .filter(Boolean)
      .slice(0, 2);
    const hero = {
      eyebrow: String(value.hero?.eyebrow || "").trim(),
      titleLines,
      tagline: String(value.hero?.tagline || "").trim(),
      trustedBy: String(value.hero?.trustedBy || "").trim(),
    };
    const content = {
      heading: String(value.content?.heading || "").trim(),
      body: String(value.content?.body || "").trim(),
    };
    if (hero.eyebrow || hero.titleLines.length || hero.tagline || hero.trustedBy || content.heading || content.body) {
      pages[slug] = { hero, content };
    }
  }
  return pages;
}

const PALETTE_KEYS = [
  "--rb-primary",
  "--rb-heading",
  "--rb-heading-dark",
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

// Lift lightness while holding hue and saturation. Mixing toward white would
// raise lightness too, but it drags saturation down and the result reads dusty
// rather than vivid. Computed here so the value ships as a plain hex — relying
// on CSS relative colour meant browsers without it silently fell back to the
// unlit shade.
function lighten(hex, byL) {
  const n = parseInt(String(hex).slice(1), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const L = Math.min(1, Math.max(0, l + byL));
  const c = (1 - Math.abs(2 * L - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = L - c / 2;
  const [r1, g1, b1] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  const hx = (v) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${hx(r1)}${hx(g1)}${hx(b1)}`;
}

// ":root{...}" for one palette. Also drives the live-site --site-* tokens from
// the same values so an active theme re-skins the whole storefront, not just
// the newui components.
function buildPaletteCss(p) {
  if (!p) return "";
  const rbVars = Object.entries(p).map(([k, v]) => `${k}:${v}`).join(";");
  // Derived shades for lit surfaces (the segmented nav pill, the call button).
  const hover = p["--rb-primary-hover"] || p["--rb-primary"];
  const litVars = [
    `--rb-primary-lit:${lighten(hover, 0.14)}`,
    `--rb-primary-lit-soft:${lighten(hover, 0.2)}`,
    `--rb-accent-lit:${lighten(p["--rb-accent"] || "#d9932e", 0.12)}`,
  ].join(";");
  const siteVars = [
    `--site-primary:${p["--rb-primary"]}`,
    `--site-heading:${p["--rb-heading"] || p["--rb-primary"]}`,
    `--site-heading-dark:${p["--rb-heading-dark"] || p["--rb-accent-light"] || p["--rb-accent"]}`,
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
  // Branch pages. Fills come from the primary; anything painted ON a dark branch
  // section takes the light heading/accent tint, never a fill colour — the same
  // split that keeps --site-heading-dark readable. Hover shades are derived
  // from the palette rather than added as more CRM fields.
  const accent = p["--rb-accent"] || "#d9932e";
  const onDeep = p["--rb-heading-dark"] || p["--rb-accent-light"] || accent;
  const branchVars = [
    `--site-brand:${p["--rb-primary"]}`,
    `--site-brand-hover:${p["--rb-primary-hover"]}`,
    `--site-on-brand:${p["--rb-cream"]}`,
    `--site-brand-bright:${p["--rb-primary"]}`,
    `--site-accent-hover:${lighten(accent, -0.08)}`,
    `--site-accent-deep:${lighten(accent, -0.12)}`,
    `--site-accent-tint:${p["--rb-cream"]}`,
    `--site-deep:${p["--rb-primary-mid2"]}`,
    `--site-deeper:${p["--rb-dark"]}`,
    `--site-on-deep:${onDeep}`,
    `--site-on-deep-rgb:${hexToRgbTriplet(onDeep)}`,
    `--site-on-deep-cta:${lightestUnderWhite(hover)}`,
    `--site-on-deep-cta-hover:${lighten(lightestUnderWhite(hover), -0.06)}`,
  ].join(";");
  return `:root{${rbVars};${litVars};${siteVars};${branchVars}}`;
}

// WCAG relative luminance of a #rrggbb colour.
function luminance(hex) {
  const n = parseInt(String(hex).slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// The lightest shade of `hex` that still carries white text at WCAG AA (4.5:1).
// A button sitting on a dark section wants to be as light as it can, so it reads
// against the section, but never so light that its label fails. A fixed shade
// can't do both across palettes: the plain primary nearly vanishes into a dark
// maroon section, while a lit tint fails white text on lighter palettes.
function lightestUnderWhite(hex) {
  for (let byL = 0.2; byL >= -0.3; byL -= 0.02) {
    const c = lighten(hex, byL);
    if (1.05 / (luminance(c) + 0.05) >= 4.5) return c;
  }
  return hex;
}

function normalizePalette(input) {
  if (!input || typeof input !== "object") return null;
  const out = {};
  for (const k of PALETTE_KEYS) {
    const v = typeof input[k] === "string" ? input[k].trim().toLowerCase() : "";
    if (HEX.test(v)) out[k] = v;
  }
  // Themes saved before --rb-heading existed only carry --rb-primary; keep them
  // rendering exactly as they did by deriving the heading colour from it.
  if (!out["--rb-heading"] && out["--rb-primary"]) out["--rb-heading"] = out["--rb-primary"];
  // Same for --rb-heading-dark. It must never fall back to --rb-heading: that
  // colour is chosen to read on cream, and these headings sit on --rb-dark.
  // --rb-accent-light is already the "light enough for dark grounds" token.
  if (!out["--rb-heading-dark"]) out["--rb-heading-dark"] = out["--rb-accent-light"] || out["--rb-accent"] || "";
  if (!out["--rb-heading-dark"]) delete out["--rb-heading-dark"];
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
    heroMedia: data.heroMedia === "video" ? "video" : "images",
    heroVideo: typeof data.heroVideo === "string" ? data.heroVideo.trim() : "",
    backgroundImage: images[0] || null,
    backgroundImages: images,
    rangoli: normalizeRangoli(data),
    bottomNav: normalizeBottomNav(data),
    saleSection:
      data.saleSection && typeof data.saleSection.bg === "string" && data.saleSection.bg.trim()
        ? { bg: data.saleSection.bg.trim() }
        : null,
    branchPages: normalizeBranchPages(data),
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

  const paletteCss = useMemo(() => buildPaletteCss(theme.palette), [theme.palette]);
  const value = useMemo(() => ({ theme, loading }), [theme, loading]);

  return (
    <FestivalThemeContext.Provider value={value}>
      {/* Rendered into the markup rather than appended to <head> in an effect:
          an effect only runs after hydration, so the first paint used the
          index.css defaults and the real palette snapped in a moment later —
          a visible flash of the wrong (maroon) theme. As JSX this ships with
          the SSR HTML whenever the page supplies the theme up front. */}
      {paletteCss ? (
        <style id={STYLE_EL_ID} dangerouslySetInnerHTML={{ __html: paletteCss }} />
      ) : null}
      {children}
    </FestivalThemeContext.Provider>
  );
}

export function useFestivalTheme() {
  return useContext(FestivalThemeContext);
}
