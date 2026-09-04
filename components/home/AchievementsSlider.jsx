import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

const achievements = [
  {
    title: 'Times Brand Icons 2024',
    designation: 'Leading Hair Replacement Center of West Bengal 2024',
    description:
      'Indian Hair World (IHW) is thrilled to be recognized as the "Leading Hair Replacement Center of West Bengal 2024" by the prestigious Times Brand Icons!',
    image: '/images/times_brand_icons_in_2024.jpeg',
  },
  {
    title: 'IEA 2024',
    designation: 'International Excellence Award 2024 — Best Hair Replacement Center In East Zone',
    description:
      'Indian Hair World has been recognized with the prestigious International Excellence Award 2024 for its exceptional services as the Best Hair Replacement Center in the East Zone.',
    image: '/images/iea_award_in_2024.jpeg',
  },
  {
    title: 'GFA 2024',
    designation: 'Global Fame Award 2024 — Best Hair Replacement Center In Kolkata',
    description:
      'Indian Hair World has been honoured with the Global Fame Award 2024 for being the Best Hair Replacement Center in Kolkata, West Bengal.',
    image: '/images/gfa_award_in_2024.jpeg',
  },
  {
    title: 'NPA 2022',
    designation: 'Nation Pride Award 2022 — Best Hair Replacement Center of West Bengal',
    description:
      'Indian Hair World received the prestigious Nation Pride Award 2022 for being the Best Hair Replacement Center in West Bengal.',
    image: '/images/npa_award_in_2022.jpeg',
  },
  {
    title: 'BPA 2021',
    designation: 'Bengal Pride Award 2021 — Best Hair Replacement Center of Kolkata',
    description:
      'Indian Hair World was awarded the prestigious Bengal Pride Award 2021 for its top-notch professional services in Kolkata.',
    image: '/images/bpa2021.jpg',
  },
];

const AchievementsSlider = () => {
  const swiperRef = useRef(null);

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--site-heading)] mb-3">
            Recognition
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-gray-900">
            Indian Hair World <span className="text-[var(--site-heading)]">Achievements</span>
          </h2>
        </div>

        <div className="relative">
          <Swiper
            onSwiper={(s) => (swiperRef.current = s)}
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-2"
          >
            {achievements.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="group h-full border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-900">
                  {item.image && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6 bg-white group-hover:bg-gray-900 transition-colors duration-300 h-full flex flex-col gap-3">
                    <span className="inline-block w-fit px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[rgb(var(--site-primary-rgb)_/_0.1)] text-[var(--site-heading)] rounded-full group-hover:bg-white/10 group-hover:text-white transition-colors duration-300">
                      {item.title}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-white leading-snug transition-colors duration-300">
                      {item.designation}
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-gray-300 leading-relaxed transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute top-[35%] -translate-y-1/2 -left-1 md:-left-4 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-all"
            aria-label="Previous"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute top-[35%] -translate-y-1/2 -right-1 md:-right-4 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-all"
            aria-label="Next"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default AchievementsSlider;
