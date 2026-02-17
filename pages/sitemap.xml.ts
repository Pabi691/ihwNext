import type { GetServerSideProps } from "next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://server.indianhairworld.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.indianhairworld.com";
const WEB_TOKEN = process.env.NEXT_PUBLIC_WEB_TOKEN || "";

const STATIC_ROUTES = [
  "/",
  "/shop",
  "/about",
  "/services",
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

const fetchCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/api/v1/categories`, { headers: authHeaders });
  if (!res.ok) return [];
  const json = await res.json();
  return toArray<{ slug?: string; child_categories?: unknown }>(json?.category_list);
};

const fetchProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/api/v1/get_active_products`, { headers: authHeaders });
  if (!res.ok) return [];
  const json = await res.json();
  return toArray<{ slug?: string }>(json?.products ?? json?.product_list);
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let categoryRoutes: string[] = [];
  let productRoutes: string[] = [];

  try {
    const [categories, products] = await Promise.all([fetchCategories(), fetchProducts()]);

    categoryRoutes = categories.flatMap((cat) => {
      const routes: string[] = [];
      if (cat?.slug) routes.push(`/${cat.slug}`);
      const childCategories = toArray<{ slug?: string }>(cat?.child_categories);
      childCategories.forEach((child) => {
        if (child?.slug) routes.push(`/${child.slug}`);
      });
      return routes;
    });

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

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
};

const Sitemap = () => null;
export default Sitemap;
