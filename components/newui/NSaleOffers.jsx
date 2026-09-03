import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import axios from "@/content/axios";
import { ENV } from "@/config/env";
import { FaFire, FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { useFestivalTheme } from "./FestivalThemeContext";

function pctOff(regular, sale) {
  const r = parseFloat(regular || 0);
  const s = parseFloat(sale || 0);
  return r > 0 && s > 0 && s < r ? Math.round(((r - s) / r) * 100) : 0;
}

// Products flagged `is_sale` in the product editor — same source the live
// homepage's Special Sale Offers uses.
export default function NSaleOffers() {
  const { theme } = useFestivalTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sw, setSw] = useState(null);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${ENV.API_URL}/api/v1/get_sale_products`)
      .then((res) => { if (!cancelled) setProducts(Array.isArray(res.data?.products) ? res.data.products : []); })
      .catch(() => { if (!cancelled) setProducts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (!loading && products.length === 0) return null;

  const bg =
    theme?.active && theme.saleSection?.bg
      ? theme.saleSection.bg
      : "var(--rb-cream)";

  return (
    <section className="py-8 md:py-12" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-3 mb-5 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <span className="inline-flex items-center gap-1 bg-[var(--rb-primary)] text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full flex-shrink-0">
              <FaFire className="w-3 h-3 text-[var(--rb-accent-light)]" /> SALE
            </span>
            <h2 className="text-lg md:text-3xl font-black text-[var(--rb-dark)] leading-tight truncate">
              Special <span className="text-[var(--rb-primary)]">Sale Offers</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => sw?.slidePrev()}
                aria-label="Scroll left"
                className="w-9 h-9 rounded-full border border-[var(--rb-cream-border)] bg-white text-gray-500 flex items-center justify-center hover:border-[var(--rb-primary)] hover:text-[var(--rb-primary)] transition-colors"
              >
                <FaArrowLeft className="w-3 h-3" />
              </button>
              <button
                onClick={() => sw?.slideNext()}
                aria-label="Scroll right"
                className="w-9 h-9 rounded-full border border-[var(--rb-cream-border)] bg-white text-gray-500 flex items-center justify-center hover:border-[var(--rb-primary)] hover:text-[var(--rb-primary)] transition-colors"
              >
                <FaArrowRight className="w-3 h-3" />
              </button>
            </div>
            <Link
              href="/shop?sale=1"
              className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-[var(--rb-primary)] whitespace-nowrap hover:gap-2 transition-all"
            >
              View All <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            onSwiper={setSw}
            modules={[Autoplay]}
            spaceBetween={12}
            slidesPerView={2.15}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 16 },
              768: { slidesPerView: 4, spaceBetween: 16 },
              1024: { slidesPerView: 5, spaceBetween: 16 },
            }}
          >
            {products.map((p) => {
              const disc = pctOff(p.regular_price, p.sale_price);
              return (
                <SwiperSlide key={p.id}>
                  <Link href={`/product/${p.slug}`} className="block group">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-[var(--rb-cream-border)]">
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                        {p.primary_img ? (
                          <img
                            src={p.primary_img}
                            alt={p.prod_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.currentTarget.src = "/images/noimage.jpg"; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[var(--rb-cream)]">
                            <span className="text-3xl font-black text-[var(--rb-cream-border)]">
                              {p.prod_name?.[0]?.toUpperCase() || "S"}
                            </span>
                          </div>
                        )}
                        {disc > 0 && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg">
                            -{disc}%
                          </span>
                        )}
                      </div>
                      <div className="p-2.5 md:p-3">
                        <p className="text-[11px] md:text-xs font-semibold text-gray-700 line-clamp-2 leading-tight mb-1.5">
                          {p.prod_name}
                        </p>
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-[13px] md:text-sm font-black text-[var(--rb-primary)]">
                            ₹{parseFloat(p.sale_price).toLocaleString("en-IN")}
                          </span>
                          {disc > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{parseFloat(p.regular_price).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </section>
  );
}
