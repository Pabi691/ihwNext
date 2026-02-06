import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import Image from "next/image"

// Swiper styles
import "swiper/css"

export default function AchievementSlider() {
  const awards = [
    "/images/Awards_1.jpg",
    "/images/Awards_2.jpg",
    "/images/Awards_3.jpg",
    "/images/Awards_4.jpg",
    "/images/Awards_5.jpg",
  ]

  return (
    <section className="bg-gradient-to-b from-white to-gray-100 sm:py-8 md:py-12">

      {/* Heading */}
      <div className="text-center mb-4 mt-4 md:mt-0 md:mb-10">
        <h3 className="text-xl mx-6 sm:text-4xl font-bold text-gray-900">
          OUR <span className="outline-text font-semibold">ACHIEVEMENT</span>
        </h3>
      </div>

      {/* Slider */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="px-4"
      >
        {awards.map((src, index) => (
          <SwiperSlide
            key={index}
            className="flex justify-center items-center"
          >
            <div className="transition-transform duration-300 hover:scale-105">
              <Image
                src={src}
                alt={`Award ${index + 1}`}
                width={300}
                height={260}
                className="h-52 md:h-64 object-contain sm:rounded-xl sm:shadow-xl"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  )
}
