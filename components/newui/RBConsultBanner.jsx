import React from "react";
import Link from "next/link";
import { FaTruckFast, FaChevronRight } from "react-icons/fa6";

export default function RBConsultBanner() {
  return (
    <section className="w-full bg-[var(--rb-cream)] py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Link
          href="/contact-us"
          className="flex items-center justify-between gap-4 bg-white rounded-2xl px-5 py-4 md:px-8 md:py-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <span className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-[var(--rb-accent-light)]/20 flex items-center justify-center flex-shrink-0">
              <FaTruckFast className="w-4 h-4 md:w-5 md:h-5 text-[var(--rb-accent)]" />
            </span>
            <div>
              <p className="font-black text-gray-900 text-sm md:text-base">Free Consultation</p>
              <p className="text-gray-400 text-xs md:text-sm">Book your slot today</p>
            </div>
          </div>
          <FaChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
        </Link>
      </div>
    </section>
  );
}
