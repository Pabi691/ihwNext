import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

const images = [
  {
    src: '/images/our-work-img4.jpg',
    alt: 'Hair Weaving Services in Kolkata',
  },
  {
    src: '/images/our-work-img2.jpg',
    alt: 'Best Hair Replacement Service Kolkata',
  },
  {
    src: '/images/our-work-img1.jpg',
    alt: 'Hair Weaving Services in Salt Lake',
  },
  {
    src: '/images/our-work-img3.jpg',
    alt: 'Best Hair Patch Service in Kolkata',
  },
];

const TransformationsGallery = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      
      {/* Heading */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <span className="w-10 h-[1px] bg-black"></span>
        <h2 className="text-3xl font-semibold text-center">
          Transformations
        </h2>
        <span className="w-10 h-[1px] bg-black"></span>
      </div>

      {/* Image Slider */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="overflow-hidden rounded-md">
              {/* <a href={img.src} target="_blank" rel="noopener noreferrer"> */}
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              {/* </a> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TransformationsGallery;
