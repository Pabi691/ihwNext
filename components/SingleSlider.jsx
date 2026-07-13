import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from '@/components/compat/router';
import { ChevronLeft, ChevronRight, Scissors } from 'lucide-react';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useGlobal } from '../global/GlobalContext';
import WishlistButton from './WishlistButton';
import API_BASE_URL from '../global/apiConfig';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { cacheManager } from '../utils/cacheManager'; // ✅ Import cacheManager
import { themeBgColor } from '../styles/typography';
import { isTryOnEligible } from '../utils/tryOnEligibility';

const normalizeProductImageUrl = (url = '') => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('/product-images/')) return url;

  return url
    .replace(/-\?{2,}-/g, '-%E2%80%93-')
    .replace(/-%E2%80%94-/gi, '-%E2%80%93-')
    .replace(/-(?:\u2013|\u2014)-/gu, '-%E2%80%93-');
};

const normalizeProductName = (name = '') => {
  if (!name || typeof name !== 'string') return name;

  return name
    .replace(/\s\?{2,}\s/g, ' - ')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const SingleSlider = ({ slug_name, price_filter, title, discountPercentage, cat_slug_name }) => {
  const { token, publicToken, wishlist, setWishlist } = useGlobal();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBase = `${process.env.NEXT_PUBLIC_API_URL || "https://server.indianhairworld.com"}/api`;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ Check cached data
      const cachedProducts = cacheManager.get(`fp_${title}`);
      if (cachedProducts) {
        setProducts(cachedProducts);
        setLoading(false);
        return;
      }

      // ✅ Fetch from API if not cached
      // console.log('Slider token:', token);
      const endpoint = `${apiBase}/v1/${slug_name}`;
      const tokenCandidates = [token, publicToken].filter(
        (t, i, arr) => t && arr.indexOf(t) === i
      );

      let res = null;

      for (const candidate of tokenCandidates) {
        try {
          res = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${candidate}` },
          });
          break;
        } catch (err) {
          if (err?.response?.status !== 401 && err?.response?.status !== 403) {
            throw err;
          }
        }
      }

      if (!res) {
        try {
          res = await axios.get(endpoint);
        } catch (err) {
          throw err;
        }
      }

      let filteredProduct = res.data.products || [];

      // ✅ Filter by price
      if (price_filter) {
        filteredProduct = filteredProduct.filter(
          (product) => product.sale_price <= price_filter
        );
      }

      // ✅ Filter by discount percentage
      if (discountPercentage) {
        filteredProduct = filteredProduct.filter((product) => {
          const regularPrice = parseFloat(product.regular_price || 0);
          const salePrice = parseFloat(product.sale_price || 0);
          if (regularPrice > 0 && salePrice > 0) {
            const calculatedDiscount = ((regularPrice - salePrice) / regularPrice) * 100;
            return calculatedDiscount >= discountPercentage;
          }
          return false;
        });
      }

      // ✅ Store in cacheManager
      if (filteredProduct.length > 0) {
        cacheManager.set(`fp_${title}`, filteredProduct);
        setProducts(filteredProduct);
      }
    } catch (error) {
      console.error(`Error fetching products for ${slug_name}:`, error?.response?.data || error?.message || error);
    } finally {
      setLoading(false);
    }
  }, [slug_name, price_filter, discountPercentage, token, publicToken, title, apiBase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const compressImage = (originalUrl, width = 500) => {
    const imageKitBase = 'https://ik.imagekit.io/vaysvybyq/';
    return `${imageKitBase}tr:w-${width},q-70/${originalUrl}`;
  };

  const handleProductImageError = (event) => {
    const fallbackSrc = normalizeProductImageUrl(event.currentTarget.src);

    if (
      !fallbackSrc ||
      fallbackSrc === event.currentTarget.src ||
      event.currentTarget.dataset.fallbackApplied === 'true'
    ) {
      return;
    }

    event.currentTarget.dataset.fallbackApplied = 'true';
    event.currentTarget.src = fallbackSrc;
  };

  return (
    <section className="py-4 md:py-6 bg-white">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-gray-900">
          {title}
        </h2>
        {cat_slug_name && (
          <Link
            className="text-xs font-semibold text-[#04A9FF] hover:underline"
            to={`/${cat_slug_name}`}
          >
            Explore All →
          </Link>
        )}
      </div>

      <div className="relative">
      <Swiper
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        loop={false}
        breakpoints={{
          360: { slidesPerView: 2.1 },
          640: { slidesPerView: 3.2 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        spaceBetween={10}
        modules={[Navigation, Pagination, Autoplay]}
        className="mySwiper"
      >
        {loading && products.length === 0 ? (
          [...Array(4)].map((_, idx) => (
            <SwiperSlide key={`skeleton-${idx}`}>
              <Skeleton width={250} height={400} />
              <Skeleton width={250} height={100} />
            </SwiperSlide>
          ))
        ) : (
          products.map((product) => {
            const productName = normalizeProductName(product.prod_name);
            const regularPrice = parseFloat(product.regular_price || 0);
            const salePrice = parseFloat(product.sale_price || 0);
            const hasDiscount = regularPrice > salePrice && salePrice > 0;
            const discountPct = hasDiscount
              ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
              : 0;
            const tryOnEligible = isTryOnEligible({
              categories: product.product_categories,
              tag: product.product_tag,
              name: product.prod_name,
              description: product.prod_desc,
            });

            return (
            <SwiperSlide key={product.id}>
              <div className="bg-white overflow-hidden border border-gray-100 rounded-xl h-full flex flex-col">
                <Link to={`/product/${product.slug}`} className="relative block h-48 sm:h-56 md:h-60 bg-gray-50 shrink-0">
                  {product.product_tag && product.product_tag !== 'null' && (
                    <span className={`absolute z-10 top-2 left-2 ${themeBgColor} text-white text-[9px] font-semibold uppercase px-2 py-1 rounded-md`}>
                      {product.product_tag}
                    </span>
                  )}
                  {tryOnEligible && (
                    <span className="absolute z-10 top-2 right-2 bg-[#04A9FF] text-white text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Scissors size={10} strokeWidth={2.5} />
                      Try-On
                    </span>
                  )}
                  <img
                    src={product.primary_img}
                    alt={productName}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    onError={handleProductImageError}
                  />
                </Link>

                <div className="p-2.5 sm:p-3 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      {product.brand_details?.brand_name}
                    </h4>
                    <WishlistButton
                      product={product}
                      wishlist={wishlist}
                      setWishlist={setWishlist}
                      token={token}
                      API_BASE_URL={API_BASE_URL}
                    />
                  </div>
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-gray-500 text-xs truncate block mt-1"
                    title={productName}
                  >
                    {productName}
                  </Link>
                  <div className="flex items-baseline gap-1.5 flex-wrap mt-1.5">
                    <span className="text-gray-900 text-xs sm:text-sm font-bold">
                      ₹{salePrice.toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <span className="text-gray-400 text-[11px] line-through">
                        ₹{regularPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="text-green-600 font-semibold text-[10px]">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>
                  {(product.product_quality && product.product_quality !== 'null') && (
                    <div className="mt-2">
                      <span className="border px-2 py-0.5 bg-gray-400 text-white font-medium uppercase text-[9px] rounded-md">
                        {product.product_quality}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
            );
          })
        )}
      </Swiper>

      <button
        ref={prevRef}
        type="button"
        aria-label="Previous"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-700 hover:text-[#04A9FF] hover:border-[#04A9FF]/40 transition-colors [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:pointer-events-none"
      >
        <ChevronLeft size={16} strokeWidth={2.5} />
      </button>
      <button
        ref={nextRef}
        type="button"
        aria-label="Next"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-700 hover:text-[#04A9FF] hover:border-[#04A9FF]/40 transition-colors [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:pointer-events-none"
      >
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
      </div>
    </div>
    </section>
  );
};

export default SingleSlider;


