import React from "react";
import Link from "next/link";
import { FaChevronRight, FaMars, FaVenus, FaGift } from "react-icons/fa6";

const CARDS = [
  {
    href: "/men",
    img: "/images/mobile-app/for-him.jpg",
    Icon: FaMars,
    title: "For Him",
    subtitle: "Confidence that makes a difference",
  },
  {
    href: "/women",
    img: "/images/mobile-app/for-her.jpg",
    Icon: FaVenus,
    title: "For Her",
    subtitle: "Beautiful hair, beautiful you",
  },
  {
    href: "/shop?tag=rakhi-special",
    img: "/images/mobile-app/rakhi-special.jpg",
    Icon: FaGift,
    title: "Rakhi Special",
    subtitle: "Special offers for a special bond",
  },
];

export default function RBCategoryCards() {
  const [broken, setBroken] = React.useState({});

  return (
    <section className="w-full bg-[var(--rb-cream)] pt-8 pb-8 md:pt-14 md:pb-14">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {CARDS.map(({ href, img, Icon, title, subtitle }, i) => {
            const showImg = img && !broken[i];
            return (
              <Link
                key={title}
                href={href}
                className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* media / themed backdrop */}
                <div className="relative aspect-square md:aspect-[4/3] overflow-hidden bg-gradient-to-br from-[var(--rb-primary-mid2)] via-[var(--rb-primary-mid)] to-[var(--rb-dark)]">
                  {showImg && (
                    <img
                      src={img}
                      alt={title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={() => setBroken((b) => ({ ...b, [i]: true }))}
                    />
                  )}
                  {/* oversized icon watermark — only when there's no photo */}
                  {!showImg && (
                    <Icon className="absolute -right-3 -bottom-4 w-24 h-24 md:w-36 md:h-36 text-[var(--rb-accent)] opacity-20" />
                  )}
                  {/* badge */}
                  <span className="absolute top-2 left-2 md:top-3 md:left-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--rb-accent)] text-[var(--rb-dark)] flex items-center justify-center shadow-md">
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </span>
                </div>

                {/* label bar */}
                <div className="p-3 md:p-5 flex items-center justify-between gap-2 bg-white">
                  <div className="min-w-0">
                    <h3 className="font-black text-gray-900 text-xs md:text-base leading-tight truncate">{title}</h3>
                    <p className="text-gray-400 text-[10px] md:text-xs mt-0.5 hidden sm:block truncate">{subtitle}</p>
                  </div>
                  <span className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full border border-[var(--rb-cream-border)] flex items-center justify-center group-hover:bg-[var(--rb-primary)] group-hover:border-[var(--rb-primary)] transition-colors">
                    <FaChevronRight className="w-3 h-3 text-gray-400 group-hover:text-white" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
