import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import workData from '../../content/workData';
import { strokedHeading } from '../../styles/typography';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const OurWorks = () => {
  return (
    <div className="pt-3 max-w-7xl mx-auto px-2">
      <div className="my-4 md:my-8">
        <h4 className={`${strokedHeading} mb-0`}>
          SOME OF <span>OUR WORKS</span>
        </h4>
        <p className="text-center w-3/5 m-auto">
          We specialize in providing the best non-surgical hair replacement solutions such as natural wigs, hair wigs, male hair wigs, female hair wigs, etc. under one roof.
        </p>
      </div>

      <Swiper
        navigation
        loop
        spaceBetween={10}
        autoplay={{
          delay: 2500,
          pauseOnMouseEnter: true,   // 👈 pause on hover
          disableOnInteraction: false,
        }}
        modules={[Navigation, Pagination, Autoplay]}
        breakpoints={{
          360: { slidesPerView: 1 },
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {workData.length === 0
          ? [...Array(4)].map((_, idx) => (
              <SwiperSlide key={`skeleton-${idx}`}>
                <Skeleton height={400} />
                <Skeleton height={80} />
              </SwiperSlide>
            ))
          : workData.map((work, index) => (
              <SwiperSlide key={index}>
                <div className="group bg-white relative h-[250px] md:h-[400px] rounded-sm overflow-hidden">
                  
                  <img
                    src={work.imgSrc}
                    alt={work.work_name}
                    loading="lazy"
                    className="
                      absolute inset-0 w-full h-full object-cover
                      transition-transform duration-700 ease-out
                      group-hover:scale-[1.1]
                    "
                  />

                  {/* Optional overlay later if needed */}
                  {/* 
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
                  */}
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default OurWorks;
