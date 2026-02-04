import React from "react";
import { Link } from "@/components/compat/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// 🩰 You can replace these banner images with actual footwear banners
const FootwearBannerCards = [
  {
    title: "footwearBanner1",
    imgSrc: `${""}/images/mobile/footwear_banner_1.jpg`,
    slug: "#",
  },
  {
    title: "footwearBanner2",
    imgSrc: `${""}/images/mobile/footwear_banner_2.jpg`,
    slug: "#",
  },
  {
    title: "footwearBanner3",
    imgSrc: `${""}/images/mobile/footwear_banner_3.jpg`,
    slug: "#",
  },
  {
    title: "footwearBanner4",
    imgSrc: `${""}/images/mobile/footwear_banner_4.jpg`,
    slug: "#",
  },
];

const FootwearBanner = () => {
  return (
    <div>
      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={2000}
        spaceBetween={10}
        slidesPerView={3}
        breakpoints={{
          0: { slidesPerView: 1 },
          767: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="inner_home owl_mobile"
      >
        {FootwearBannerCards.map((banner, index) => (
          <SwiperSlide key={index}>
            <Link
              to={`../${banner.slug}`}
              className="flex flex-col justify-end relative w-[375px] md:w-full h-[450px] md:h-[500px] rounded-lg md:rounded-none"
            >
              <img
                className="w-full absolute h-full object-cover top-0 left-0 rounded-lg md:rounded-none"
                src={banner.imgSrc}
                alt={banner.title}
                loading="lazy"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FootwearBanner;


