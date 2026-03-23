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
  const { branch } = useParams();
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
        <div className="max-w-7xl mx-auto px-0 md:px-4">
          <div className="flex flex-col-reverse md:flex-row items-center">

            {/* LEFT CONTENT */}
            <div className="w-full md:w-1/2 py-10 text-center md:text-left md:py-0">
              <div className="space-y-4">

                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                  BEST HAIR PATCH
                  <br />
                  AND HAIR WIG
                  <br />
                  IN {branchDetails ? branchDetails.name : 'KOLKATA'}
                </h1>

                <p className="text-gray-600 text-base md:text-lg">
                  Transform Your Look with the Best Hair Patch and <br />
                  Hair Wig in {branchDetails ? branchDetails.name : 'Kolkata'}
                </p>

                <h5 className="text-xl md:text-2xl font-semibold text-black">
                  Starting just Rs. 5999/-
                </h5>

                {branchDetails ? (
                  <div className="flex flex-col md:items-start items-center gap-4 mt-6">

                    {/* Call Button */}
                    <a
                      href={`tel:${branchDetails.phones[0]}`}
                      className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-full bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
                      id="mainCTA"
                    >
                      <span className="text-xs bg-white text-gray-700 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                      📞 GET FREE CONSULTATION
                    </a>

                    {/* WhatsApp Button */}
                    <a
                      href={`https://wa.me/${branchDetails.phones[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-full bg-green-600 hover:bg-green-700 ring-2 ring-green-300 animate-pulse shadow-lg hover:shadow-xl transition-all duration-300"
                      id="whatsappCTA"
                    >
                      {/* <span className="text-xs bg-white text-green-700 px-2 py-0.5 rounded-full">
  Recommended
</span> */}
                      {/* WhatsApp Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        className="w-5 h-5 fill-white"
                      >
                        <path d="M16.001 3C8.821 3 3 8.822 3 16.002c0 2.82.922 5.44 2.48 7.56L4 29l5.59-1.45A12.94 12.94 0 0016 29c7.18 0 13.001-5.822 13.001-12.998C29.001 8.822 23.18 3 16 3zm0 23.5c-2.22 0-4.28-.64-6.02-1.74l-.43-.27-3.32.86.89-3.24-.28-.44A10.46 10.46 0 015.5 16c0-5.79 4.71-10.5 10.5-10.5S26.5 10.21 26.5 16 21.79 26.5 16 26.5zm5.74-7.84c-.31-.16-1.83-.9-2.11-1.01-.28-.1-.49-.16-.7.16s-.8 1.01-.98 1.22c-.18.21-.36.24-.67.08-.31-.16-1.3-.48-2.47-1.54-.91-.81-1.52-1.81-1.7-2.12-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.02-.55-.08-.16-.7-1.69-.96-2.31-.25-.61-.5-.53-.7-.54l-.6-.01c-.21 0-.55.08-.83.39-.28.31-1.1 1.07-1.1 2.61 0 1.54 1.13 3.03 1.29 3.24.16.21 2.22 3.39 5.38 4.75.75.32 1.34.51 1.8.65.76.24 1.45.21 2 .13.61-.09 1.83-.75 2.09-1.48.26-.73.26-1.36.18-1.48-.08-.11-.28-.18-.59-.34z" />
                      </svg>

                      CHAT ON WHATSAPP
                    </a>

                  </div>
                ) : (
                  <div className="flex flex-col md:items-start items-center gap-4 mt-6">

                    {/* Call Button */}
                    <a
                      href="tel:+917980221032"
                      className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-full bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
                      id="mainCTA"
                    >
                      <span className="text-xs bg-white text-gray-700 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                      📞 GET FREE CONSULTATION
                    </a>

                    {/* WhatsApp Button */}
                    <a
                      href="https://wa.me/917980221032?text=Hello%20Indian%20Hair%20World%2C%20I%20would%20like%20to%20inquire%20about%20your%20hair%20replacement%20services."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-full bg-green-600 hover:bg-green-700 ring-2 ring-green-300 animate-pulse shadow-lg hover:shadow-xl transition-all duration-300"
                      id="whatsappCTA"
                    >
                      {/* <span className="text-xs bg-white text-green-700 px-2 py-0.5 rounded-full">
  Recommended
</span> */}
                      {/* WhatsApp Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        className="w-5 h-5 fill-white"
                      >
                        <path d="M16.001 3C8.821 3 3 8.822 3 16.002c0 2.82.922 5.44 2.48 7.56L4 29l5.59-1.45A12.94 12.94 0 0016 29c7.18 0 13.001-5.822 13.001-12.998C29.001 8.822 23.18 3 16 3zm0 23.5c-2.22 0-4.28-.64-6.02-1.74l-.43-.27-3.32.86.89-3.24-.28-.44A10.46 10.46 0 015.5 16c0-5.79 4.71-10.5 10.5-10.5S26.5 10.21 26.5 16 21.79 26.5 16 26.5zm5.74-7.84c-.31-.16-1.83-.9-2.11-1.01-.28-.1-.49-.16-.7.16s-.8 1.01-.98 1.22c-.18.21-.36.24-.67.08-.31-.16-1.3-.48-2.47-1.54-.91-.81-1.52-1.81-1.7-2.12-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.02-.55-.08-.16-.7-1.69-.96-2.31-.25-.61-.5-.53-.7-.54l-.6-.01c-.21 0-.55.08-.83.39-.28.31-1.1 1.07-1.1 2.61 0 1.54 1.13 3.03 1.29 3.24.16.21 2.22 3.39 5.38 4.75.75.32 1.34.51 1.8.65.76.24 1.45.21 2 .13.61-.09 1.83-.75 2.09-1.48.26-.73.26-1.36.18-1.48-.08-.11-.28-.18-.59-.34z" />
                      </svg>

                      CHAT ON WHATSAPP
                    </a>

                  </div>
                )}

              </div>
            </div>
            {/* RIGHT BANNER / SWIPER */}
            <div className="w-full md:w-1/2 h-[540px] md:h-[750px] relative">
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
                      className="flex flex-col justify-end relative w-100 h-[540px] md:h-[750px]"
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

