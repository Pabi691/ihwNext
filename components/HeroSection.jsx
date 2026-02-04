import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "@/components/compat/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
// import cards from "../content/BannerCards";
// import { Link } from "@/components/compat/router";
import { ImageService } from "../content/image-service";
import { toast } from "react-toastify";
import { branchData } from "../content/branchData";

const HeroSection = () => {
  const [bannerImages, setBannerImages] = useState([]);
  // const [imageLoading, setImageLoading] = useState(false);
  const {branch} = useParams();
  const branchDetails = branchData[branch];

  const fetchBannerImages = useCallback(async () => {
    // setImageLoading(true);
    try {
      const res = await ImageService.getAll();

      const filterBannerImages = res.data.data.filter(img => img.image_type === 'banner');
      // console.log('filtered Images:', filterBannerImages);
      setBannerImages(filterBannerImages);
    } catch (err) {
      toast.error('Failed to load images.');
    }
    // setImageLoading(false);
  }, [setBannerImages]);

  useEffect(() => {
    fetchBannerImages();
  }, [fetchBannerImages]);

  const canLoop = bannerImages.length > 1;

  return (
    <>

      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center">

            {/* LEFT CONTENT */}
            <div className="w-full md:w-1/2 py-10 md:py-0">
              <div className="space-y-4">

                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                  BEST HAIR PATCH
                  <br />
                  AND HAIR WIG
                  <br />
                  IN {branchDetails? branchDetails.name : 'KOLKATA'}
                </h1>

                <p className="text-gray-600 text-base md:text-lg">
                  Transform Your Look with the Best Hair Patch and <br />
                  Hair Wig in {branchDetails? branchDetails.name : 'Kolkata'}
                </p>

                <h5 className="text-xl md:text-2xl font-semibold text-black">
                  Starting just Rs. 5999/-
                </h5>

                <a
                  href="tel:+918910097668"
                  className="inline-flex items-center gap-2 px-6 py-3 mt-4 text-white font-medium rounded-full bg-black hover:bg-gray-800 transition-all duration-300"
                  id="mainCTA"
                >
                  📞 GET FREE CONSULTATION
                </a>

              </div>
            </div>
            {/* RIGHT BANNER / SWIPER */}
            <div className="w-full md:w-1/2 h-[350px] md:h-[750px] relative">
              <Swiper
                modules={[Navigation, Autoplay]}
                loop={canLoop}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                speed={2000}
                spaceBetween={0}
                slidesPerView={1}
                navigation={false}
                className="hero_banner"
              >
                {bannerImages.map((card, index) => (
                  <SwiperSlide key={index}>
                    <div
                      // to={card.btnLink}
                      className="flex flex-col justify-end relative w-100 h-[750px]"
                    >
                      <img
                        className="w-full absolute h-full object-cover top-0 left-0"
                        src={card.image_path}
                        alt={card.name}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

          </div>
        </div>
      </section>


    </>

  );
};

export default HeroSection;

