import React from "react";
import { Link } from "@/components/compat/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import BannerCards from "../../content/MobileBannerCard";

const HomeBannerMobile = () => {
  return (
    <Swiper
      modules={[Autoplay]}
      loop={false}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      speed={2000}
      spaceBetween={0}
      slidesPerView={1}
      className="owl_mobile"
    >
      {BannerCards.map((card, index) => (
        <SwiperSlide key={index}>
          <Link
            to={card.btnLink}
            className="flex flex-col justify-end relative w-[97%] h-[400px] rounded-lg"
          >
            <img
              className="w-full absolute h-full object-cover top-0 left-0 rounded-lg"
              src={card.imgSrc}
              alt={card.title} loading="lazy"
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeBannerMobile;

