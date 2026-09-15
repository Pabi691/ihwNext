import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import StoreCard from "./StoreCard"

import "swiper/css"

export default function OurStoresSection() {
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <section className="bg-gradient-to-b from-white to-gray-100 py-4 sm:py-8 md:py-16">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="w-full flex justify-center items-center">
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-4xl font-bold text-gray-900">
              OUR <span className="outline-text font-semibold">STORES</span>
            </h3>
          </div>
        </div>

        {/* Slider */}
        <div className="relative max-w-8xl mx-auto mb-12">
        <Swiper
          onSwiper={(s) => (swiperRef.current = s)}
          loop
          spaceBetween={24}
          autoplay={{ delay: 3000, pauseOnMouseEnter: true, disableOnInteraction: false }}
          modules={[Autoplay]}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-2"
        >
          <SwiperSlide>
            <StoreCard
              name="Durgapur Store"
              image="/images/durgapur.webp"
              time="11AM - 7PM"
              address="2nd Floor, Above Punjab National Bank, City Center, Durgapur, WB - 713216"
              phone="+919875517402"
              mapUrl="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14631.399763222813!2d87.293191!3d23.537899!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f773e265d7a933%3A0x2ad4399c8d04faf5!2sINDIAN%20HAIR%20WORLD%20(DURGAPUR)!5e0!3m2!1sen!2sin!4v1769175040174!5m2!1sen!2sin"
            />
          </SwiperSlide>

          <SwiperSlide>
            <StoreCard
              name="Kolkata Salt Lake Store"
              image="/images/salt-lake.webp"
              time="11AM - 7PM"
              address="EC-20, Ground Floor Back Side, Opp. CC1, Sector - 1, Salt Lake City, Kolkata - 700064"
              phone="+918961194044"
              mapUrl="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14735.131250655555!2d88.408487!3d22.587225!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027536b38aad3b%3A0x2fcf6656de9f0225!2sIndian%20Hair%20World%20Salt%20Lake%20%7C%20Non-Surgical%20Hair%20Replacement%20Services%20for%20Best%20Hair%20Patch%20and%20Hair%20Wigs%20In%20Kolkata!5e0!3m2!1sen!2sin!4v1769174890975!5m2!1sen!2sin"
            />
          </SwiperSlide>

          <SwiperSlide>
            <StoreCard
              name="Kolkata Lake Garden Store"
              image="/images/lakegardenimage.jpg"
              time="11AM - 7PM"
              address="1A, Sultan Alam Rd, Lake Gardens, Kolkata, West Bengal 700033"
              phone="+917980221032"
              mapUrl="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14743.793822821972!2d88.34616800000002!3d22.506117000000003!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0271ee3d777485%3A0xb3e1a11acb3b0e44!2sIndian%20Hair%20World!5e0!3m2!1sen!2sin!4v1769174791072!5m2!1sen!2sin"
            />
          </SwiperSlide>

          <SwiperSlide>
            <StoreCard
              name="Siliguri Store"
              image="/images/siliguri.png"
              time="11AM - 7PM"
              address="Sevoke Road, Siliguri City Plaza, 2nd Floor, Shop No. 3, Jalpaiguri, WB - 734001"
              phone="+917439436698"
              mapUrl="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14254.005381321096!2d88.43067!3d26.728373!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e4416ca8690379%3A0x72b0c331c2df8498!2sIndian%20Hair%20World%20Siliguri!5e0!3m2!1sen!2sin!4v1769175086449!5m2!1sen!2sin"
            />
          </SwiperSlide>

          <SwiperSlide>
            <StoreCard
              name="Sodepur Store"
              image="/images/LOL02994.png"
              time="11AM - 7PM"
              address="Shesher Kabita Apartment, 83, RN Avenue, Sodepur Rd, Pansila, Khardaha, Kolkata, West Bengal 700112"
              phone="+918910097668"
              mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.4207198653226!2d88.3854684!3d22.712598699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89b04dab5b9e5%3A0x139f519c883e6ee2!2sIndian%20Hair%20World%20Sodepur!5e0!3m2!1sen!2sin!4v1785831935261!5m2!1sen!2sin"
            />
          </SwiperSlide>
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
  )
}
