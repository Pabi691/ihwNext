import MetaContentConfig from "@/content/MetaContentConfig";

const SITE_URL = "https://www.indianhairworld.com";

const isAbsolute = (value: string) => /^https?:\/\//i.test(value);

export const toAbsoluteUrl = (value?: string | null, fallbackPath = "/") => {
  if (!value) return `${SITE_URL}${fallbackPath}`;
  if (isAbsolute(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `${SITE_URL}${value}`;
  return `${SITE_URL}/${value}`;
};

const routeToPageMap: Record<string, string> = {
  "": "home",
  home: "home",
  about: "about",
  "contact-us": "contact",
};

const blocked = new Set([
  "_next",
  "api",
  "login",
  "register",
  "reset-password",
  "email-verification",
  "myaccount",
  "u",
  "logout",
  "checkout",
  "cart",
  "wishlist",
  "payment",
  "thank-you",
]);

export const getSlugFromRoute = (
  pathname: string,
  query: Record<string, string | string[] | undefined> = {}
) => {
  if (!pathname || pathname === "/") return "home";

  const clean = pathname.replace(/^\/|\/$/g, "");
  const parts = clean.split("/").filter(Boolean);
  if (!parts.length) return "home";
  if (blocked.has(parts[0])) return null;

  if (parts[0] === "product" && pathname.includes("[slug]")) {
    const slugValue = query.slug;
    if (typeof slugValue === "string" && slugValue) return slugValue;
    if (Array.isArray(slugValue) && slugValue[0]) return slugValue[0];
    return null;
  }

  if (routeToPageMap[parts[0]]) {
    return routeToPageMap[parts[0]];
  }

  return parts[parts.length - 1];
};

export const resolvePathname = (
  pathname: string,
  query: Record<string, string | string[] | undefined> = {}
) => {
  if (!pathname) return "/";
  let resolved = pathname;
  const matches = pathname.match(/\[[^\]]+\]/g) || [];

  matches.forEach((segment) => {
    const key = segment.replace("[", "").replace("]", "").replace("...", "");
    const value = query[key];
    const replacement = Array.isArray(value) ? value[0] : value;
    if (replacement) {
      resolved = resolved.replace(segment, replacement);
    }
  });

  return resolved;
};

type SeoFields = {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
};

const getDefaultConfig = (slug?: string | null) => {
  if (!slug) return MetaContentConfig.default;
  return (
    (MetaContentConfig as Record<string, any>)[slug] ||
    MetaContentConfig.default
  );
};

export const buildDefaultSeo = (pathname: string, slug?: string | null): SeoFields => {
  const config = getDefaultConfig(slug);
  const canonicalPath = pathname && pathname.startsWith("/") ? pathname : "/";
  const canonicalUrl = toAbsoluteUrl(config.url || canonicalPath, canonicalPath);
  const ogImage = toAbsoluteUrl(
    config.image || MetaContentConfig.default.image,
    "/logo.png"
  );

  return {
    title: config.title || MetaContentConfig.default.title,
    description: config.description || MetaContentConfig.default.description,
    keywords: config.keywords || MetaContentConfig.default.keywords,
    canonicalUrl,
    ogTitle: config.title || MetaContentConfig.default.title,
    ogDescription: config.description || MetaContentConfig.default.description,
    ogImage,
    ogUrl: canonicalUrl,
    ogType: "website",
  };
};

export const normalizeSeoFromApi = (
  apiResponse: any,
  pathname: string,
  slug?: string | null
): SeoFields => {
  const fallback = buildDefaultSeo(pathname, slug);

  if (!apiResponse) return fallback;

  if (apiResponse.pageData) {
    const pageData = apiResponse.pageData;
    const seo = pageData.seo_metadata || {};
    const canonicalUrl = toAbsoluteUrl(
      seo.canonical_url || seo.og_url || fallback.canonicalUrl,
      pathname
    );
    const ogImage = toAbsoluteUrl(
      seo.og_image || pageData.primary_img || fallback.ogImage,
      "/logo.png"
    );

    return {
      title: seo.meta_title || pageData.title || fallback.title,
      description:
        seo.meta_description || pageData.description || fallback.description,
      keywords: seo.meta_keywords || pageData.keywords || fallback.keywords,
      canonicalUrl,
      ogTitle: seo.og_title || pageData.title || fallback.ogTitle,
      ogDescription:
        seo.og_description || pageData.description || fallback.ogDescription,
      ogImage,
      ogUrl: toAbsoluteUrl(seo.og_url || canonicalUrl, pathname),
      ogType: seo.og_type || "website",
    };
  }

  if (apiResponse.product_details) {
    const product = apiResponse.product_details;
    const seo = product.seo_metadata || {};
    const canonicalUrl = toAbsoluteUrl(
      seo.canonical_url || seo.og_url || fallback.canonicalUrl,
      pathname
    );
    const ogImage = toAbsoluteUrl(
      seo.og_image || product.primary_img || fallback.ogImage,
      "/logo.png"
    );

    return {
      title: seo.meta_title || product.prod_name || fallback.title,
      description:
        seo.meta_description || product.prod_desc || fallback.description,
      keywords: seo.meta_keywords || product.product_tag || fallback.keywords,
      canonicalUrl,
      ogTitle: seo.og_title || product.prod_name || fallback.ogTitle,
      ogDescription:
        seo.og_description || product.prod_desc || fallback.ogDescription,
      ogImage,
      ogUrl: toAbsoluteUrl(seo.og_url || canonicalUrl, pathname),
      ogType: seo.og_type || "product",
    };
  }

  return fallback;
};
