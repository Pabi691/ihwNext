const ShopOnlineBanner = () => {
  return (
    <section className="w-full bg-white mt-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row items-center gap-6">

          {/* TEXT SECTION */}
          <div className="w-full md:w-1/2 text-gray-800 px-2 sm:px-4 mt-10 md:mt-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-2 dancing-text">
              Your Hair, Your Style –
            </h2>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold mb-2">
              Shop Online Today
            </h2>

            <p className="text-base sm:text-lg text-gray-700 font-medium">
              Hair Extensions, Color Strands, Buns, Wigs &amp; Patches
            </p>
          </div>

          {/* IMAGE SECTION */}
          <div className="w-full md:w-1/2 flex justify-center items-center gap-4 relative">

            {/* Women */}
            <a href="/women" className="w-1/2 flex justify-center">
              <img
                src="/images/shop-women.png"
                alt="Women"
                className="w-[280px] sm:w-[350px] object-contain"
              />
            </a>

            {/* Men */}
            <a href="/men" className="w-1/2 flex justify-center">
              <img
                src="/images/shop-men.png"
                alt="Men"
                className="w-[280px] sm:w-[350px] object-contain"
              />
            </a>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopOnlineBanner;
