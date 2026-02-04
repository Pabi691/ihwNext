import React, { useState, useEffect, useCallback } from "react";
import { Link } from "@/components/compat/router";
import Skeleton from "react-loading-skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import compressImage from "../../utils/compressImage";
import { cacheManager } from "../../utils/cacheManager";
import { CategoryService } from "../../content/category-service";
import { strokedHeading } from "../../styles/typography";

function ProductCategory({ title }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const maxSlidesPerView = 4;

  const fetchProductCategory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const cached = cacheManager.get("categories");
      if (cached) {
        setCategories(cached);
        return;
      }

      const response = await CategoryService.getAll();
      if (response.status === 200 && response.data?.category_list) {
        const list = Array.isArray(response.data.category_list)
          ? response.data.category_list
          : [response.data.category_list];

        setCategories(list);
        cacheManager.set("categories", list);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductCategory();
  }, [fetchProductCategory]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className={strokedHeading}>{title}</h2>

        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Swiper */}
        <Swiper
          loop={!loading && categories.length >= maxSlidesPerView}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          spaceBetween={24}
          modules={[Autoplay]}
          breakpoints={{
            360: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <SwiperSlide key={i}>
                <Skeleton height={380} />
              </SwiperSlide>
            ))}

          {!loading &&
            categories.map((cat) => (
              <SwiperSlide key={cat.id}>
                <Link
                  to={`/${cat.slug}`}
                  className="group relative block h-[380px] overflow-hidden rounded-lg shadow-lg"
                >
                  {/* Image */}
                  <img
                    src={compressImage(cat.cat_img, 600, 75, "webp")}
                    alt={cat.category_name}
                    loading="lazy"
                    className="
                      w-full h-full object-cover
                      transition-transform duration-700 ease-out
                      group-hover:scale-[1.3]
                    "
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-end justify-center">
                    <h3 className="mb-6 text-lg font-bold uppercase tracking-wide bg-white/90 px-4 py-2 rounded text-gray-800">
                      {cat.category_name}
                    </h3>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
}

export default ProductCategory;

