import { ENV } from "@/config/env";
import { toAbsoluteUrlIfPresent } from "@/utils/seo";
import { STATIC_ROUTE_SEO_CANDIDATES } from "@/utils/seoStaticRoutes";

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
  robots?: string;
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
  const segments = noQuery.split("/").filter(Boolean);
  if (!segments.length) return "/";
  return `/${segments[segments.length - 1]}`;
};

const SEO_SESSION_PREFIX = "seo:meta:v3:";
const getSeoSessionKey = (path?: string) => `${SEO_SESSION_PREFIX}${normalizeSeoPath(path)}`;

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

type CategoryNode = {
  slug?: string;
  category_name?: string;
  cat_desc?: string;
  cat_img?: string;
  cat_banner?: string;
  seo_metadata?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    meta_index?: string;
    meta_follow?: string;
    canonical_url?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    og_url?: string;
    og_type?: string;
  };
  child_categories?: unknown;
  children?: unknown;
};

type ProductNode = {
  slug?: string;
  prod_name?: string;
  prod_desc?: string;
  product_tag?: string;
  primary_img?: string;
  seo_metadata?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    meta_index?: string;
    meta_follow?: string;
    canonical_url?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    og_url?: string;
    og_type?: string;
  };
};

const SEO_PRELOAD_KEY = "seo:meta:preloaded:v3";
let seoPreloadPromise: Promise<void> | null = null;

const toArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>) as T[];
  }
  return [];
};

const authHeaders: Record<string, string> = ENV.WEB_TOKEN
  ? { Authorization: `Bearer ${ENV.WEB_TOKEN}` }
  : {};

