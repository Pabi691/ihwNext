import React, { useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from '@/components/compat/router';
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

      <Swiper
        navigation
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

            return (
            <SwiperSlide key={product.id}>
              <div className="bg-white overflow-hidden relative md:h-[330px] h-[300px] border-none md:border rounded-sm">
                {product.product_tag && product.product_tag !== 'null' && (
                  <span className={`absolute z-10 ${themeBgColor} text-white top-0 left-0 text-[8px] sm:text-[10px] p-1 rotate-text`}>
                    {product.product_tag}
                  </span>
                )}

                <Link to={`/product/${product.slug}`}>
                  <img
                    // src={compressImage(product.primary_img, 300)}
                    src={product.primary_img}
                    alt={productName}
                    className="w-full rounded-xl absolute top-0 left-0"
                    loading="lazy"
                    onError={handleProductImageError}
                  />
                </Link>

                <div className="p-1 md:p-4 absolute bottom-0 w-full bg-white">
                  <div className="flex align-middle justify-between">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900">
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
                    className="text-gray-900 truncate max-w-fit text-nowrap text-xs block my-1"
                    title={productName}
                  >
                    {productName}
                  </Link>
                  <div className="flex gap-[1px] sm:gap-2 items-end my-1">
                    <p className="text-black text-[10px] sm:text-sm font-semibold md:font-bold flex gap-[2px]">
                      <span>₹</span>
                      <span>{product.sale_price}</span>
                    </p>
                    <p className="text-gray-500 text-[11px] line-through sm:text-xs flex gap-[1px]">
                      <span>₹</span>
                      <span>{product.regular_price}</span>
                    </p>
                    <p className="text_highlight font-semibold md:text-[9px] text-[10px] text-green-600 ">
                      <span>
                        {(
                          ((product.regular_price - product.sale_price) /
                            product.regular_price) *
                          100
                        ).toFixed(2)}
                        %
                      </span>{' '}
                      OFF
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {(product.product_tag && product.product_tag !== 'null') && (
                      <span className="border px-2 py-1 bg-green-400 text-white font-medium uppercase text-[10px] md:text-xs">
                        {product.product_tag}
                      </span>
                    )}
                    {(product.product_quality && product.product_quality !== 'null') && (
                      <span className="border px-2 py-1 bg-gray-400 text-white font-medium uppercase text-[10px] md:text-xs">
                        {product.product_quality}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
            );
          })
        )}
      </Swiper>
    </div>
    </section>
  );
};

export default SingleSlider;


