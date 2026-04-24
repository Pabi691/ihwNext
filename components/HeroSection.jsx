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
import { FaAward, FaPhone, FaRankingStar, FaStar, FaThumbsUp, FaTrophy, FaWhatsapp } from "react-icons/fa6";
import GlassBadge from "./GlassBadge";
import GlassButton from "./GlassButton";

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
      console.warn('Banner images fetch failed:', err?.message || err);
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
          <div className="flex flex-col md:flex-row items-center">
            <img src="/images/banner_top.jpg" alt="Hero Image" className="w-full h-auto object-contain md:hidden block" />
            {/* LEFT CONTENT */}
            <div className="w-full md:w-1/2 py-10 text-center md:text-left md:py-0">
              {/* CTR Hook Badge */}
              <div className="w-fit mx-auto md:mx-0 mb-4 inline-flex items-center gap-1.5 bg-[#ef7f1a] text-white px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm">
                <FaRankingStar className="w-4 h-4" />
                India's #1 Non-Surgical Hair Replacement
              </div>
              <div className="space-y-4">

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                    {branchDetails ? branchDetails.h1 : 'Best Hair Patch & Non-Surgical Hair Replacement in Kolkata'}
                  </span>
                </h1>

                {/* Keyword-rich Subheadline */}
                <span className="text-gray-900 text-base md:text-xl mb-6 max-w-lg mx-auto md:mx-0">
                  {/* Transform your look in 60 minutes with 100% natural, undetectable Indian human hair.  */}
                  <strong className="text-blue-600 font-bold">No Surgery. No Side Effects.</strong>
                </span>

                {/* Price & EMI block */}
                <div className="flex flex-row items-center gap-4 bg-[#ef7f1a]/5 border border-[#ef7f1a]/20 p-4 rounded-2xl mb-8 w-fit mx-auto md:mx-0">
                  <div>
                    <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Starting At</span>
                    <span className="text-2xl md:text-4xl font-extrabold text-[#ef7f1a]">Rs. 5999/-</span>
                  </div>
                  <div className="w-[1px] h-12 bg-gray-300 hidden md:block mx-2"></div>
                  <div className="flex flex-col items-center justify-center">
                    <img src="/images/bajaj.png" alt="Bajaj No Cost EMI" className="h-20 object-contain" />
                    <span className="text-xs font-bold text-gray-900">Available</span>
                  </div>
                </div>
                {branchDetails ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <GlassButton
                      href={`tel:${branchDetails.phones[0]}`}
                      icon={<FaPhone />}
                      variant="primary"
                    >
                      BOOK FREE CONSULTATION
                    </GlassButton>

                    <GlassButton
                      href={`https://wa.me/${branchDetails.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<FaWhatsapp />}
                      variant="secondary"
                    >
                      WhatsApp Us
                    </GlassButton>

                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <GlassButton
                      href="tel:+917980221032"
                      icon={<FaPhone />}
                      variant="primary"
                    >
                      BOOK FREE CONSULTATION
                    </GlassButton>

                    <GlassButton
                      href="https://wa.me/917980221032?text=Hello%20Indian%20Hair%20World%2C%20I%20would%20like%20to%20inquire%20about%20your%20hair%20replacement%20services."
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<FaWhatsapp />}
                      variant="secondary"
                    >
                      WhatsApp Us
                    </GlassButton>

                  </div>
                )}

              </div>
            </div>
            {/* RIGHT BANNER / SWIPER */}
            <div className="w-full md:w-1/2 h-[540px] md:h-[750px] relative hidden md:block">
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

      {/* TRUST BAR (AWARDS & CREDENTIALS) */}
      <div className="mt-8 md:mt-12 pt-6 border-t border-gray-100 w-full overflow-hidden relative">
        <style dangerouslySetInnerHTML={{
          __html: `
              @keyframes marqueeContinuous {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee-continuous {
                display: flex;
                width: max-content;
                animation: marqueeContinuous 30s linear infinite;
              }
              .animate-marquee-continuous:hover {
                animation-play-state: paused;
              }
            `}} />

        <div className="animate-marquee-continuous gap-4 md:gap-8 pb-4">

          {/* SET 1 */}
          <div className="flex items-center gap-4 md:gap-8">
            <GlassBadge
              img="/images/sharkDesk.jpeg"
              text="As Seen on Shark Tank India"
            />

            <GlassBadge
              icon={<FaStar className="text-yellow-400 w-4 h-4" />}
              text="Trusted by 10,000+ Customers"
            />

            <GlassBadge
              icon={<FaAward className="text-[#ef7f1a] w-4 h-4" />}
              text="Times Brand Icons 2024"
            />

            <GlassBadge
              icon={<FaTrophy className="text-[#ef7f1a] w-4 h-4" />}
              text="International Excellence Award 2024"
            />

            <GlassBadge
              icon={<FaTrophy className="text-[#ef7f1a] w-4 h-4" />}
              text="Global Fame Award 2024"
            />

            <GlassBadge
              icon={<FaThumbsUp className="text-[#ef7f1a] w-4 h-4" />}
              text="Nation Pride Award 2022"
            />

            <GlassBadge
              icon={<FaThumbsUp className="text-[#ef7f1a] w-4 h-4" />}
              text="Bengal Pride Award 2021"
            />

            <GlassBadge
              icon={<FaThumbsUp className="text-[#ef7f1a] w-4 h-4" />}
              text="Bengal Pride Award 2021"
            />
          </div>

          {/* SET 2 (Clone for infinite seamless loop) */}
          <div className="flex items-center gap-4 md:gap-8">
            <GlassBadge
              img="/images/sharkDesk.jpeg"
              text="As Seen on Shark Tank India"
            />

            <GlassBadge
              icon={<FaStar className="text-yellow-400 w-4 h-4" />}
              text="Trusted by 10,000+ Customers"
            />

            <GlassBadge
              icon={<FaAward className="text-[#ef7f1a] w-4 h-4" />}
              text="Times Brand Icons 2024"
            />

            <GlassBadge
              icon={<FaTrophy className="text-[#ef7f1a] w-4 h-4" />}
              text="International Excellence Award 2024"
            />

            <GlassBadge
              icon={<FaTrophy className="text-[#ef7f1a] w-4 h-4" />}
              text="Global Fame Award 2024"
            />

            <GlassBadge
              icon={<FaThumbsUp className="text-[#ef7f1a] w-4 h-4" />}
              text="Nation Pride Award 2022"
            />

            <GlassBadge
              icon={<FaThumbsUp className="text-[#ef7f1a] w-4 h-4" />}
              text="Bengal Pride Award 2021"
            />

            <GlassBadge
              icon={<FaThumbsUp className="text-[#ef7f1a] w-4 h-4" />}
              text="Bengal Pride Award 2021"
            />

            <GlassBadge
              icon={<FaStar className="text-yellow-400 w-4 h-4" />}
              text="Trusted by 10,000+ Customers"
            />

            <GlassBadge
              icon={<FaAward className="text-[#ef7f1a] w-4 h-4" />}
              text="Times Brand Icons 2024"
            />

            <GlassBadge
              icon={<FaTrophy className="text-[#ef7f1a] w-4 h-4" />}
              text="International Excellence Award 2024"
            />

            <GlassBadge
              icon={<FaTrophy className="text-[#ef7f1a] w-4 h-4" />}
              text="Global Fame Award 2024"
            />

            <GlassBadge
              icon={<FaThumbsUp className="text-[#ef7f1a] w-4 h-4" />}
              text="Nation Pride Award 2022"
            />

            <GlassBadge
              icon={<FaThumbsUp className="text-[#ef7f1a] w-4 h-4" />}
              text="Bengal Pride Award 2021"
            />
          </div>

        </div>
      </div>

    </>

  );
};

export default HeroSection;

