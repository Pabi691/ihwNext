import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaGift } from "react-icons/fa6";
import { useFestivalTheme } from "./FestivalThemeContext";

export default function RBPromoStrip() {
  const { theme } = useFestivalTheme();
  const { promo } = theme;

  // A long label ran off the edge of a phone, so the message scrolls — but only
  // when it genuinely does not fit. Short copy stays centred and still, which is
  // why this measures rather than always animating.
  const viewportRef = useRef(null);
  const measureRef = useRef(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const check = () => {
      const vp = viewportRef.current;
      const inner = measureRef.current;
      if (!vp || !inner) return;
      setOverflowing(inner.scrollWidth > vp.clientWidth + 2);
    };
    check();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(check) : null;
    if (ro && viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", check);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, [promo.label, promo.subtitle]);

  // Blank in the CRM => no promo strip at all.
  if (!promo.label && !promo.subtitle) return null;

  const message = (
    <>
      <span className="uppercase">{promo.label}</span>
      {promo.subtitle && (
        <>
          <span
            aria-hidden
            className="inline-block align-middle mx-2 w-1 h-1 rounded-full"
            style={{ background: "var(--rb-accent)" }}
          />
          <span>{promo.subtitle}</span>
        </>
      )}
    </>
  );

  return (
    <div className="relative w-full bg-gradient-to-r from-[var(--rb-primary-mid2)] to-[var(--rb-primary)] overflow-hidden">
      <style>{`
        @keyframes rb-promo-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .rb-promo-marquee { animation: rb-promo-scroll 22s linear infinite; }
        /* Motion here is decorative, so honour a reduced-motion preference —
           the message simply sits still and clips instead. */
        @media (prefers-reduced-motion: reduce) {
          .rb-promo-marquee { animation: none; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center justify-center gap-2.5 md:gap-3 text-center relative z-10">
        {/* gold rules flanking the message, as in the reference */}
        <span
          aria-hidden
          className="block h-px w-4 sm:w-8 md:w-16 flex-shrink-0"
          style={{ background: "linear-gradient(90deg, transparent, var(--rb-accent))" }}
        />

        <FaGift className="w-4 h-4 flex-shrink-0" style={{ color: "var(--rb-accent-light)" }} />
        <span aria-hidden className="h-4 w-px flex-shrink-0 bg-white/25" />

        {/* the subtitle shows on phones too — it carries the dates */}
        <div ref={viewportRef} className="relative flex-1 min-w-0 overflow-hidden">
          <div
            className={`flex w-max text-[11px] sm:text-xs md:text-sm font-bold tracking-wide whitespace-nowrap ${
              overflowing ? "rb-promo-marquee" : "mx-auto"
            }`}
            style={{ color: "var(--rb-accent-light)" }}
          >
            <span ref={measureRef} className={overflowing ? "pr-10" : ""}>{message}</span>
            {/* second copy so the loop has no gap at the wrap point */}
            {overflowing && <span aria-hidden className="pr-10">{message}</span>}
          </div>
        </div>

        <span
          aria-hidden
          className="block h-px w-4 sm:w-8 md:w-16 flex-shrink-0"
          style={{ background: "linear-gradient(90deg, var(--rb-accent), transparent)" }}
        />
        <Link
          href="/shop"
          className="hidden md:inline-flex items-center bg-[var(--rb-accent-light)] hover:bg-white text-[var(--rb-dark)] text-[11px] font-bold px-3 py-1 rounded-full transition-colors flex-shrink-0"
        >
          Special Offers Inside
        </Link>
      </div>

      {/* decorative rakhi hanging from the top-right corner */}
      <svg
        className="hidden md:block absolute right-16 -top-2 w-24 h-24 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
      >
        <path d="M0 2 C 25 2, 50 2, 96 20" stroke="var(--rb-accent-light)" strokeWidth="1.5" strokeDasharray="2 3" />
        {/* petals */}
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="70"
            cy="26"
            rx="7"
            ry="16"
            fill="var(--rb-accent)"
            transform={`rotate(${i * 45} 70 26)`}
          />
        ))}
        <circle cx="70" cy="26" r="12" fill="var(--rb-accent-light)" />
        <circle cx="70" cy="26" r="6" fill="white" />
        <circle cx="70" cy="26" r="2.5" fill="var(--rb-primary)" />
        {/* hanging beads */}
        <circle cx="66" cy="42" r="2" fill="var(--rb-accent-light)" />
        <circle cx="70" cy="46" r="2" fill="var(--rb-accent-light)" />
        <circle cx="74" cy="42" r="2" fill="var(--rb-accent-light)" />
      </svg>

      {/* small sun-burst flourish further along the string */}
      <svg className="hidden md:block absolute right-4 top-1 w-6 h-6 pointer-events-none" viewBox="0 0 24 24" fill="none" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1="12"
            y1="12"
            x2="12"
            y2="3"
            stroke="var(--rb-accent-light)"
            strokeWidth="1.2"
            strokeLinecap="round"
            transform={`rotate(${i * 45} 12 12)`}
          />
        ))}
        <circle cx="12" cy="12" r="3" fill="var(--rb-accent-light)" />
      </svg>
    </div>
  );
}
