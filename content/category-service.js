import axios from "axios";
import { ENV } from "../config/env";

const CURATED_FALLBACK_CATEGORIES = [
  {
    id: "men-products",
    slug: "men-products",
    category_name: "Men's Hair Products",
    cat_img: "/images/shop-men.png",
    short_description: "Hair patches, systems, and everyday wear solutions.",
  },
  {
    id: "women-products",
    slug: "women-products",
    category_name: "Women's Hair Products",
    cat_img: "/images/shop-women.png",
    short_description: "Extensions, toppers, and premium styling options.",
  },
  {
    id: "men",
    slug: "men",
    category_name: "Hair Patch Solutions",
    cat_img: "/images/hair-patches.jpg",
    short_description: "Natural-looking fixes designed for confidence and comfort.",
  },
  {
    id: "women",
    slug: "women",
    category_name: "Hair Extensions",
    cat_img: "/images/extensionwomen.jpg",
    short_description: "Length, volume, and texture in salon-ready collections.",
  },
];

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
};

const normalizeCategory = (item, index = 0) => ({
  ...item,
  id: item?.id ?? item?.slug ?? `category-${index}`,
  slug: item?.slug ?? "",
  category_name: item?.category_name ?? item?.name ?? "Collection",
  cat_img:
    item?.cat_img ??
    item?.image ??
    item?.banner_img ??
    CURATED_FALLBACK_CATEGORIES[index % CURATED_FALLBACK_CATEGORIES.length]?.cat_img ??
    "/images/noimage.jpg",
  short_description:
    item?.short_description ??
    item?.description ??
    item?.meta_description ??
    "",
});

const dedupeBySlug = (items) => {
  const seen = new Set();

  return items.filter((item) => {
    const key = item?.slug || item?.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const extractCategoryList = (payload) => {
  const list =
    payload?.category_list ??
    payload?.categories ??
    payload?.data?.category_list ??
    payload?.data?.categories ??
    [];

  return dedupeBySlug(toArray(list).map(normalizeCategory)).filter(
    (item) => item.slug
  );
};

const extractChildCategoryList = (payload) => {
  const list =
    payload?.category_data?.child_categories ??
    payload?.category_data?.children ??
    payload?.data?.category_data?.child_categories ??
    payload?.data?.category_data?.children ??
    [];

  return dedupeBySlug(toArray(list).map(normalizeCategory)).filter(
    (item) => item.slug
  );
};

const getRequestAttempts = () => {
  const isBrowser = typeof window !== "undefined";
  const userToken = isBrowser ? localStorage.getItem("userToken") : null;

  return [
    userToken ? { Authorization: `Bearer ${userToken}` } : null,
    ENV.WEB_TOKEN ? { Authorization: `Bearer ${ENV.WEB_TOKEN}` } : null,
    {},
  ].filter(Boolean);
};

const tryEndpoint = async (endpoint, extractor) => {
  const attempts = getRequestAttempts();
  let lastError = null;

  for (const headers of attempts) {
    try {
      const response = await axios.get(endpoint, {
        headers,
        timeout: 7000,
      });
      const list = extractor(response.data);

      if (response.status === 200 && list.length > 0) {
        return list;
      }
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      if (status !== 401 && status !== 403) {
        continue;
      }
    }
  }

  if (lastError) {
    console.warn(`CategoryService fallback used for ${endpoint}`, lastError);
  }

  return [];
};

export const CategoryService = {
  async getAll() {
    const primaryEndpoint = `${ENV.API_URL}/api/v1/categories`;
    const primaryList = await tryEndpoint(primaryEndpoint, extractCategoryList);

    if (primaryList.length > 0) {
      return {
        status: 200,
        data: { status: true, category_list: primaryList },
      };
    }

    const fallbackSlugs = ["men-products", "women-products"];
    const fallbackLists = await Promise.all(
      fallbackSlugs.map((slug) =>
        tryEndpoint(
          `${ENV.API_URL}/api/v1/get_slug_data/${slug}`,
          extractChildCategoryList
        )
      )
    );

    const mergedFallback = dedupeBySlug(fallbackLists.flat()).slice(0, 6);

    if (mergedFallback.length > 0) {
      return {
        status: 200,
        data: { status: true, category_list: mergedFallback },
      };
    }

    return {
      status: 200,
      data: { status: true, category_list: CURATED_FALLBACK_CATEGORIES },
    };
  },
};
