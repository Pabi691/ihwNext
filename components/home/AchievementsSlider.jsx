import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

const achievements = [
  {
    title: 'Times Brand Icons 2024',
    designation: 'Leading Hair Replacement Center of West Bengal 2024',
    description:
      'Indian Hair World (IHW) is thrilled to be recognized as the "Leading Hair Replacement Center of West Bengal 2024" by the prestigious Times Brand Icons!',
  },
  {
    title: 'IEA 2024',
    designation: 'International Excellence Award 2024 — Best Hair Replacement Center In East Zone',
    description:
      'Indian Hair World has been recognized with the prestigious International Excellence Award 2024 for its exceptional services as the Best Hair Replacement Center in the East Zone.',
  },
  {
    title: 'GFA 2024',
    designation: 'Global Fame Award 2024 — Best Hair Replacement Center In Kolkata',
    description:
      'Indian Hair World has been honoured with the Global Fame Award 2024 for being the Best Hair Replacement Center in Kolkata, West Bengal.',
  },
  {
    title: 'NPA 2022',
    designation: 'Nation Pride Award 2022 — Best Hair Replacement Center of West Bengal',
    description:
      'Indian Hair World received the prestigious Nation Pride Award 2022 for being the Best Hair Replacement Center in West Bengal.',
  },
  {
    title: 'BPA 2021',
    designation: 'Bengal Pride Award 2021 — Best Hair Replacement Center of Kolkata',
    description:
      'Indian Hair World was awarded the prestigious Bengal Pride Award 2021 for its top-notch professional services in Kolkata.',
  },
];

const AchievementsSlider = () => {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#04A9FF] mb-3">
            Recognition
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-gray-900">
            Indian Hair World <span className="text-[#04A9FF]">Achievements</span>
          </h2>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={24}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {achievements.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="group h-full border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-900">
                <div className="p-6 bg-white group-hover:bg-gray-900 transition-colors duration-300 h-full flex flex-col gap-3">
                  <span className="inline-block w-fit px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#04A9FF]/10 text-[#04A9FF] rounded-full group-hover:bg-white/10 group-hover:text-white transition-colors duration-300">
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

      </div>
    </section>
  );
};

export default AchievementsSlider;
