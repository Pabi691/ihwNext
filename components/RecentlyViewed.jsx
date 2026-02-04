import React, { useEffect, useState } from 'react';
import { useGlobal } from '../global/GlobalContext';
import { Link } from '@/components/compat/router';
import WishlistButton from './WishlistButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import Skeleton from 'react-loading-skeleton';
import { Navigation, Pagination } from 'swiper/modules';
import { themeBgColor } from '../styles/typography';

const RecentlyViewed = () => {
  const [recentProduct, setRecentProduct] = useState([]);
  const { token, wishlist, setWishlist  } = useGlobal();

  useEffect(() => {
    const fetchProductDetails = async () => {
        if (!token) {
          console.warn("Token missing. Aborting fetch.");
          return;
        }
        const viewedProducts = JSON.parse(sessionStorage.getItem('recentlyViewedProducts')) || [];
      
        if (viewedProducts) {
          // console.log("Loading product from sessionStorage");
          // console.log('viewedProducts', viewedProducts);
          setRecentProduct(viewedProducts);
          return;
        }
      };
      fetchProductDetails();
  }, [token]);

  if (!recentProduct) return null;

  return (
    <div className="pt-3">
      <h4 className='font-semibold capitalize text-lg mb-4'>Recently Viewed</h4>

        <Swiper
          navigation
          loop={recentProduct.length > 6}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            360:{ slidesPerView:2.2 },
            640: { slidesPerView: 2.5 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          spaceBetween={10}
          modules={[Navigation, Pagination]}
          className="mySwiper"
        >
          {recentProduct.map((product) => (
            <SwiperSlide key={product.id}>
              {recentProduct.length === 0 ? (
                <Skeleton width={450} height={400} />
              ):(
<div className="bg-white overflow-hidden relative md:h-[450px] h-[400px] border-0 md:border rounded-sm">
                {product.product_categories.some((category) => category.id === 3) && (
                  <span className={`absolute z-10 ${themeBgColor} text-white top-0 left-0 text-[10px] p-1 rotate-text`}>
                    {product.product_categories.find((category) => category.id === 3)?.category_name}
                  </span>
                ) }

                <Link to={`/product/${product.slug}`}>
                  <img
                    src={product.primary_img}
                    alt={product.prod_name}
                    className="w-full h-full object-cover absolute top-0 left-0" loading="lazy"
                  />
                </Link>

                <div className="p-1 md:p-4 absolute bottom-0 w-full bg-white">
                  <div className="flex align-middle justify-between">
                    {(product.brand_details?.brand_name && product.brand_details?.brand_name !== null) && (
                      <h4 className='text-sm font-semibold text-gray-600'>{product.brand_details?.brand_name}</h4>
                    )}
                  
                    {/* Wishlist Button */}
                    <WishlistButton
                      product={product}
                      wishlist={wishlist}
                      setWishlist={setWishlist}
                      token={token}
                    />
                  </div>
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-gray-900 text-nowrap text-xs block my-1"
                    title={product.prod_name}
                  >
                    {product.prod_name.length > 40 
                      ? product.prod_name.substring(0, product.prod_name.lastIndexOf(" ", 40)) + "..."
                      : product.prod_name}
                  </Link>

                  {/* Conditional discount logic */}
                  <div className="flex gap-[2px] md:gap-2 items-end">
                    <p className="text-black text-xs md:text-sm font-semibold md:font-bold flex gap-[2px]">
                      <span>₹</span>
                      <span>{product.sale_price}</span>
                    </p>
                    <p className="text-gray-500 text-[11px] line-through md:text-sm flex gap-[2px]">
                      <span>₹</span> 
                      <span>{product.regular_price}</span>
                    </p>
                    <p className="text_hightlight font-medium md:text-xs text-[10px]">
                      <span>
                      {(
                        ((product.regular_price - product.sale_price) / product.regular_price) *
                        100
                      ).toFixed(2)}{' '}
                      </span>
                     <span>% OFF</span>
                    </p>
                  </div>
                </div>
              </div>
              )}
              
            </SwiperSlide>
          ))}
        </Swiper>
     
    </div>
  );
};

export default RecentlyViewed;

