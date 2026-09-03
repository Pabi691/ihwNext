import React from "react";
import { FaPhone, FaWhatsapp, FaLeaf, FaHeadset, FaLock } from "react-icons/fa6";

const FEATURES = [
  { icon: FaLeaf, label: "100% Natural Hair" },
  { icon: FaHeadset, label: "Expert Support" },
  { icon: FaLock, label: "Secure Checkout" },
];

const AVATAR_INITIALS = ["A", "R", "S", "M"];

export default function RBHero() {
  return (
    <section className="relative w-full bg-[var(--rb-cream)]">
      {/* decorative white abstract rings — own clipped box so it can never
          widen the page's scrollable area, independent of the circle's
          vertical overflow below (which must stay unclipped) */}
      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[520px] overflow-hidden pointer-events-none">
        <svg className="absolute right-0 w-[480px] h-[480px] top-1/2 -translate-y-1/2" viewBox="0 0 400 400" fill="none" aria-hidden>
          {[60, 100, 140, 180, 220].map((r, i) => (
            <circle key={r} cx="200" cy="200" r={r} stroke="white" strokeOpacity={0.9 - i * 0.12} strokeWidth="2" />
          ))}
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 items-start gap-10 lg:gap-8 pt-10 pb-0 lg:pt-16 lg:pb-0">
        {/* LEFT — content */}
        <div className="relative z-10 text-center lg:text-left">
          <p className="text-gray-500 text-xl md:text-2xl font-medium mb-1">Celebrate</p>
          <h1 className="text-5xl md:text-6xl font-black leading-[1.05] text-[var(--rb-primary)]">Raksha</h1>
          <h1 className="text-5xl md:text-6xl font-black leading-[1.05] text-gray-900 mb-5">Bandhan</h1>
          <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto lg:mx-0 mb-6">
            Instant confidence, instant style — premium hair patches &amp; non-surgical replacement, tailored just for you.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mb-7">
            {FEATURES.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2 text-gray-600 text-sm font-medium">
                <span className="w-7 h-7 rounded-full bg-[var(--rb-primary)]/10 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-[var(--rb-primary)]" />
                </span>
                {label}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-7">
            <a
              href="tel:+917980221032"
              className="inline-flex items-center justify-center gap-2.5 bg-[var(--rb-primary)] hover:bg-[var(--rb-primary-hover)] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
            >
              <FaPhone className="w-4 h-4" /> Book Free Consultation
            </a>
            <a
              href="https://wa.me/917980221032?text=Hello%20Indian%20Hair%20World%2C%20I%20would%20like%20to%20inquire%20about%20your%20Raksha%20Bandhan%20offer."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
            >
              <FaWhatsapp className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>

          {/* Avatars + count */}
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="flex -space-x-3">
              {AVATAR_INITIALS.map((letter, i) => (
                <span
                  key={letter}
                  className="w-9 h-9 rounded-full border-2 border-white bg-[var(--rb-primary)] text-white text-xs font-bold flex items-center justify-center"
                  style={{ zIndex: AVATAR_INITIALS.length - i }}
                >
                  {letter}
                </span>
              ))}
            </div>
            <span className="text-gray-700 text-sm font-semibold">10,000+ Happy Customers</span>
          </div>
        </div>

        {/* RIGHT — image */}
        <div className="relative flex justify-center lg:justify-end">
          {/* decorative solid circle — extends past the photo's bottom so it
              visually continues behind the trust bar overlapping below */}
          <div
            className="absolute left-1/2 top-[6%] -translate-x-1/2 w-[92%] h-[102%] rounded-full bg-[var(--rb-primary)]"
            aria-hidden
          />

          <div className="relative w-full max-w-md lg:max-w-none">
            <img
              src="/images/bannerIhw.png"
              alt="Celebrate Raksha Bandhan with Indian Hair World"
              className="relative z-10 w-[88%] mx-auto block h-[440px] md:h-[520px] object-cover object-top"
              onError={e => { e.currentTarget.src = "/images/noimage.jpg"; }}
            />

            {/* Floating badge — trusted by (centered, over the gap between the two people) */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-white rounded-2xl shadow-xl px-4 py-3 text-center whitespace-nowrap">
              <p className="text-[var(--rb-accent)] text-[10px] font-bold uppercase tracking-wide">Trusted By</p>
              <p className="text-gray-900 text-sm font-black">Vindu Dara Singh</p>
            </div>

            {/* Floating badge — EMI (right side, mid-height) */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-10 z-20 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2">
              <span className="text-gray-500 text-[10px] font-bold leading-tight">No Cost EMI<br />Available</span>
              <img src="/images/bajaj.png" alt="Bajaj Finserv" className="h-6 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
