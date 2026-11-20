import type { GetServerSideProps } from "next";
import { STATIC_PUBLIC_ROUTES } from "@/utils/seoStaticRoutes";
import { BlogService } from "@/content/blog-service.server";
import { backendFetchJson } from "@/utils/backendFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.indianhairworld.com";
const WEB_TOKEN = process.env.NEXT_PUBLIC_WEB_TOKEN;

const STATIC_ROUTES = STATIC_PUBLIC_ROUTES;

const toArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>) as T[];
  }
  return [];
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

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

const extractCategoryList = (json: unknown) => {
  const payload = asRecord(json);
  const data = asRecord(payload.data);
  const source =
    payload.category_list ??
    payload.categories ??
    data.category_list ??
    data.categories ??
    [];
  return toArray<{ slug?: string; child_categories?: unknown; children?: unknown }>(source);
};

const extractProductList = (json: unknown) => {
  const payload = asRecord(json);
  const data = asRecord(payload.data);
  const source =
    payload.products ??
    payload.product_list ??
    data.products ??
    data.product_list ??
    [];
  return toArray<{ slug?: string }>(source);
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let categoryRoutes: string[] = [];
  let productRoutes: string[] = [];
  let categoryError = "";
  let productError = "";
  let categorySourceUsed = "";
  let productSourceUsed = "";
  let categoryPayloadKeys = "";
  let productPayloadKeys = "";

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

  // Same route to the backend as the blog list below. On the production host a
  // plain fetch() of our own public URL is refused by the CDN edge, and the old
  // connect.indianhairworld.com fallback is a stale backend copy whose database
  // login stopped working, so between them the sitemap lost every category and
  // product.
  try {
    const json = await backendFetchJson("/api/v1/categories?limit=10000", authHeaders);
    categoryPayloadKeys = Object.keys(json || {}).join(",");
    categoryRoutes = collectCategorySlugs(extractCategoryList(json));
    if (categoryRoutes.length > 0) categorySourceUsed = "backend";
  } catch (err: unknown) {
    categoryRoutes = [];
    categoryError = err instanceof Error ? err.message : "category-fetch-failed";
  }

  try {
    const json = await backendFetchJson("/api/v1/get_active_products?limit=10000", authHeaders);
    productPayloadKeys = Object.keys(json || {}).join(",");
    productRoutes = extractProductList(json)
      .map((product) => (product?.slug ? `/product/${product.slug}` : ""))
      .filter(Boolean);
    if (productRoutes.length > 0) productSourceUsed = "backend";
  } catch (err: unknown) {
    productRoutes = [];
    productError = err instanceof Error ? err.message : "product-fetch-failed";
  }

  // Published blog posts (BlogService logs and returns [] if the backend is unreachable).
  const blogs: Array<{ slug?: string }> = await BlogService.getAll();
  const blogRoutes = blogs.map((blog) => (blog?.slug ? `/blog/${blog.slug}` : "")).filter(Boolean);

  const allRoutes = [...new Set([...STATIC_ROUTES, ...categoryRoutes, ...productRoutes, ...blogRoutes])];
  const now = new Date().toISOString();
  const urls = allRoutes
    .map((route) => {
      const loc = xmlEscape(`${SITE_URL}${route}`);
      return `<url><loc>${loc}</loc><lastmod>${now}</lastmod><priority>0.8</priority></url>`;
    })
    .join("");

  const debugComment = `generated-by-next-ssr; categories=${categoryRoutes.length}; products=${productRoutes.length}; blogs=${blogRoutes.length}; categorySource=${categorySourceUsed || "none"}; productSource=${productSourceUsed || "none"}; categoryKeys=${categoryPayloadKeys || "none"}; productKeys=${productPayloadKeys || "none"}; categoryError=${categoryError || "none"}; productError=${productError || "none"}`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?><!-- ${debugComment} --><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
};

const Sitemap = () => null;
export default Sitemap;
