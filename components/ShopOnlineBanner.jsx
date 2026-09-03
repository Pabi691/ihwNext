const ShopOnlineBanner = () => {
  return (
    <section className="w-full bg-white pt-14 pb-2 md:pt-2">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-8">

          {/* TEXT */}
          <div className="w-full md:w-1/2 text-gray-900">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#04A9FF] mb-3">
              Shop Online
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3 dancing-text">
              Your Hair, Your Style
            </h2>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Shop Online Today
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Hair Extensions, Color Strands, Buns, Wigs &amp; Patches
            </p>
          </div>

          {/* IMAGES */}
          <div className="w-full md:w-1/2 flex justify-center items-end gap-4">
            <a href="/women" className="w-1/2 flex justify-center hover:opacity-90 transition-opacity">
              <img
                src="/images/shop-women.png"
                alt="Women"
                className="w-[260px] sm:w-[320px] object-contain drop-shadow-md"
              />
            </a>
            <a href="/men" className="w-1/2 flex justify-center hover:opacity-90 transition-opacity">
              <img
                src="/images/shop-men.png"
                alt="Men"
                className="w-[260px] sm:w-[320px] object-contain drop-shadow-md"
              />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ShopOnlineBanner;
