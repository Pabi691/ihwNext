import React, { useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import workData from '../../content/workData';

import 'swiper/css';

const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const OurWorks = () => {
  const workChunks = chunkArray(workData, 2);
  const mobileSwiperRef = useRef(null);
  const desktopSwiperRef = useRef(null);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--site-primary)] mb-3">
            Before &amp; After
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-gray-900">
            Remarkable <span className="text-[var(--site-primary)]">Transformations</span>
          </h2>
          <p className="mt-4 text-base text-gray-500 leading-relaxed max-w-xl mx-auto">
            Non-surgical hair patch results at Indian Hair World. Natural look achieved in 60 minutes — starting from ₹5,999.
          </p>
        </div>

        {/* Mobile: stacked pairs */}
        <div className="block md:hidden relative">
          <Swiper
            onSwiper={(s) => (mobileSwiperRef.current = s)}
            loop
            spaceBetween={12}
            autoplay={{ delay: 2500, pauseOnMouseEnter: true, disableOnInteraction: false }}
            modules={[Autoplay]}
            slidesPerView={1}
          >
            {workData.length === 0
              ? [...Array(4)].map((_, i) => (
                  <SwiperSlide key={i}>
                    <div className="flex flex-col gap-3">
                      <Skeleton className="h-[250px]" />
                      <Skeleton className="h-[250px]" />
                    </div>
                  </SwiperSlide>
                ))
              : workChunks.map((pair, i) => (
                  <SwiperSlide key={i}>
                    <div className="flex flex-col gap-3">
                      {pair.map((work, j) => (
                        <div key={j} className="group relative h-[320px] w-full rounded-xl overflow-hidden shadow-sm">
                          <img
                            src={work.imgSrc}
                            alt={work.work_name}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  </SwiperSlide>
                ))}
          </Swiper>
          <button
            onClick={() => mobileSwiperRef.current?.slidePrev()}
            className="absolute top-1/2 -translate-y-1/2 -left-1 z-10 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-all"
            aria-label="Previous"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => mobileSwiperRef.current?.slideNext()}
            className="absolute top-1/2 -translate-y-1/2 -right-1 z-10 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-all"
            aria-label="Next"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Desktop: 3 per row */}
        <div className="hidden md:block relative">
          <Swiper
            onSwiper={(s) => (desktopSwiperRef.current = s)}
            loop
            spaceBetween={20}
            autoplay={{ delay: 2500, pauseOnMouseEnter: true, disableOnInteraction: false }}
            modules={[Autoplay]}
            breakpoints={{
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 3 },
            }}
          >
            {workData.length === 0
              ? [...Array(3)].map((_, i) => (
                  <SwiperSlide key={i}>
                    <Skeleton className="h-[400px] rounded-xl" />
                  </SwiperSlide>
                ))
              : workData.map((work, i) => (
                  <SwiperSlide key={i}>
                    <div className="group relative h-[400px] w-full rounded-xl overflow-hidden shadow-sm">
                      <img
                        src={work.imgSrc}
                        alt={work.work_name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </SwiperSlide>
                ))}
          </Swiper>
          <button
            onClick={() => desktopSwiperRef.current?.slidePrev()}
            className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-all"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => desktopSwiperRef.current?.slideNext()}
            className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-all"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default OurWorks;
