import Link from "next/link"
import MenProductCard from "./MenProductCard"

export default function MensHairProductsSection() {
  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-100 py-4 md:py-8 lg:py-16 overflow-hidden">
      <div className="w-[98%] mx-auto">

        {/* Heading */}
        <div className="w-full flex justify-center items-center">
          <div className="flex justify-between items-start flex-wrap gap-4 w-[99%]">
            <div className="text-start mb-2 relative">
              <h3 className="text-xl mx-4 sm:text-2xl md:text-4xl font-bold text-gray-900 inline-block">
                MEN&apos;S <span className="outline-text font-semibold">HAIR PRODUCTS</span>
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

        {/* Grid */}
        <div className="w-full flex justify-center items-center py-4 md:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-6 w-[90%] sm:w-auto 2xl:w-full">

            <MenProductCard
              title="0.3 MM Hair Patch"
              subtitle="looking like human hair"
              price="₹24,999.00"
              oldPrice="₹39,999.00"
              discount="38% OFF"
              badge="Limited Stock!"
              image="/images/3mmhairpatch-min.jpg"
              hoverImage="/images/1-768x876.jpg"
              href="/product/unique-gold-hair-patch"
            />

            <MenProductCard
              title="Unique Gold Hair Patch"
              subtitle="looks real and smooth"
              price="₹5,999.00"
              oldPrice="₹10,999.00"
              discount="45% OFF"
              badge="Only Few Left!"
              image="/images/uniquegoldhairpatch-min.jpg"
              hoverImage="/images/1-3.jpg"
              href="/product/the-unique-gold-monofilament-hair-patch"
            />

            <MenProductCard
              title="Mono Salt and Pepper Color Patch"
              subtitle="Natural shine and fall"
              price="₹5,999.00"
              oldPrice="₹9,999.00"
              discount="40% OFF"
              badge="Only Few Left!"
              image="/images/Unique-GolD.jpg"
              hoverImage="/images/monogsaltpaperpatch.jpg"
              href="/product/mono-salt-and-paper-color-patch"
              imageFit="cover"
            />

            <MenProductCard
              title="Full Lace Hair Patch"
              subtitle="Premium look and comfort"
              price="₹10,000.00"
              oldPrice="₹14,000.00"
              discount="29% OFF"
              badge="Bestseller!"
              image="/images/fulllacehairpatch-min.jpg"
              hoverImage="/images/Model-hair-patch-price-10000.jpg"
              href="/product/full-lace-hair-patch"
            />

          </div>
        </div>
      </div>
    </section>
  )
}
