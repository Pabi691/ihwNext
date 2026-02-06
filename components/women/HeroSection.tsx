"use client"

export default function HeroSection() {
  return (
    <section className="relative h-[60vh] md:h-screen xl:h-[90vh] overflow-hidden">
      
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/banner.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end items-end px-4 sm:px-10 md:px-24 pb-16">
        <div className="max-w-lg text-right">
          <h1 className="text-xl sm:text-3xl md:text-4xl text-white font-montserrat mb-4 leading-tight">
            DISCOVER CONFIDENCE <br />
            <span className="font-semibold">WITH HAIR PATCHES</span>
          </h1>
          <h2 className="font-montserrat text-sm sm:text-1xl md:text-2xl text-white mb-4 animate-fadeIn leading-tight">
            TOPPERS  & WIGS MADE JUST FOR  WOMEN
          </h2>

          <p className="text-sm sm:text-lg md:text-2xl text-white/80 font-montserrat">
            Your perfect solution for thinning hair — natural, comfortable, stunning
          </p>
        </div>
      </div>
    </section>
  )
}
