import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { CategoryService } from "@/content/category-service";
import { FaArrowRight } from "react-icons/fa6";

const SKELETON = Array.from({ length: 6 });

export default function NCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const res = await CategoryService.getAll();
      const list = (res?.data?.category_list || []).slice(0, 6);
      setCategories(list);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="text-[var(--rb-heading)] text-xs font-bold uppercase tracking-widest">Collections</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-1">
              Shop From <span className="text-[var(--rb-heading)]">Our Collection</span>
            </h2>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-[var(--rb-heading)] font-bold text-sm hover:gap-3 transition-all">
            Browse All <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid — first item spans 2 rows on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
          {loading
            ? SKELETON.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-3xl bg-gray-100 animate-pulse ${i === 0 ? "md:row-span-2 md:h-auto" : ""}`}
                />
              ))
            : categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/${cat.slug}`}
                  className={`group relative rounded-3xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ${
                    i === 0 ? "md:row-span-2 md:h-auto" : ""
                  }`}
                >
                  <img
                    src={cat.cat_img}
                    alt={cat.category_name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={e => { e.currentTarget.src = "/images/noimage.jpg"; }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
                    <div>
                      <h3 className="text-white font-bold text-sm md:text-base leading-tight uppercase tracking-wide">
                        {cat.category_name}
                      </h3>
                      {cat.short_description && (
                        <p className="text-white/70 text-xs mt-0.5 line-clamp-1 hidden md:block">
                          {cat.short_description}
                        </p>
                      )}
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-[var(--rb-primary)] group-hover:border-[var(--rb-primary)] transition-all duration-300">
                      <FaArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
