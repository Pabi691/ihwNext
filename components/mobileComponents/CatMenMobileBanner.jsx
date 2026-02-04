import React from "react";
import { Link } from "@/components/compat/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const BannerCards = [
  {
    title: "mobileBanner1",
    imgSrc: `${""}/images/mobile/male_banner_1.png`,
    slug: "#",
  },
  {
    title: "mobileBanner2",
    imgSrc: `${""}/images/mobile/male_banner_2.png`,
    slug: "#",
  },
  {
    title: "mobileBanner4",
    imgSrc: `${""}/images/mobile/male_banner_3.png`,
    slug: "#",
  },
  {
    title: "mobileBanner5",
    imgSrc: `${""}/images/mobile/male_banner_2.png`,
    slug: "#",
  },
  {
    title: "mobileBanner6",
    imgSrc: `${""}/images/mobile/male_banner_3.png`,
    slug: "#",
  },
];

const CatMenMobile = () => {
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
        {BannerCards.map((bannercat, index) => (
          <SwiperSlide key={index}>
            <Link
              to={`../${bannercat.slug}`}
              className="flex flex-col justify-end relative w-[375px] md:w-full h-[450px] md:h-[500px] rounded-lg md:rounded-none"
            >
              <img
                className="w-full absolute h-full md:w-full object-cover top-0 left-0 rounded-lg md:rounded-none"
                src={bannercat.imgSrc}
                alt={bannercat.title}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CatMenMobile;


