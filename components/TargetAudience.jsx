import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Link } from '@/components/compat/router';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import { FaTag } from 'react-icons/fa6';
// import API_BASE_URL from '../global/apiConfig';
import axios from 'axios';
// import WishlistButton from './WishlistButton';
import { useGlobal } from '../global/GlobalContext';
import Skeleton from 'react-loading-skeleton';

const TargetAudience = () => {
  const { token } = useGlobal();
  const [cat, setCat] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_slug_data/target-audience`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.category_data?.child_categories
        // console.log('child_categories', res.data);
        if (res.data.category_data.status === 1) {
          setLoading(false);
          setCat(data);
        }

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCategories();
  }, [token]);



  return (
    <div className="pt-3 pb-10 relative">
      {/* <img className='absolute top-0 right-0 w-[200px]' src='images/bag_icon.png' />       */}
      <p className='text-base text-center mb-2 mt-10'>Special for professional!</p>
      <div className='text-2xl gap-4 relative w-fit block m-auto BaseNeue uppercase mt-2 mb-10'>
        Choose you activities
      </div>

      <Swiper
        navigation={false}
        loop={cat.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          }
        }}
        spaceBetween={10}
        modules={[Navigation, Pagination]} // Required modules
        className="mySwiper"
      >
        {cat.map((product) => (
          <SwiperSlide key={product.id}>
            {loading ? (
              <Skeleton
                height={450}
                width={300}
              />
            ) : (
              <div className="overflow-hidden relative h-[450px]">
                <Link className='w-full px-4 md:px-0 h-full absolute top-0 left-0' to={`${product.slug}`}>
                  <img
                    src={product.cat_img}
                    alt={product.cat_img}
                    className="w-full h-full object-cover rounded-xl md:rounded-none" loading="lazy"
                  />
                </Link>
              </div>
            )}

          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
};

export default TargetAudience;



