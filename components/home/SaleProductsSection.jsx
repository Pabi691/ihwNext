import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link } from '@/components/compat/router';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import axios from 'axios';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://server.indianhairworld.com"}/api/v1`;

function discount(regular, sale) {
  const r = parseFloat(regular || 0);
  const s = parseFloat(sale || 0);
  if (r > 0 && s > 0 && s < r) return Math.round(((r - s) / r) * 100);
  return 0;
}

export default function SaleProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/get_sale_products`)
      .then((res) => setProducts(Array.isArray(res.data?.products) ? res.data.products : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
              🔥 SALE
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Special <span className="text-red-500">Sale Offers</span>
            </h2>
          </div>
          <Link
            href="/shop?sale=1"
            className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={2}
            navigation
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640:  { slidesPerView: 3 },
              768:  { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="sale-swiper"
          >
            {products.map((p) => {
              const disc = discount(p.regular_price, p.sale_price);
              return (
                <SwiperSlide key={p.id}>
                  <Link href={`/product/${p.slug}`} className="block group">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-orange-100 hover:border-red-200">
                      {/* Image */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                        {p.primary_img ? (
                          <img
                            src={p.primary_img}
                            alt={p.prod_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
                            <span className="text-3xl font-bold text-red-200">
                              {p.prod_name?.[0]?.toUpperCase() || "S"}
                            </span>
                          </div>
                        )}
                        {disc > 0 && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                            -{disc}%
                          </span>
                        )}
                        {p.is_returnable == 1 && (
                          <span className="absolute bottom-2 left-2 bg-white/90 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                            Returns OK
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <p className="text-xs font-semibold text-gray-700 line-clamp-2 leading-tight mb-2">
                          {p.prod_name}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-red-500">
                            ₹{parseFloat(p.sale_price).toLocaleString("en-IN")}
                          </span>
                          {disc > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{parseFloat(p.regular_price).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        {p.is_cod == 1 && (
                          <p className="text-xs text-blue-500 font-medium mt-1">COD Available</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>

      <style jsx>{`
        .sale-swiper .swiper-button-next,
        .sale-swiper .swiper-button-prev {
          color: #ef4444;
          background: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,.12);
        }
        .sale-swiper .swiper-button-next::after,
        .sale-swiper .swiper-button-prev::after {
          font-size: 14px;
          font-weight: 700;
        }
      `}</style>
    </section>
  );
}
