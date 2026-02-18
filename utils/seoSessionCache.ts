type SeoShape = {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
};

type SeoCacheEntry = {
  expiresAt: number;
  data: SeoShape;
};

export const SEO_SESSION_TTL_MS = 30 * 60 * 1000;

export const normalizeSeoPath = (path?: string) => {
  const raw = String(path || "/");
  const noHash = raw.split("#")[0] || "/";
  const noQuery = noHash.split("?")[0] || "/";
  return noQuery || "/";
};

const getSeoSessionKey = (path?: string) => `seo:meta:${normalizeSeoPath(path)}`;

export const hasMeaningfulSeo = (seo: SeoShape | null | undefined) => {
  if (!seo) return false;
  const fields = [
    seo.title,
    seo.description,
    seo.keywords,
    seo.canonicalUrl,
    seo.ogTitle,
    seo.ogDescription,
    seo.ogImage,
    seo.ogUrl,
    seo.ogType,
  ];
  return fields.some((v) => typeof v === "string" && v.trim().length > 0);
};

export const readSeoFromSession = (path?: string): SeoShape | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(getSeoSessionKey(path));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as SeoCacheEntry;
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.expiresAt !== "number" || parsed.expiresAt <= Date.now()) {
      sessionStorage.removeItem(getSeoSessionKey(path));
      return null;
    }
    if (!parsed.data || typeof parsed.data !== "object") return null;

    return parsed.data;
  } catch {
    return null;
  }
};

export const writeSeoToSession = (
  path: string | undefined,
  seo: SeoShape | null | undefined,
  ttlMs = SEO_SESSION_TTL_MS
) => {
  if (typeof window === "undefined") return;
  if (!hasMeaningfulSeo(seo)) return;

  try {
    const entry: SeoCacheEntry = {
      expiresAt: Date.now() + ttlMs,
      data: seo as SeoShape,
    };
    sessionStorage.setItem(getSeoSessionKey(path), JSON.stringify(entry));
  } catch {
    // Ignore storage quota/security errors.
  }
};

