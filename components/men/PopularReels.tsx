import { useEffect } from "react"
import Script from "next/script"
import Link from "next/link"

export default function PopularReels() {
  return (
    <>
      {/* Section Header */}
      <section className="w-full bg-gradient-to-b from-white to-gray-100 py-4 md:py-8 lg:py-16 overflow-hidden">
        <div className="w-[98%] mx-auto">
          <div className="flex justify-between items-start flex-wrap gap-4 w-[98%]">

            <div className="text-start mb-2 relative">
              <h3 className="text-xl mx-6 sm:text-4xl font-bold text-gray-900 inline-block">
                POPULAR <span className="outline-text font-semibold">PRODUCTS</span>
              </h3>
            </div>

            <p className="text-gray-600 hidden md:block max-w-md text-sm sm:text-base font-montserrat">
              <Link
                href="/product-category/men"
                className="inline-flex items-center text-black group transition-all duration-300"
              >
                <span className="relative text-base overflow-hidden">
                  <span className="relative z-10">View More</span>
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#04a9ff] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </p>

          </div>
        </div>
      </section>

      {/* Whatmore Reels */}
      <section className="whatmore-base min-h-[300px]">
        {/* Load Script Safely */}
        <Script
          src="https://d1qflh9ill7vje.cloudfront.net/whatmore.js"
          strategy="afterInteractive"
        />

        <div id="whatmoreShopId" data-wh="STRYVED1TUP" />
        <div id="whatmoreHeading" data-wh="" />
        <div id="whatmoreTitleFontSize" data-wh="28" />
        <div id="whatmoreLandscapePadding" data-wh="40" />
        <div id="whatmoreTopBottomPadding" data-wh="20" />
        <div id="whatmoreVideoTileSize" data-wh="80" />
        <div id="whatmoreVideoTileSizePortrait" data-wh="80" />
        <div id="whatmoreTitleFont" data-wh="sans-serif" />
        <div className="whatmore-template-type" data-wh="template-h" />
        <div id="whatmoreIsInDesignMode" data-wh="false" />
        <div className="whatmore-widget" data-wh="carousel" />
        <div className="whatmore-render-root" />
      </section>
    </>
  )
}
