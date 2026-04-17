import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useRouter } from 'next/router';

import workData from '../../content/workData';
import { strokedHeading } from '../../styles/typography';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const chunkArray = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
};

const OurWorks = () => {
  const workChunks = chunkArray(workData, 2);
  const router = useRouter();
  const isSaltLake = router.query?.branch === 'salt-lake';
  const isLakeGarden = router.query?.branch === 'kolkata';

  return (
    <div className="pt-3 max-w-7xl mx-auto px-2">
      <div className="my-4 md:my-8">
        <h4 className={`${strokedHeading} mb-0`}>
          REMARKABLE <span>TRANSFORMATIONS</span>
        </h4>

        {isSaltLake
          ?
          <>
            <p className='text-start text-gray-500 md:text-center w-full md:w-3/5 m-auto mb-4'>
              Hair patch service Kolkata
            </p>
            <p className="text-start md:text-center w-full md:w-3/5 m-auto mb-4">
              Our hair patch service in Salt Lake includes cleaning, rebonding, and styling <br /> — starting at just ₹999.
            </p>
          </>

          : isLakeGarden ? (
            <p className="text-start md:text-center w-full md:w-3/5 m-auto mb-4">
              Visit Kolkata's most trusted wig centre at 1A Sultan Alam
Road, Lake Gardens.
            </p>
          ) : ''
        }
        <p className="text-start md:text-center w-full md:w-3/5 m-auto">
          Non-surgical hair patch result at Indian Hair World. Natural look achieved in 60 minutes. <br /> Starting from ₹5999.
        </p>
      </div>

      {/* MOBILE SLIDER (Stacked Vertically, 1 Slide Per View) */}
      <div className="block md:hidden">
        <Swiper
          navigation
          loop
          spaceBetween={10}
          autoplay={{
            delay: 2500,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
        >
          {workData.length === 0
            ? [...Array(4)].map((_, idx) => (
              <SwiperSlide key={`skeleton-m-${idx}`}>
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-[250px]" />
                  <Skeleton className="h-[250px]" />
                </div>
              </SwiperSlide>
            ))
            : workChunks.map((pair, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col gap-3">
                  {pair.map((work, idx) => (
                    <div key={idx} className="group bg-white relative h-[350px] w-full rounded-md overflow-hidden border border-gray-100 shadow-sm">
                      <img
                        src={work.imgSrc}
                        alt={work.work_name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.1]"
                      />
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* DESKTOP SLIDER (Horizontal Row, 3 Slides Per View) */}
      <div className="hidden md:block">
        <Swiper
          navigation
          loop
          spaceBetween={20}
          autoplay={{
            delay: 2500,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Pagination, Autoplay]}
          breakpoints={{
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3 },
          }}
        >
          {workData.length === 0
            ? [...Array(4)].map((_, idx) => (
              <SwiperSlide key={`skeleton-d-${idx}`}>
                <Skeleton className="h-[400px]" />
              </SwiperSlide>
            ))
            : workData.map((work, index) => (
              <SwiperSlide key={index}>
                <div className="group bg-white relative h-[400px] w-full rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <img
                    src={work.imgSrc}
                    alt={work.work_name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.1]"
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default OurWorks;