const fetchJsonWithAuthFallback = async (url: string) => {
  const baseHeaders: Record<string, string> = {
    Accept: "application/json",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  };

  let res = await fetch(url, { headers: { ...baseHeaders, ...authHeaders } });
  if (!res.ok && ENV.WEB_TOKEN) {
    res = await fetch(url, { headers: baseHeaders });
  }
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const categorySeoFromNode = (category: CategoryNode): SeoShape | null => {
  if (!category?.slug) return null;
  const seo = category.seo_metadata || {};
  const canonicalUrl = toAbsoluteUrlIfPresent(
    seo.canonical_url || seo.og_url || `/${category.slug}`
  );
  const ogImage = toAbsoluteUrlIfPresent(
    seo.og_image || category.cat_banner || category.cat_img || ""
  );

  return {
    title: seo.meta_title || category.category_name || "",
    description: seo.meta_description || category.cat_desc || "",
    keywords: seo.meta_keywords || category.category_name || "",
    canonicalUrl,
    ogTitle: seo.og_title || seo.meta_title || category.category_name || "",
    ogDescription: seo.og_description || seo.meta_description || category.cat_desc || "",
    ogImage,
    ogUrl: toAbsoluteUrlIfPresent(seo.og_url || canonicalUrl),
    ogType: seo.og_type || "website",
    robots: `${seo.meta_index || "index"}, ${seo.meta_follow || "follow"}`,
  };
};

const productSeoFromNode = (product: ProductNode): SeoShape | null => {
  if (!product?.slug) return null;
  const seo = product.seo_metadata || {};
  const canonicalUrl = toAbsoluteUrlIfPresent(
    seo.canonical_url || seo.og_url || `/product/${product.slug}`
  );
  const ogImage = toAbsoluteUrlIfPresent(seo.og_image || product.primary_img || "");

  return {
    title: seo.meta_title || product.prod_name || "",
    description: seo.meta_description || product.prod_desc || "",
    keywords: seo.meta_keywords || product.product_tag || "",
    canonicalUrl,
    ogTitle: seo.og_title || seo.meta_title || product.prod_name || "",
    ogDescription: seo.og_description || seo.meta_description || product.prod_desc || "",
    ogImage,
    ogUrl: toAbsoluteUrlIfPresent(seo.og_url || canonicalUrl),
    ogType: seo.og_type || "product",
    robots: `${seo.meta_index || "index"}, ${seo.meta_follow || "follow"}`,
  };
};

const collectCategoryNodes = (nodes: unknown): CategoryNode[] => {
  const list = toArray<CategoryNode>(nodes);
  const collected: CategoryNode[] = [];

  for (const node of list) {
    collected.push(node);
    const nested = node?.child_categories ?? node?.children;
    if (nested) {
      collected.push(...collectCategoryNodes(nested));
    }
  }

  return collected;
};

export const preloadSeoSessionBySlugs = async () => {
  if (typeof window === "undefined") return;
  if (seoPreloadPromise) return seoPreloadPromise;
  if (sessionStorage.getItem(SEO_PRELOAD_KEY)) return;

  seoPreloadPromise = (async () => {
    try {
      const apiBaseUrl = String(ENV.API_URL || "https://server.indianhairworld.com").replace(/\/+$/, "");
      const [categoryJson, productJson] = await Promise.all([
        fetchJsonWithAuthFallback(`${apiBaseUrl}/api/v1/categories`),
        fetchJsonWithAuthFallback(`${apiBaseUrl}/api/v1/get_active_products`),
      ]);

      const categorySource =
        categoryJson?.category_list ??
        categoryJson?.categories ??
        categoryJson?.data?.category_list ??
        categoryJson?.data?.categories ??
        [];
      const categories = collectCategoryNodes(categorySource);
      for (const category of categories) {
        if (!category?.slug) continue;
        writeSeoToSession(`/${category.slug}`, categorySeoFromNode(category));
      }

      const productSource = productJson?.products ?? productJson?.product_list ?? [];
      const products = toArray<ProductNode>(productSource);
      for (const product of products) {
        if (!product?.slug) continue;
        writeSeoToSession(`/${product.slug}`, productSeoFromNode(product));
      }

      const staticRouteEntries = Object.entries(
        STATIC_ROUTE_SEO_CANDIDATES as Record<string, string[]>
      );
      for (const [route, candidates] of staticRouteEntries) {
        const candidate = toArray<string>(candidates)[0];
        if (!candidate) continue;
        const staticSeoJson = await fetchJsonWithAuthFallback(
          `${apiBaseUrl}/api/v1/get_slug_data/${candidate}`
        );
        const payload = staticSeoJson?.pageData
          ? {
            title: staticSeoJson?.pageData?.seo_metadata?.meta_title || staticSeoJson?.pageData?.title || "",
            description:
              staticSeoJson?.pageData?.seo_metadata?.meta_description ||
              staticSeoJson?.pageData?.description ||
              "",
            keywords:
              staticSeoJson?.pageData?.seo_metadata?.meta_keywords ||
              staticSeoJson?.pageData?.keywords ||
              "",
            canonicalUrl: toAbsoluteUrlIfPresent(
              staticSeoJson?.pageData?.seo_metadata?.canonical_url ||
              staticSeoJson?.pageData?.seo_metadata?.og_url ||
              route
            ),
            ogTitle:
              staticSeoJson?.pageData?.seo_metadata?.og_title ||
              staticSeoJson?.pageData?.seo_metadata?.meta_title ||
              staticSeoJson?.pageData?.title ||
              "",
            ogDescription:
              staticSeoJson?.pageData?.seo_metadata?.og_description ||
              staticSeoJson?.pageData?.seo_metadata?.meta_description ||
              staticSeoJson?.pageData?.description ||
              "",
            ogImage: toAbsoluteUrlIfPresent(
              staticSeoJson?.pageData?.seo_metadata?.og_image ||
              staticSeoJson?.pageData?.primary_img ||
              ""
            ),
            ogUrl: toAbsoluteUrlIfPresent(
              staticSeoJson?.pageData?.seo_metadata?.og_url ||
              staticSeoJson?.pageData?.seo_metadata?.canonical_url ||
              route
            ),
            ogType: staticSeoJson?.pageData?.seo_metadata?.og_type || "website",
            robots: `${staticSeoJson?.pageData?.seo_metadata?.meta_index || "index"}, ${staticSeoJson?.pageData?.seo_metadata?.meta_follow || "follow"}`,
          }
          : null;
        writeSeoToSession(route, payload);
      }

      sessionStorage.setItem(SEO_PRELOAD_KEY, String(Date.now()));
    } catch {
      // Silent fail: page-level SEO fetch continues to work.
    } finally {
      seoPreloadPromise = null;
    }
  })();

  return seoPreloadPromise;
};
