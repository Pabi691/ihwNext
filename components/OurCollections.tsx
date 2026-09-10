import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

type CollectionVideo = {
  name: string;
  src?: string;    // autoplay video
  image?: string;  // still image (used instead of a video)
  slug: string;
};

const collectionVideos: CollectionVideo[] = [
  { name: "CLIP IN BANGS", slug: "hair-bangs", src: "/videos/our-collection/CLIP IN BANGS.mp4" },
  { name: "COLOR STRANDS", slug: "hair-strands", src: "/videos/our-collection/COLOR STRANDS.mp4" },
  { name: "HAIR BUN", slug: "hair-bun", src: "/videos/our-collection/HAIR BUN.mp4" },
  { name: "HAIR EXTENSIONS", slug: "hair-extensions", src: "/videos/our-collection/HAIR EXTENSIONS.mp4" },
  { name: "WOMEN HAIR PATCH", slug: "women-hair-patch", src: "/videos/our-collection/HAIR PATCH.mp4" },
  { name: "HAIR TOPPERS", slug: "hair-toppers", src: "/videos/our-collection/HAIR TOPPER.mp4" },
  { name: "WOMEN HAIR WIG", slug: "women-hair-wig", src: "/videos/our-collection/HAIR WIG.mp4" },
];

const toTitle = (name: string) =>
  name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

const OurCollections = ({
  title,
  limit,
  viewMoreHref,
  items,
  eyebrow = "Our Collection",
}: {
  title: string;
  limit?: number;
  viewMoreHref?: string;
  items?: CollectionVideo[];
  eyebrow?: string;
}) => {
  const source = items && items.length ? items : collectionVideos;
  const displayVideos =
    typeof limit === "number" ? source.slice(0, limit) : source;
  const isFeatured = typeof limit === "number";

  if (isFeatured) {
    return (
      <section className="w-full bg-gray-950 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-[var(--site-heading-dark)] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              {eyebrow}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              {title}
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-3 max-w-md mx-auto">
              Handcrafted with precision, styled for perfection
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-5">
            {displayVideos.map((item) => (
              <Link
                key={item.name}
                href={`/${item.slug}`}
                className="group block relative overflow-hidden rounded-2xl"
                aria-label={toTitle(item.name)}
              >
                <div className="relative aspect-[3/5] md:aspect-[2/3] overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={toTitle(item.name)}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <video
                      src={encodeURI(item.src as string)}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-7">
                    <p className="text-white/60 text-[10px] md:text-xs font-semibold uppercase tracking-[0.18em] mb-1">
                      Collection
                    </p>
                    <p className="text-white text-base md:text-2xl font-bold leading-tight">
                      {toTitle(item.name)}
                    </p>
                    <span className="mt-2 md:mt-3 inline-flex items-center gap-1.5 text-white/70 text-xs md:text-sm font-medium group-hover:text-[var(--site-heading-dark)] transition-colors duration-300">
                      Shop Now{" "}
                      <FiArrowRight
                        size={13}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {viewMoreHref && (
            <div className="text-center mt-8 md:mt-10">
              <Link
                href={viewMoreHref}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 border border-white/20 text-white text-sm font-semibold rounded-full hover:bg-white hover:text-gray-950 transition-all duration-300"
              >
                Explore Full Collection{" "}
                <FiArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="w-full mx-auto">
        <h2 className="text-center text-2xl md:text-4xl font-semibold text-gray-900 tracking-tight">
          {title}
        </h2>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 border-t border-gray-200">
          {displayVideos.map((item) => (
            <Link
              key={item.name}
              href={`/${item.slug}`}
              className="group block border-b border-r border-gray-200"
              aria-label={toTitle(item.name)}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-none bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={toTitle(item.name)}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <video
                    src={encodeURI(item.src as string)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              <p className="mt-3 mb-3 text-center text-sm md:text-base text-gray-900">
                {toTitle(item.name)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurCollections;
