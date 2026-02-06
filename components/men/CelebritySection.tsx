import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import Image from "next/image"

import "swiper/css"
import "swiper/css/navigation"

const celebrities = [
  { name: "SHREEMA BHATTACHERJEE", image: "/images/celibrity1compress.JPG" },
  { name: "LEKHA CHATTERJEE", image: "/images/celibrity2compress.JPG" },
  { name: "SOURAV DAS", image: "/images/hairpatch.jpg" },
  { name: "VINDU DARA SINGH", image: "/images/vindudarasing.webp" },
  { name: "DOUGLAS DE SILVA", image: "/images/douglas-de-silva.jpg" },
  { name: "MOUMITA SARKAR", image: "/images/26.jpg" },
  { name: "DARSHANA BANIK", image: "/images/24.jpg" },
]

export default function CelebritySection() {
  return (
    <>
      {/* ===== MOBILE SLIDER ===== */}
      <div className="bg-gradient-to-b from-white to-gray-100 w-full sm:hidden py-2">
        <div className="max-w-7xl mx-auto px-4">

          <h3 className="text-center mb-4 text-xl font-bold text-gray-900">
            CELEBRITIES WHO{" "}
            <span className="outline-text font-semibold">LOVE US</span>
          </h3>

          <div className="relative">
            <Swiper
              modules={[Navigation]}
              slidesPerView={1.2}
              spaceBetween={16}
              navigation={{
                prevEl: ".swiper-prev",
                nextEl: ".swiper-next",
              }}
            >
              {celebrities.map((celeb, index) => (
                <SwiperSlide key={index}>
                  <div className="overflow-hidden rounded-2xl shadow-xl group relative h-[200px] bg-white">
                    <Image
                      src={celeb.image}
                      alt={celeb.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-center">
                      <p className="text-white font-semibold text-[13px]">
                        {celeb.name}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation */}
            <button className="swiper-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center">
              ‹
            </button>

            <button className="swiper-next absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP GRID ===== */}
      <div className="hidden sm:block w-screen text-center py-8 md:py-12">
        <h3 className="text-xl sm:text-4xl font-bold text-gray-900 mb-8">
          CELEBRITIES WHO{" "}
          <span className="outline-text font-semibold">LOVE US</span>
        </h3>

        <div className="flex justify-center">
          <div className="w-[99%] flex flex-wrap gap-2">
            {celebrities.map((celeb, index) => (
              <div key={index} className="w-[24%] relative overflow-hidden">
                <Image
                  src={celeb.image}
                  alt={celeb.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-white font-semibold text-sm lg:text-lg">
                    {celeb.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
