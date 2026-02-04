const fs = require('fs');
const axios = require('axios');
const webToken = process.env.NEXT_PUBLIC_WEB_TOKEN || process.env.REACT_APP_WEB_TOKEN;

const API_URL = "https://server.indianhairworld.com/api/v1/get_data_for_dashboard";
const BASE_URL = "https://www.indianhairworld.com";

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

const fetchDashboardData = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Authorization": webToken ? `Bearer ${webToken}` : undefined
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {};
  }
};

const generateSitemap = async () => {
  const data = await fetchDashboardData();

  let categoryRoutes = [];
  let productRoutes = [];

  for (const key in data) {
    const item = data[key];
    if (item?.category_data) {
      // Category slug
      const categorySlug = item.category_data.slug;
      if (categorySlug) {
        categoryRoutes.push(`/${categorySlug}`);
      }

      // Products inside category
      const products = item.products || [];
      products.forEach(product => {
        if (product.slug) {
          productRoutes.push(`/product/${product.slug}`);
        }
      });
    }
  }

  // Build all routes
  const allRoutes = [...new Set([...staticRoutes, ...categoryRoutes, ...productRoutes])]; // Unique

  const sitemapUrls = allRoutes.map(route => {
    const cleanedRoute = route.replace(/:orderId/g, "1234"); // replace dynamic params with sample ID
    return `
    <url>
      <loc>${BASE_URL}${cleanedRoute}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
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
