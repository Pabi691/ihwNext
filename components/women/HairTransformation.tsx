// components/hair/HairTransformation.tsx
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import Image from "next/image"

import "swiper/css"
import "swiper/css/navigation"
import { strokedHeading } from "@/styles/typography"

const transformations = [
  "/images/hairtransformation2.jpg",
]

export default function HairTransformation() {
  return (
    <section className="max-w-9xl mx-auto px-6 lg:px-8 py-16 bg-gradient-to-b from-white to-gray-100 mb-8">

      {/* Header */}
      <div className="my-4 md:my-8">
        <h4 className={`${strokedHeading} mb-0`}>
          REMARKABLE <span>TRANSFORMATIONS</span>
        </h4>
        <p className="text-start md:text-center w-full md:w-3/5 m-auto">
          Non-surgical hair patch result at Indian Hair World. Natural look achieved in 60 minutes. Starting from ₹5999.
        </p>
      </div>

      {/* Swiper Slider */}
      <div className="relative w-full">
        <Swiper
          modules={[Navigation]}
          slidesPerView={1.2}
          spaceBetween={16}
          navigation={{
            prevEl: ".prev-button",
            nextEl: ".next-button",
          }}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
          }}
        >
          {transformations.map((img, index) => (
            <SwiperSlide key={index} className="overflow-hidden rounded-xl">
              <div className="relative w-full h-[350px] sm:h-[400px]">
                <Image
                  src={img}
                  alt={`Transformation ${index + 1}`}
                  fill
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        <button className="prev-button absolute top-1/2 -translate-y-1/2 left-2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white transition">
          ‹
        </button>
        <button className="next-button absolute top-1/2 -translate-y-1/2 right-2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white transition">
          ›
        </button>
      </div>
    </section>
  )
}
