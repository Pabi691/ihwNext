const fs = require('fs');
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });
const webToken = process.env.NEXT_PUBLIC_WEB_TOKEN || process.env.REACT_APP_WEB_TOKEN;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://server.indianhairworld.com";
const CATEGORIES_URL = `${API_BASE_URL}/api/v1/categories`;
const PRODUCTS_URL = `${API_BASE_URL}/api/v1/get_active_products`;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.indianhairworld.com";

const staticRoutes = [
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

const getRequestConfig = () => ({
  headers: {
    "Authorization": webToken ? `Bearer ${webToken}` : undefined
  }
});

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value).filter(Boolean);
  return [];
};

const fetchCategories = async () => {
  try {
    const response = await axios.get(CATEGORIES_URL, getRequestConfig());
    const listRaw =
      response.data?.category_list ??
      response.data?.categories ??
      response.data?.data?.category_list ??
      response.data?.data?.categories ??
      [];
    return toArray(listRaw);
  } catch (error) {
    console.error('Error fetching categories:', error?.message || error);
    return [];
  }
};

const fetchProducts = async () => {
  try {
    const response = await axios.get(PRODUCTS_URL, getRequestConfig());
    const listRaw = response.data?.products ?? response.data?.product_list ?? [];
    return toArray(listRaw);
  } catch (error) {
    console.error('Error fetching products:', error?.message || error);
    return [];
  }
};

const xmlEscape = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const generateSitemap = async () => {
  const categories = await fetchCategories();
  const products = await fetchProducts();

  const categoryRoutes = [];
  const productRoutes = [];

  const collectCategoryRoutes = (nodes) => {
    toArray(nodes).forEach((cat) => {
      if (cat?.slug) categoryRoutes.push(`/${cat.slug}`);
      const nested = cat?.child_categories ?? cat?.children;
      if (nested) collectCategoryRoutes(nested);
    });
  };
  collectCategoryRoutes(categories);

  products.forEach((product) => {
    if (product?.slug) {
      productRoutes.push(`/product/${product.slug}`);
    }
  });

  // Build all routes
  const allRoutes = [...new Set([...staticRoutes, ...categoryRoutes, ...productRoutes])]; // Unique
  const now = new Date().toISOString();

  const sitemapUrls = allRoutes.map(route => {
    const cleanedRoute = route.replace(/:orderId/g, "1234");
    return `
    <url>
      <loc>${xmlEscape(`${BASE_URL}${cleanedRoute}`)}</loc>
      <lastmod>${now}</lastmod>
      <priority>0.8</priority>
    </url>`;
  }).join("\n");

  const xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', xmlSitemap, 'utf8');
  console.log('Sitemap generated successfully!');
};

generateSitemap();
