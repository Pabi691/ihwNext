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

const SingleSlider = ({ slug_name, price_filter, title, discountPercentage, cat_slug_name }) => {
  const { token, wishlist, setWishlist } = useGlobal();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${slug_name}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [slug_name, price_filter, discountPercentage, token, title]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const compressImage = (originalUrl, width = 500) => {
    const imageKitBase = 'https://ik.imagekit.io/vaysvybyq/';
    return `${imageKitBase}tr:w-${width},q-70/${originalUrl}`;
  };

  return (
    <div className="pt-3 max-w-7xl mx-auto px-2">
      <div className="flex justify-between text-start my-4 md:my-8 capitalize">
        <div>
          <h4>{title}</h4>
          {/* <p className="text-gray-500"></p> */}
        </div>
        {cat_slug_name && (
          <Link
            className="w-16 text-[10px] font-medium text-[#04A9FF]"
            to={`/${cat_slug_name}`}
          >
            {'Explore All'}
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
          products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="bg-white overflow-hidden relative md:h-[330px] h-[300px] border-none md:border rounded-sm">
                {product.product_tag && product.product_tag !== 'null' && (
                  <span className={`absolute z-10 ${themeBgColor} text-white top-0 left-0 text-[8px] sm:text-[10px] p-1 rotate-text`}>
                    {product.product_tag}
                  </span>
                )}

                <Link to={`/product/${product.slug}`}>
                  <img
                    src={compressImage(product.primary_img, 300)}
                    alt={product.prod_name}
                    className="w-full rounded-xl absolute top-0 left-0"
                    loading="lazy"
                  />
                </Link>

                <div className="p-1 md:p-4 absolute bottom-0 w-full bg-white">
                  <div className="flex align-middle justify-between">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-600">
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
                    title={product.prod_name}
                  >
                    {product.prod_name}
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
          ))
        )}
      </Swiper>
    </div>
  );
};

export default SingleSlider;


