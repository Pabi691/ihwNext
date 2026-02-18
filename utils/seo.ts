const SITE_URL = "https://www.indianhairworld.com";

const isAbsolute = (value: string) => /^https?:\/\//i.test(value);

export const toAbsoluteUrl = (value?: string | null, fallbackPath = "/") => {
  if (!value) return `${SITE_URL}${fallbackPath}`;
  if (isAbsolute(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `${SITE_URL}${value}`;
  return `${SITE_URL}/${value}`;
};

export const toAbsoluteUrlIfPresent = (value?: string | null) => {
  if (!value) return "";
  return toAbsoluteUrl(value);
};

const routeToPageMap: Record<string, string> = {
  "": "home",
  home: "home",
  about: "about",
  "contact-us": "contact-us",
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

export const buildDefaultSeo = (): SeoFields => {
  return {
    title: "",
    description: "",
    keywords: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogUrl: "",
    ogType: "",
  };
};

export const normalizeSeoFromApi = (
  apiResponse: any,
  pathname: string,
  slug?: string | null
): SeoFields => {
  const empty = buildDefaultSeo();

  if (!apiResponse) return empty;
  console.log(`[SEO-API] Normalizing SEO for path: ${pathname}, slug: ${slug || "N/A"}`);
  console.log(`[SEO-API] API Response keys: ${Object.keys(apiResponse).join(", ")}`);
  console.log(`[SEO-API] API Response pageData: ${apiResponse.pageData ? "present" : "absent"}, product_details: ${apiResponse.product_details ? "present" : "absent"}`);
  console.log(`[SEO-API] API Response pageData.seo_metadata: ${apiResponse.pageData?.seo_metadata ? "present" : "absent"}, product_details.seo_metadata: ${apiResponse.product_details?.seo_metadata ? "present" : "absent"}`);

  if (apiResponse.pageData) {
    const pageData = apiResponse.pageData;
    const seo = pageData.seo_metadata || {};
    const canonicalUrl = toAbsoluteUrlIfPresent(
      seo.canonical_url || seo.og_url
    );
    const ogImage = toAbsoluteUrlIfPresent(
      seo.og_image || pageData.primary_img
    );

    return {
      title: seo.meta_title || pageData.title || "",
      description:
        seo.meta_description || pageData.description || "",
      keywords: seo.meta_keywords || pageData.keywords || "",
      canonicalUrl,
      ogTitle: seo.og_title || pageData.title || "",
      ogDescription:
        seo.og_description || pageData.description || "",
      ogImage,
      ogUrl: toAbsoluteUrlIfPresent(seo.og_url || canonicalUrl),
      ogType: seo.og_type || "",
    };
  }

  if (apiResponse.category_data) {
    const category = apiResponse.category_data;
    const seo = category.seo_metadata || {};
    const canonicalUrl = toAbsoluteUrlIfPresent(
      seo.canonical_url || seo.og_url || `/${category.slug || slug || ""}`
    );
    const ogImage = toAbsoluteUrlIfPresent(
      seo.og_image || category.cat_banner || category.cat_img
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
    };
  }

  if (apiResponse.product_details) {
    const product = apiResponse.product_details;
    const seo = product.seo_metadata || {};
    const canonicalUrl = toAbsoluteUrlIfPresent(
      seo.canonical_url || seo.og_url
    );
    const ogImage = toAbsoluteUrlIfPresent(
      seo.og_image || product.primary_img
    );

    return {
      title: seo.meta_title || product.prod_name || "",
      description:
        seo.meta_description || product.prod_desc || "",
      keywords: seo.meta_keywords || product.product_tag || "",
      canonicalUrl,
      ogTitle: seo.og_title || product.prod_name || "",
      ogDescription:
        seo.og_description || product.prod_desc || "",
      ogImage,
      ogUrl: toAbsoluteUrlIfPresent(seo.og_url || canonicalUrl),
      ogType: seo.og_type || "",
    };
  }

  return empty;
};
