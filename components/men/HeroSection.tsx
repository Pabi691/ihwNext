"use client"

import { FaPhone, FaRankingStar, FaWhatsapp } from "react-icons/fa6"
import GlassButton from "../GlassButton"

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] md:h-screen xl:h-[90vh] overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-label="Men's hair patch and wig transformation video"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/men.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end items-end px-4 sm:px-10 md:px-24 pb-16">
        <div className="max-w-xl text-center md:text-right">
          {/* CTR Hook Badge */}
          <div className="w-fit mx-auto md:mx-0 mb-4 inline-flex items-center gap-1.5 bg-[#ef7f1a] text-white px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm">
            <FaRankingStar className="w-4 h-4" />
            India's #1 Non-Surgical Hair Replacement
          </div>
          <div className="space-y-4">

            {/* <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Best Hair Patch & Hair Wig for Men in Kolkata
              </span>
            </h1> */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
              <span className="text-white">
                Best Hair Patch & Hair Wig for Men in Kolkata
              </span>
            </h1>

            {/* Keyword-rich Subheadline */}
            <span className="text-gray-900 text-base md:text-xl mb-6 max-w-lg mx-auto md:mx-0">
              {/* Transform your look in 60 minutes with 100% natural, undetectable Indian human hair.  */}
              <strong className="text-blue-600 font-bold">No Surgery. No Side Effects.</strong>
            </span>

            {/* Price & EMI block */}
            <div className="flex flex-row justify-center items-center gap-4 bg-[#ef7f1a]/5 border border-[#ef7f1a]/20 p-4 rounded-2xl mb-8 w-full md:w-fit ms-0 md:ms-auto">
              <div className="flex flex-col">
                <span className="text-sm text-gray-300 font-semibold uppercase tracking-wider mb-1">Starting At</span>
                <span className="text-2xl md:text-4xl font-extrabold text-[#ef7f1a]"> Rs. 5999/-</span>
              </div>
              <div className="w-[1px] h-12 bg-gray-300 hidden md:block mx-2"></div>
              <div className="flex flex-col items-center justify-center">
                <img src="/images/bajaj.png" alt="Bajaj No Cost EMI" className="h-20 object-contain" />
                <span className="text-xs font-bold text-gray-900">Available</span>
              </div>
            </div>
            <div className="flex flex-col justify-end sm:flex-row gap-4 ms-auto">
              <GlassButton
                href="tel:+918961194044"
                icon={<FaPhone />}
                variant="primary"
              >
                BOOK FREE CONSULTATION
              </GlassButton>

              <GlassButton
                href="https://wa.me/918961194044?text=Hello%20Indian%20Hair%20World%2C%20I%20would%20like%20to%20inquire%20about%20your%20hair%20replacement%20services."
                target="_blank"
                rel="noopener noreferrer"
                icon={<FaWhatsapp />}
                variant="secondary"
              >
                WhatsApp Us
              </GlassButton>

            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
