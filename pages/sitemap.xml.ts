import type { GetServerSideProps } from "next";

const sanitizeApiUrl = (value?: string) => {
  const normalized = (value || "").trim();
  if (!normalized || normalized === "undefined" || normalized === "null") {
    return "https://server.indianhairworld.com";
  }
  return normalized.replace(/\/+$/, "");
};

const API_BASE_URL = sanitizeApiUrl(process.env.NEXT_PUBLIC_API_URL);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.indianhairworld.com";
const WEB_TOKEN = process.env.NEXT_PUBLIC_WEB_TOKEN;

const STATIC_ROUTES = [
  "/",
  "/men",
  "/women",
  "/shop",
  "/about",
  "/services",
  "/celebrity",
  "/our-gallery",
  "/branch/kolkata",
  "/branch/salt-lake",
  "/branch/durgapur",
  "/branch/siliguri",
  "/terms-conditions",
  "/privacy-policy",
  "/return-exchange-policy",
  "/shipping-and-delivery",
  "/contact-us",
];

const toArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>) as T[];
  }
  return [];
};

const xmlEscape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const authHeaders: Record<string, string> = WEB_TOKEN
  ? { Authorization: `Bearer ${WEB_TOKEN}` }
  : {};

const fetchJsonWithAuthFallback = async (url: string) => {
  const baseHeaders: Record<string, string> = {
    Accept: "application/json",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  };

  const parseJsonSafe = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  let res = await fetch(url, { headers: { ...baseHeaders, ...authHeaders } });
  if (!res.ok && WEB_TOKEN) {
    res = await fetch(url, { headers: baseHeaders });
  }
  if (!res.ok) return null;
  return parseJsonSafe(res);
};

const fetchCategories = async () => {
  const json = await fetchJsonWithAuthFallback(`${API_BASE_URL}/api/v1/categories`);
  if (!json) return [];
  const source =
    json?.category_list ??
    json?.categories ??
    json?.data?.category_list ??
    json?.data?.categories ??
    [];
  return toArray<{ slug?: string; child_categories?: unknown; children?: unknown }>(source);
};

const fetchProducts = async () => {
  const json = await fetchJsonWithAuthFallback(`${API_BASE_URL}/api/v1/get_active_products`);
  if (!json) return [];
  const source =
    json?.products ??
    json?.product_list ??
    json?.data?.products ??
    json?.data?.product_list ??
    [];
  return toArray<{ slug?: string }>(source);
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let categoryRoutes: string[] = [];
  let productRoutes: string[] = [];

  const collectCategorySlugs = (nodes: unknown): string[] => {
    const list = toArray<{ slug?: string; child_categories?: unknown; children?: unknown }>(nodes);
    const routes: string[] = [];

    for (const node of list) {
      if (node?.slug) {
        routes.push(`/${node.slug}`);
      }
      const nested = node?.child_categories ?? node?.children;
      if (nested) routes.push(...collectCategorySlugs(nested));
    }

    return routes;
  };

  try {
    const [categories, products] = await Promise.all([fetchCategories(), fetchProducts()]);

    categoryRoutes = collectCategorySlugs(categories);

    productRoutes = products
      .map((product) => (product?.slug ? `/product/${product.slug}` : ""))
      .filter(Boolean);
  } catch {
    categoryRoutes = [];
    productRoutes = [];
  }

  const allRoutes = [...new Set([...STATIC_ROUTES, ...categoryRoutes, ...productRoutes])];
  const now = new Date().toISOString();
  const urls = allRoutes
    .map((route) => {
      const loc = xmlEscape(`${SITE_URL}${route}`);
      return `<url><loc>${loc}</loc><lastmod>${now}</lastmod><priority>0.8</priority></url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><!-- generated-by-next-ssr --><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
};

const Sitemap = () => null;
export default Sitemap;
