import React, { useState, useEffect, useCallback } from "react";
import { Link } from "@/components/compat/router";
import Skeleton from "react-loading-skeleton";
import { cacheManager } from "../../utils/cacheManager";
import { CategoryService } from "../../content/category-service";

const normalizeCategory = (item, index = 0) => ({
  ...item,
  id: item?.id ?? item?.slug ?? `category-${index}`,
  slug: item?.slug ?? "",
  category_name: item?.category_name ?? item?.name ?? "Collection",
  cat_img: item?.cat_img ?? item?.image ?? "/images/noimage.jpg",
});

function ProductCategory({ title }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductCategory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = cacheManager.get("home-collection-categories");
      if (cached?.length) {
        setCategories(cached);
        setLoading(false);
        return;
      }
      const response = await CategoryService.getAll();
      const list = Array.isArray(response?.data?.category_list)
        ? response.data.category_list
        : [];
      const normalized = list
        .map(normalizeCategory)
        .filter((item) => item.slug)
        .slice(0, 6);
      if (normalized.length > 0) {
        setCategories(normalized);
        cacheManager.set("home-collection-categories", normalized);
      } else {
        throw new Error("No categories available");
      }
    } catch (err) {
      setError("Collection preview is unavailable right now.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductCategory();
  }, [fetchProductCategory]);

  const handleImageError = (e) => {
    if (e.currentTarget.dataset.fallbackApplied === "true") return;
    e.currentTarget.dataset.fallbackApplied = "true";
    e.currentTarget.src = "/images/noimage.jpg";
  };

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--site-heading)] mb-3">
            Our Collections
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-gray-900">
            {title}
          </h2>
        </div>

        {error && !loading && categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base text-gray-500">{error}</p>
            <button
              onClick={fetchProductCategory}
              className="mt-4 px-6 py-2 text-sm font-semibold border border-gray-300 rounded-full hover:bg-gray-100 transition"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl aspect-[3/4]">
                    <Skeleton height="100%" className="!h-full" />
                  </div>
                ))
              : categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/${cat.slug}`}
                    className="group relative block overflow-hidden rounded-2xl aspect-[3/4] bg-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <img
                      src={cat.cat_img}
                      alt={cat.category_name}
                      loading="lazy"
                      onError={handleImageError}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Label */}
                    <div className="absolute bottom-0 inset-x-0 p-4">
                      <h3 className="text-white font-bold text-sm md:text-base uppercase tracking-wide leading-tight">
                        {cat.category_name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-white/80 text-xs mt-1 font-medium group-hover:gap-2 transition-all duration-200">
                        Shop now <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductCategory;
