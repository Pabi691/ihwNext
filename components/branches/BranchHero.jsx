import React from "react";
import { useParams } from "@/components/compat/router";
import { branchData } from "@/content/branchData";
import { FaPhone, FaWhatsapp, FaTrophy, FaStar, FaRankingStar, FaAward, FaThumbsUp } from "react-icons/fa6";
import GlassButton from "../GlassButton";
import GlassBadge from "../GlassBadge";

const BranchHero = () => {
  const { branch } = useParams();
  const branchDetails = branchData[branch];

  // Fallback if no branch matched
  if (!branchDetails) return null;

  return (
    <section className="w-full bg-white font-montserrat pb-4 md:pt-10 md:pb-8 relative overflow-hidden">

      {/* Background Subtle Gradient for Desktop */}
      <div className="hidden md:block absolute top-0 right-0 w-1/2 h-[calc(100%-80px)] bg-gradient-to-l from-gray-50 to-white z-0" />
      {/* MOBILE ONLY: Top Image */}
      <div className="w-full md:hidden mb-2 overflow-hidden">
        {/* <img
              src={branchDetails.banner_img || "/images/banner_top.jpg"}
              alt={`${branchDetails.name} Hair Patch Center`}
              className="w-full h-[250px] object-cover"
            /> */}
        <img src="/images/banner_top.jpg" alt="As seen on Shark Tank India" className="w-full" />
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-12">

          {/* LEFT CONTENT: Laser Focused on Conversion */}
          <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left z-10">

            {/* CTR Hook Badge */}
            <div className="w-fit mx-auto md:mx-0 mb-4 inline-flex items-center gap-1.5 bg-[#ef7f1a] text-white px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm">
              <FaRankingStar className="w-4 h-4" />
              India's #1 Non-Surgical Hair Replacement
            </div>

            {/* SEO H1 Headline */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-[#0A3D91] via-[#1E5CCB] to-[#F5D76E] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,215,100,0.35)]">
                {branchDetails.h1}
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
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Starting At</p>
                <p className="text-2xl md:text-4xl font-extrabold text-[#ef7f1a]">Rs. 5999/-</p>
              </div>
              <div className="w-[1px] h-12 bg-gray-300 hidden md:block mx-2"></div>
              <div className="flex flex-col items-center justify-center">
                <img src="/images/bajaj.png" alt="Bajaj No Cost EMI" className="h-20 object-contain" />
                <span className="text-xs font-bold text-gray-900">Available</span>
              </div>
            </div>

            {/* CTAs */}
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
          </div>

          {/* RIGHT CONTENT: High Quality Visuals & Trust (DESKTOP MAINLY) */}
          <div className="w-full md:w-1/2 relative hidden md:flex items-center justify-center mb-8">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={"/images/sharktankbanner.jpeg"}
                alt={`${branchDetails.name} Hair Patch`}
                className="w-full"
              />

              {/* Floating Shark Tank Badge Overlay */}
              {/* <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-white/20">
                <img src="/images/sharkDesk.jpeg" alt="As seen on Shark Tank India" className="h-16 object-contain rounded-lg" />
                <p className="text-center text-[10px] font-bold mt-1 text-gray-800">Featured On</p>
              </div> */}
            </div>
          </div>

        </div>
      </div>

      <div className="w-full md:hidden mb-2 overflow-hidden">
        {/* <img
              src={branchDetails.banner_img || "/images/banner_top.jpg"}
              alt={`${branchDetails.name} Hair Patch Center`}
              className="w-full h-[250px] object-cover"
            /> */}
        <img src="/images/sharkMobile.png" alt="Hair World" className="w-full" />
      </div>

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
    </section>
  );
};

export default BranchHero;
