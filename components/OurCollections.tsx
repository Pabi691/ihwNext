import React from "react";
import Link from "next/link";

type CollectionVideo = {
  name: string;
  src: string;
};

const collectionVideos: CollectionVideo[] = [
  { name: "CLIP IN BANGS", src: "/videos/our-collection/CLIP IN BANGS.mp4" },
  { name: "COLOR STRANDS", src: "/videos/our-collection/COLOR STRANDS.mp4" },
  { name: "HAIR BUN", src: "/videos/our-collection/HAIR BUN.mp4" },
  { name: "HAIR EXTENSIONS", src: "/videos/our-collection/HAIR EXTENSIONS.mp4" },
  { name: "WOMEN HAIR PATCH", src: "/videos/our-collection/HAIR PATCH.mp4" },
  { name: "HAIR TOPPERS", src: "/videos/our-collection/HAIR TOPPER.mp4" },
  { name: "WOMEN HAIR WIG", src: "/videos/our-collection/HAIR WIG.mp4" },
];

const toSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const toTitle = (name: string) =>
  name
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const OurCollections = ({ title }: { title: string }) => {
  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="w-full mx-auto">
        <h2 className="text-center text-2xl md:text-4xl font-semibold text-gray-900 tracking-tight">
          {title}
        </h2>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 border-t border-gray-200">
          {collectionVideos.map((item) => {
            const slug = toSlug(item.name);
            return (
              <Link
                key={item.name}
                href={`/${slug}`}
                className="group block border-b border-r border-gray-200"
                aria-label={toTitle(item.name)}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-none bg-gray-100">
                  <video
                    src={encodeURI(item.src)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
                <p className="mt-3 text-center text-sm md:text-base text-gray-900">
                  {toTitle(item.name)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurCollections;
