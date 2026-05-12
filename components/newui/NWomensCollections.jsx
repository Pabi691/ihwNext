import React from "react";
import Link from "next/link";
import { FaArrowRight, FaPlay } from "react-icons/fa6";

const collections = [
  { name: "Clip In Bangs", videoFile: "/videos/our-collection/bangs.mp4", poster: "/images/shop-women.png", link: "/women" },
  { name: "Color Strands", videoFile: "/videos/our-collection/color-strands.mp4", poster: "/images/shop-women.png", link: "/women" },
  { name: "Hair Bun", videoFile: "/videos/our-collection/hair-bun.mp4", poster: "/images/shop-women.png", link: "/women" },
  { name: "Hair Extensions", videoFile: "/videos/our-collection/hair-extensions.mp4", poster: "/images/shop-women.png", link: "/women" },
  { name: "Women Hair Patch", videoFile: "/videos/our-collection/women-hair-patch.mp4", poster: "/images/shop-women.png", link: "/women" },
  { name: "Hair Toppers", videoFile: "/videos/our-collection/hair-toppers.mp4", poster: "/images/shop-women.png", link: "/women" },
  { name: "Women Hair Wig", videoFile: "/videos/our-collection/women-hair-wig.mp4", poster: "/images/shop-women.png", link: "/women" },
];

function CollectionCard({ item }) {
  return (
    <Link href={item.link} className="group relative block rounded-2xl overflow-hidden aspect-[3/4] bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <video
        src={item.videoFile}
        poster={item.poster}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
        <h3 className="text-white font-bold text-sm leading-tight">{item.name}</h3>
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#04A9FF] transition-colors">
          <FaArrowRight className="w-3 h-3 text-white" />
        </div>
      </div>
    </Link>
  );
}

export default function NWomensCollections() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="text-[#04A9FF] text-xs font-bold uppercase tracking-widest">For Her</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-1">
              Women's <span className="text-[#04A9FF]">Collections</span>
            </h2>
          </div>
          <Link href="/women" className="inline-flex items-center gap-2 text-[#04A9FF] font-bold text-sm hover:gap-3 transition-all">
            View All <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-4 lg:grid-cols-7 md:overflow-visible">
          {collections.map((item, i) => (
            <div key={i} className="flex-shrink-0 w-[150px] md:w-auto">
              <CollectionCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
