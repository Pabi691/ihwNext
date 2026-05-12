import React from "react";
import { FaCircleCheck, FaPhone } from "react-icons/fa6";

const benefits = [
  "No surgery, no pain, no side effects",
  "100% natural Indian human hair",
  "Results in just 60 minutes",
  "Completely undetectable look",
  "Swim, gym, and daily activity friendly",
  "Starting at only ₹5,999/-",
];

export default function NNonSurgical() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Video */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl">
              <iframe
                loading="lazy"
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/Jts9aabnkn4?si=mPM30aKJOKRa-pZI"
                title="Non-Surgical Hair Replacement Services — Indian Hair World"
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            {/* Accent element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#04A9FF]/10 rounded-full -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#ef7f1a]/10 rounded-full -z-10" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <span className="text-[#04A9FF] text-xs font-bold uppercase tracking-widest">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Non-Surgical Hair<br />
              <span className="text-[#04A9FF]">Replacement Services</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Established in 2015, Indian Hair World started its journey with the aim of putting smiles on people's faces suffering from baldness. Our founder,{" "}
              <strong className="text-gray-900">Soham Chakraborty</strong>, himself suffered from baldness and wanted to help others.
            </p>

            {/* Benefits list */}
            <ul className="space-y-3">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                  <FaCircleCheck className="w-4 h-4 text-[#04A9FF] flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <a
              href="tel:+917980221032"
              className="inline-flex items-center gap-2.5 bg-[#04A9FF] hover:bg-[#0090dd] text-white font-bold px-7 py-4 rounded-2xl text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-[#04A9FF]/20"
            >
              <FaPhone className="w-4 h-4" /> Call for Free Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
