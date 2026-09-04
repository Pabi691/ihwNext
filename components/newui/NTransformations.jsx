import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

const works = [
  { work_name: "Hair Transformation 1", imgSrc: "/images/our-work-img1.jpg" },
  { work_name: "Hair Transformation 2", imgSrc: "/images/our-work-img2.jpg" },
  { work_name: "Hair Transformation 3", imgSrc: "/images/our-work-img3.jpg" },
  { work_name: "Hair Transformation 4", imgSrc: "/images/our-work-img4.jpg" },
];

export default function NTransformations() {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="text-[var(--rb-heading)] text-xs font-bold uppercase tracking-widest">Before &amp; After</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-1">
              Remarkable <span className="text-[var(--rb-heading)]">Transformations</span>
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md">Real results from real clients. See what's possible.</p>
          </div>
          <Link href="/services" className="inline-flex items-center gap-2 text-[var(--rb-heading)] font-bold text-sm hover:gap-3 transition-all">
            View All Works <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {works.map((work, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                i === 1 ? "md:row-span-2 md:h-auto" : "aspect-square"
              }`}
            >
              <img
                src={work.imgSrc}
                alt={work.work_name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={e => { e.currentTarget.src = "/images/noimage.jpg"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs font-bold">{work.work_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
