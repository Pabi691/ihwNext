export const normalizeSeo = (apiResponse) => {
  if (!apiResponse) return null;

  // PAGE
  if (apiResponse.pageData) {
    const seo = apiResponse.pageData.seo_metadata || {};
    // console.log("Normalizing SEO:", seo);
    return {
      meta_title: seo.meta_title || apiResponse.pageData.title,
      canonical_url: seo.canonical_url || window.location.href,
      meta_description: seo.meta_description || apiResponse.pageData.description || "",
      meta_keywords: seo.meta_keywords || apiResponse.pageData.keywords || "",
      og_title: seo.og_title || apiResponse.pageData.title,
      og_description: seo.og_description || apiResponse.pageData.description,
      og_image: seo.og_image || "",
      og_url: seo.og_url || window.location.href,
      og_type: seo.og_type || "website",
      head_content: seo.content || "",
    };
  }

  // PRODUCT
  if (apiResponse.product_details) {
    const product = apiResponse.product_details;
    const seo = product.seo_metadata || {};

    return {
      meta_title: seo.meta_title || product.prod_name,
      canonical_url: seo.canonical_url || window.location.href,
      meta_description: seo.meta_description || product.prod_desc,
      meta_keywords: seo.meta_keywords || product.product_tag,
      og_title: seo.og_title || product.prod_name,
      og_description: seo.og_description || product.prod_desc,
      og_image: seo.og_image || product.primary_img,
      og_url: seo.og_url || window.location.href,
      og_type: seo.og_type || "product",
      head_content: product.prod_desc || "",
    };
  }

  return null;
};
