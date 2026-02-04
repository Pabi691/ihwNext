import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from '@/components/compat/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import serviceData from '../../content/serviceData';
import { strokedHeading } from '../../styles/typography';

const ServiceSlider = () => {
  return (
    <div className="pt-3 max-w-7xl mx-auto px-2">
      <div className="my-4 md:my-8">
        <h4 className={`${strokedHeading} mb-0`}>OUR POPULAR <span>SERVICES</span></h4>
        <p className='text-center w-3/5 m-auto'>
          We specialize in providing the best non-surgical hair replacement solutions such as natural wigs, hair
          wigs, male hair wigs, female hair wigs, etc. under one roof.
        </p>
      </div>

      <Swiper
        navigation
        loop={false}
        spaceBetween={10}
        modules={[Navigation, Pagination, Autoplay]}
        breakpoints={{
          360: { slidesPerView: 1 },
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {serviceData.length === 0
          ? [...Array(4)].map((_, idx) => (
            <SwiperSlide key={`skeleton-${idx}`}>
              <Skeleton width={250} height={300} />
              <Skeleton width={250} height={80} />
            </SwiperSlide>
          ))
          : serviceData.map((service, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white relative h-[250px] md:h-[300px] rounded-sm">
                <Link to={service.btnLink}>
                  <img
                    src={service.imgSrc}
                    alt={service.service_name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover rounded-sm"
                  />
                </Link>

                <div className="absolute bottom-0 w-full bg-white p-3">
                  <h4 className="font-semibold text-gray-600">
                    {service.service_name}
                  </h4>
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default ServiceSlider;

