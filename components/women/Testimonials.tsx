// components/testimonials/Testimonials.tsx
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/pagination"

const testimonials = [
  {
    name: "Priya Sharma, Actress",
    rating: 5,
    text: "These hair extensions are a total game changer! I love the volume and style I can get without damaging my natural hair.",
  },
  {
    name: "Meera Kapoor, Fashion Blogger",
    rating: 5,
    text: "Absolutely love the natural finish. Perfect for shoots and everyday glam — seamless and stunning!",
  },
  {
    name: "Anjali Verma, Model",
    rating: 5,
    text: "From styling to comfort, it’s the best extension brand I’ve used. Highly recommended!",
  },
]

export default function Testimonials() {
  return (
    <section className="relative py-16 sm:py-20 bg-black bg-opacity-90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Heading */}
        <div className="w-full flex justify-center items-center mb-10">
          <h3 className="text-1xl sm:text-4xl font-bold text-white inline-block">
            WHAT OUR <span className="outline-text font-semibold">CLIENTS SAY</span>
          </h3>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
          }}
          className="py-4"
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx} className="px-2 sm:px-4">
              <div className="bg-white/40 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 mx-auto max-w-md sm:max-w-xl shadow-2xl">
                <div className="text-yellow-400 mb-4 text-lg sm:text-xl">
                  {"★".repeat(t.rating)}
                </div>
                <p className="text-base sm:text-lg text-white font-semibold leading-relaxed mb-6 font-montserrat">
                  {t.text}
                </p>
                <p className="text-sm sm:text-base text-white font-light font-montserrat">
                  — {t.name}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
