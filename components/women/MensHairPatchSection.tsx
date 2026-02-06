import Link from "next/link"
import HairPatchCard from "./HairPatchCard"

export default function MensHairPatchSection() {
  return (
    <section className="w-[100vw] bg-gradient-to-b from-white to-gray-100 py-4 md:py-8 lg:py-16 overflow-hidden">
      <div className="w-full md:w-[98%] mx-auto">

        {/* Section Heading */}
        <div className="w-full flex justify-center items-center">
          <div className="flex justify-between items-start flex-wrap gap-4 w-[99%]">

            <div className="text-start mb-2 relative">
              <h3 className="text-xl mx-6 sm:text-4xl font-bold text-gray-900 inline-block">
                MEN&apos;S HAIR <span className="outline-text font-semibold">PATCH</span>
              </h3>
            </div>

            <p className="text-gray-600 hidden md:block max-w-md text-sm sm:text-base font-montserrat">
              <Link
                href="/product-category/men-hair-patch"
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

        {/* Product Grid */}
        <div className="w-full flex justify-center items-center py-4 md:py-10">
          <div className="grid grid-cols-2 w-[90%] sm:w-auto sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 2xl:w-full">

            <HairPatchCard
              title="French Lace Mirage Hair Patch"
              subtitle="looking like human hair"
              price="₹15,999.00"
              oldPrice="₹30,000.00"
              discount="47% OFF"
              badge="Limited Stock!"
              image="/images/french-lace.jpg"
              hoverImage="/images/French-Lace-Mirage-Hair-Patch-2-1024x1024.jpg"
              href="/product/french-lace-mirage"
            />

            <HairPatchCard
              title="Mono Hair Patch"
              subtitle="looks real and smooth"
              price="₹4,999.00"
              oldPrice="₹7,999.00"
              discount="38% OFF"
              badge="Only Few Left!"
              image="/images/menhairpatch2.jpg"
              hoverImage="/images/Mono-Hair-Patch-2-768x768.jpg"
              href="/product/mono-hair-patch"
            />

            <HairPatchCard
              title="Australian Mirage Hair Patch"
              subtitle="looks real and smooth"
              price="₹14,999.00"
              oldPrice="₹24,999.00"
              discount="40% OFF"
              badge="Only Few Left!"
              image="/images/menpatch4.jpg"
              hoverImage="/images/Australian-Mirage-2.jpg"
              href="/product/australian-mirage-hair-patch"
            />

            <HairPatchCard
              title="Q6 Hair Patch"
              subtitle="breathable and realistic"
              price="₹12,999.00"
              oldPrice="₹20,000.00"
              discount="35% OFF"
              badge="Bestseller"
              image="/images/Q6hairpatch-min.jpg"
              href="/product/q6-hair-patch-indian-hair-world"
            />

          </div>
        </div>
      </div>
    </section>
  )
}
