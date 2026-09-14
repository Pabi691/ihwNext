import React from "react";
import { FaPhone, FaArrowRight } from "react-icons/fa6";

const stats = [
  { value: "2015", label: "Founded" },
  { value: "10,000+", label: "Customers Served" },
  { value: "5", label: "Branches" },
  { value: "5", label: "National Awards" },
];

export default function NAbout() {
  return (
    <section className="py-8 md:py-12 bg-[var(--rb-dark)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
              <img
                src="/images/welcome-image.jpg"
                alt="Indian Hair World"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                <p className="text-white text-sm font-bold">Featured on Shark Tank India</p>
                <p className="text-white/60 text-xs mt-0.5">Season 4 — India's #1 Hair Replacement Brand</p>
              </div>
            </div>
            {/* Decorative dot grid */}
            <div className="absolute -top-6 -left-6 w-32 h-32 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle, var(--rb-primary) 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
          </div>

          {/* Content */}
          <div className="text-white space-y-6">
            <span className="text-[var(--rb-heading-dark)] text-xs font-bold uppercase tracking-widest">About Us</span>
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              Welcome to<br />
              <span className="text-[var(--rb-heading-dark)]">Indian Hair World</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Are you looking for the best <strong className="text-white">hair patch and hair wig in Kolkata</strong>? Look no further than Indian Hair World, where we offer top-quality non-surgical hair replacement services. Our experienced team uses only the finest Indian hair to create natural-looking hair patches and wigs that enhance your appearance.
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              Don't settle for anything less than the best. Contact us today at{" "}
              <a href="tel:+917980221032" className="text-[var(--rb-heading-dark)] font-semibold hover:underline">
                +91-7980221032
              </a>{" "}
              to learn more. Our friendly staff will be happy to assist you with a personalised consultation.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl md:text-3xl font-black text-[var(--rb-heading-dark)]">{s.value}</p>
                  <p className="text-gray-400 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <a
              href="tel:+917980221032"
              className="inline-flex items-center gap-2.5 bg-[var(--rb-primary)] hover:bg-[var(--rb-primary-hover)] text-white font-bold px-7 py-4 rounded-2xl text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-[var(--rb-primary)]/30"
            >
              <FaPhone className="w-4 h-4" /> Book Free Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
