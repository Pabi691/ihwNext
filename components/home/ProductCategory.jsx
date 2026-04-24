import React, { useState, useEffect, useCallback } from "react";
import { Link } from "@/components/compat/router";
import Skeleton from "react-loading-skeleton";

import { cacheManager } from "../../utils/cacheManager";
import { CategoryService } from "../../content/category-service";

const CARD_ACCENTS = [
  "from-[#081f5c]/72 via-[#123a9c]/32 to-transparent",
  "from-[#3b0d11]/72 via-[#8c1c13]/30 to-transparent",
  "from-[#14281d]/72 via-[#355834]/32 to-transparent",
  "from-[#2b2d42]/70 via-[#6c757d]/28 to-transparent",
  "from-[#402218]/70 via-[#865439]/28 to-transparent",
  "from-[#1f2937]/72 via-[#0f766e]/30 to-transparent",
];

const CARD_LAYOUTS = [
  "min-h-[420px] md:min-h-0 md:col-span-7 md:row-span-2",
  "min-h-[280px] md:min-h-0 md:col-span-5 md:row-span-1",
  "min-h-[280px] md:min-h-0 md:col-span-5 md:row-span-1",
  "min-h-[240px] md:min-h-0 md:col-span-4 md:row-span-1",
  "min-h-[240px] md:min-h-0 md:col-span-4 md:row-span-1",
  "min-h-[240px] md:min-h-0 md:col-span-4 md:row-span-1",
];

const normalizeCategory = (item, index = 0) => ({
  ...item,
  id: item?.id ?? item?.slug ?? `category-${index}`,
  slug: item?.slug ?? "",
  category_name: item?.category_name ?? item?.name ?? "Collection",
  cat_img: item?.cat_img ?? item?.image ?? "/images/noimage.jpg",
  short_description:
    item?.short_description ??
    item?.description ??
    "Explore premium hair solutions curated for style, comfort, and confidence.",
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
      console.error(err);
      setError("Collection preview is unavailable right now.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductCategory();
  }, [fetchProductCategory]);

  const handleImageError = (event) => {
    if (event.currentTarget.dataset.fallbackApplied === "true") return;
    event.currentTarget.dataset.fallbackApplied = "true";
    event.currentTarget.src = "/images/noimage.jpg";
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(17,24,39,0.08),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(220,38,38,0.12),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)]" />
      <div className="absolute left-[-80px] top-16 h-40 w-40 rounded-full bg-[#0f766e]/10 blur-3xl" />
      <div className="absolute bottom-10 right-[-60px] h-48 w-48 rounded-full bg-[#1d4ed8]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-[#0f172a]/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#475569] shadow-sm backdrop-blur">
              Curated Collections
            </span>
            <div className="mt-4 text-3xl font-black uppercase tracking-tight text-[#0f172a] md:text-5xl">
              {title}
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#475569] md:text-base">
              Discover signature categories with a cleaner, editorial-style layout
              built for quicker browsing and a more premium first impression.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchProductCategory}
            className="inline-flex w-fit items-center rounded-full border border-[#0f172a]/10 bg-white px-4 py-2 text-sm font-semibold text-[#0f172a] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Refresh Collection
          </button>
        </div>

        {error && !loading && categories.length === 0 ? (
          <div className="rounded-[28px] border border-red-100 bg-white/90 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-base font-semibold text-[#0f172a]">
              {error}
            </p>
            <p className="mt-2 text-sm text-[#64748b]">
              Please try again in a moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:auto-rows-[220px] md:gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`collection-skeleton-${index}`}
                    className={`overflow-hidden rounded-[28px] ${CARD_LAYOUTS[index] || "min-h-[240px] md:min-h-0 md:col-span-4 md:row-span-1"}`}
                  >
                    <Skeleton height="100%" className="!h-full min-h-[220px]" />
                  </div>
                ))
              : categories.map((cat, index) => (
                  (() => {
                    const isFeatured = index === 0;
                    const contentPanelClass = isFeatured
                      ? "min-h-[188px] md:min-h-[228px] md:max-w-[78%]"
                      : "min-h-[132px] md:min-h-[150px] md:max-w-[88%]";
                    const titleClass = isFeatured
                      ? "text-3xl md:text-5xl"
                      : "text-[1.9rem] md:text-[2.2rem]";
                    const descriptionClass = isFeatured
                      ? "mt-3 line-clamp-2 max-w-md text-sm leading-6 text-white/90"
                      : "mt-2 line-clamp-1 max-w-md text-xs leading-5 text-white/85";

                    return (
                  <Link
                    key={cat.id}
                    to={`/${cat.slug}`}
                    className={`group relative isolate block h-full overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_34px_100px_rgba(15,23,42,0.2)] ${CARD_LAYOUTS[index] || "min-h-[240px] md:min-h-0 md:col-span-4 md:row-span-1"}`}
                  >
                    <img
                      src={cat.cat_img}
                      alt={cat.category_name}
                      loading="lazy"
                      onError={handleImageError}
                      className="absolute inset-0 h-full w-full object-cover brightness-[1.04] contrast-[1.06] transition duration-700 group-hover:scale-[1.08] group-hover:rotate-[0.5deg]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55 transition duration-500 group-hover:from-black/5 group-hover:to-black/60" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${CARD_ACCENTS[index % CARD_ACCENTS.length]} opacity-75 transition duration-500 group-hover:opacity-90`} />
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/12 to-transparent transition duration-500 group-hover:opacity-70" />
                    <div className="absolute inset-y-0 left-[-35%] w-[34%] rotate-12 bg-white/8 blur-2xl transition duration-700 group-hover:left-[110%]" />

                    <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
                      <div className="flex items-start justify-between gap-3 transition duration-500 group-hover:-translate-y-1">
                        <span className="inline-flex w-fit rounded-full border border-white/30 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.26em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md">
                          {index === 0 ? "Featured" : "Collection"}
                        </span>
                        <span className="rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md">
                          Explore
                        </span>
                      </div>

                      <div className={`flex max-w-md flex-col rounded-[24px] border border-white/15 bg-black/20 p-4 backdrop-blur-sm transition duration-500 group-hover:border-white/25 group-hover:bg-black/28 group-hover:-translate-y-1 md:p-5 ${contentPanelClass}`}>
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                          Indian Hair World
                        </p>
                        <h3 className={`${titleClass} max-w-md font-black uppercase leading-[0.98] tracking-tight text-white`}>
                          {cat.category_name}
                        </h3>
                        <p className={descriptionClass}>
                          {cat.short_description}
                        </p>
                        <div className="mt-auto inline-flex items-center gap-2 border-t border-white/10 pt-4 text-sm font-semibold text-white">
                          <span>Shop now</span>
                          <span className="transition duration-300 group-hover:translate-x-2">
                            {"->"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                    );
                  })()
                ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductCategory;
