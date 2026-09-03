import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

const services = [
  { service_name: "Hair Replacement", imgSrc: "/images/hair-replacement.png", btnLink: "/services", description: "Natural, undetectable hair replacement systems that restore confidence instantly." },
  { service_name: "Hair Bonding", imgSrc: "/images/hair-bonding.png", btnLink: "/services", description: "Professional bonding techniques for a secure, long-lasting natural look." },
  { service_name: "Hair Patches", imgSrc: "/images/hair-patches.jpg", btnLink: "/services", description: "Custom hair patches designed to match your natural hair color and texture." },
  { service_name: "Hair Wigs & Extensions", imgSrc: "/images/wig-extension.png", btnLink: "/services", description: "Premium quality wigs and extensions for volume, length, and style." },
];

export default function NServices() {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-[var(--rb-primary)] text-xs font-bold uppercase tracking-widest">What We Offer</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-1">
            Our Popular <span className="text-[var(--rb-primary)]">Services</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-lg mx-auto">
            From hair patches to full wigs — we have a complete solution for every hair concern.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <Link
              key={i}
              href={s.btnLink}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-gray-50">
                <img
                  src={s.imgSrc}
                  alt={s.service_name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={e => { e.currentTarget.src = "/images/noimage.jpg"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--rb-dark)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {/* Content */}
              <div className="p-5">
                <h3 className="text-gray-900 font-bold text-base mb-2 group-hover:text-[var(--rb-primary)] transition-colors">{s.service_name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{s.description}</p>
                <span className="inline-flex items-center gap-1.5 text-[var(--rb-primary)] text-xs font-bold group-hover:gap-2.5 transition-all">
                  Learn More <FaArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
