
const fs = require('fs');
const mockApiResponse = {
    product_details: {
        prod_name: "0.3 MM Hair Patch Black",
        prod_desc: "The 0.3 MM Hair Patch is meticulously crafted.",
        seo_metadata: {
            id: 13,
            meta_title: null,
            meta_description: null,
            meta_keywords: null,
            og_title: null,
            og_description: null,
            og_image: null,
            canonical_url: null,
            og_url: null,
            og_type: null
        }
    }
};

const stripHtmlAndTruncate = (htmlString, maxLength = 160) => {
    if (!htmlString) return "";
    const plainText = htmlString.replace(/<[^>]+>/g, "").trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + "...";
};

const normalizeSeoFromApi = (apiResponse, pathname, slug) => {
    if (apiResponse.product_details) {
        const product = apiResponse.product_details;
        const seo = product.seo_metadata || {};
        // Simulating the actual behavior in seo.ts

        return {
            title: seo.meta_title || product.prod_name || "",
            description: seo.meta_description || stripHtmlAndTruncate(product.prod_desc),
            keywords: seo.meta_keywords || product.product_tag || "",
            canonicalUrl: seo.canonical_url || seo.og_url || "",
            ogTitle: seo.og_title || product.prod_name || "",
            ogDescription: seo.og_description || stripHtmlAndTruncate(product.prod_desc),
            ogImage: seo.og_image || product.primary_img || "",
            ogUrl: seo.og_url || seo.canonical_url || "",
            ogType: seo.og_type || "",
        };
    }
};

console.log(normalizeSeoFromApi(mockApiResponse, '/product/03-mm-hair-patch-black', '03-mm-hair-patch-black'));
