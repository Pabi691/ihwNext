import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { ImageService } from "@/content/image-service";
import { FaPhone, FaWhatsapp, FaRankingStar, FaChevronDown } from "react-icons/fa6";

const STATS = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "Since 2015", label: "Trusted Brand" },
  { value: "4 Branches", label: "Across Bengal" },
  { value: "5 Awards", label: "Recognised Excellence" },
];

export default function NHero() {
  const [bannerImages, setBannerImages] = useState([]);

  const fetchBanners = useCallback(async () => {
    try {
      const res = await ImageService.getAll();
      const filtered = (res.data?.data || []).filter(img => img.image_type === "banner");
      if (filtered.length) setBannerImages(filtered);
    } catch {}
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const canLoop = bannerImages.length > 1;

  return (
    <section className="relative w-full min-h-screen flex flex-col">
      {/* ── MAIN HERO ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">

        {/* LEFT — content */}
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-12 xl:px-20 py-16 bg-white">
          {/* Badge */}
          <div className="inline-flex w-fit items-center gap-2 bg-[#ef7f1a]/10 border border-[#ef7f1a]/30 text-[#ef7f1a] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <FaRankingStar className="w-3.5 h-3.5" />
            India's #1 Non-Surgical Hair Replacement
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-black leading-[1.1] text-gray-900 mb-4">
            Best Hair Patch &{" "}
            <span className="relative">
              <span className="relative z-10 text-[#04A9FF]">Non-Surgical</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#04A9FF]/10 -z-0 rounded" />
            </span>
            <br />Hair Replacement
            <br />
            <span className="text-2xl md:text-3xl xl:text-4xl text-gray-500 font-bold">in Kolkata</span>
          </h1>

          <p className="text-gray-600 text-base md:text-lg mb-8 max-w-md leading-relaxed">
            Natural-looking results in <strong className="text-gray-900">60 minutes</strong>. No surgery. No side effects. Starting at just{" "}
            <strong className="text-[#ef7f1a]">₹5,999/-</strong>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <a
              href="tel:+917980221032"
              className="inline-flex items-center justify-center gap-2.5 bg-[#04A9FF] hover:bg-[#0090dd] text-white font-bold px-7 py-4 rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-[#04A9FF]/30 hover:shadow-[#04A9FF]/50 hover:-translate-y-0.5"
            >
              <FaPhone className="w-4 h-4" />
              Book Free Consultation
            </a>
            <a
              href="https://wa.me/917980221032?text=Hello%20Indian%20Hair%20World%2C%20I%20would%20like%20to%20inquire%20about%20your%20hair%20replacement%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-7 py-4 rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              <FaWhatsapp className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>

          {/* Price + EMI */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl w-fit mb-10">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Starting At</p>
              <p className="text-3xl font-black text-[#ef7f1a]">₹5,999<span className="text-base font-bold">/-</span></p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="flex flex-col items-center">
              <img src="/images/bajaj.png" alt="Bajaj EMI" className="h-14 object-contain" />
              <span className="text-xs font-bold text-gray-500 mt-1">EMI Available</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-lg font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — banner swiper */}
        <div className="relative hidden lg:block overflow-hidden">
          {bannerImages.length > 0 ? (
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              loop={canLoop}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              speed={1500}
              slidesPerView={1}
              className="h-full w-full"
            >
              {bannerImages.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="w-full h-full min-h-[90vh]">
                    <img
                      src={img.image_path}
                      alt={img.name || "Hair Replacement Banner"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0f1a2c] to-[#04A9FF]/20 flex items-center justify-center">
              <img src="/images/banner_top.jpg" alt="Hero" className="w-full h-full object-cover" />
            </div>
          )}
          {/* Gradient overlay on left edge for blend */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      {/* Mobile banner image */}
      <div className="lg:hidden w-full">
        <img src="/images/banner_top.jpg" alt="Hair Replacement" className="w-full h-64 object-cover" />
      </div>

      {/* Scroll indicator */}
      <div className="hidden lg:flex absolute bottom-6 left-1/4 -translate-x-1/2 flex-col items-center gap-1 text-gray-300 animate-bounce">
        <FaChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
}
