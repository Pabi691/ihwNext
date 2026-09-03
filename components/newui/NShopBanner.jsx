import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export default function NShopBanner() {
  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <span className="text-[var(--rb-primary)] text-xs font-bold uppercase tracking-widest">Shop Online</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-1">
            Your Hair, Your <span className="text-[var(--rb-primary)]">Style</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">Shop our full range of hair products delivered to your doorstep.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Women */}
          <Link href="/women" className="group relative rounded-3xl overflow-hidden h-80 md:h-96 block shadow-sm hover:shadow-2xl transition-all duration-400">
            <img
              src="/images/shop-women.png"
              alt="Women's Hair Products"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-8 flex items-end justify-between">
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">For Her</p>
                <h3 className="text-white text-2xl font-black leading-tight">Women's<br />Hair Products</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-[var(--rb-primary)] group-hover:border-[var(--rb-primary)] transition-all duration-300">
                <FaArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Men */}
          <Link href="/men" className="group relative rounded-3xl overflow-hidden h-80 md:h-96 block shadow-sm hover:shadow-2xl transition-all duration-400">
            <img
              src="/images/shop-men.png"
              alt="Men's Hair Products"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-8 flex items-end justify-between">
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">For Him</p>
                <h3 className="text-white text-2xl font-black leading-tight">Men's<br />Hair Products</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-[var(--rb-primary)] group-hover:border-[var(--rb-primary)] transition-all duration-300">
                <FaArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
