import React from "react";
import { CheckCircle2 } from 'lucide-react';

const SaltLake = () => {
  return (
    <section className="w-full">

      <section className="w-full py-14 md:py-20 px-4 md:px-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              Non Surgical Hair Replacement in Kolkata
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              Looking for a permanent solution to baldness without surgery? Indian Hair World offers advanced non surgical hair replacement in Kolkata — a painless, risk-free solution that gives you natural-looking hair in just 60 minutes.
            </p>

            <ul className="space-y-3 text-gray-700">
              <li>✓ No surgery, no stitches, no pain</li>
              <li>✓ No side effects or recovery time</li>
              <li>✓ No medication or chemicals</li>
              <li>✓ Instant results — same day transformation</li>
            </ul>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-sm">
            <p className="text-gray-700 leading-relaxed">
              Whether you're facing receding hairline, crown thinning, or complete baldness, our experts create a fully customized system that blends perfectly with your existing hair. Trusted by 15,000+ clients across Kolkata.
            </p>
          </div>

        </div>
      </section>

      {/* Why Choose Us Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Left side: Image */}
            <div className="w-full lg:w-1/2">
              <img
                src="/images/LOL02994.png"
                alt="Why Indian Hair World"
                className="w-full h-auto rounded-2xl shadow-xl object-cover"
              />
            </div>

            {/* Right side: Content */}
            <div className="w-full lg:w-1/2">

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                Why We're the Best Hair Patch Centre in Kolkata
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {[
                  "15,000+ Happy Clients",
                  "2 Branches – Lake Gardens & Salt Lake",
                  "Expert Team (8+ Years Experience)",
                  "Free Consultation",
                  "100% Natural Indian Hair",
                  "Same-Day Service"
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 hover:shadow-md transition"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#ef7f1a] flex-shrink-0" />
                    <p className="text-gray-800 text-sm md:text-base font-medium">
                      {item}
                    </p>
                  </div>
                ))}

              </div>

            </div>
          </div>
        </div>
      </div>

      <section className="w-full py-16 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            Hair Patch for Men in Kolkata – Natural & Undetectable
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              {
                title: "Skin Base",
                desc: "Ultra-thin, natural hairline, sleek finish"
              },
              {
                title: "Lace Base",
                desc: "Breathable & perfect for humid weather"
              },
              {
                title: "Mono Base",
                desc: "Strong & durable, ideal for active lifestyle"
              },
              {
                title: "Hybrid Base",
                desc: "Best balance of natural look & durability"
              }
            ].map((item, i) => (
              <div key={i} className="border rounded-xl p-5 hover:shadow-md transition">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}

          </div>

        </div>
      </section>

      <section className="w-full py-20 px-4 md:px-10 bg-[#0f172a]">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Hair Patch Price in Kolkata
            </h2>
            <p className="text-gray-400 mt-3">
              Affordable, Natural & Premium Quality Solutions
            </p>
          </div>

          {/* Table Card */}
          <div className="rounded-2xl overflow-hidden border border-gray-700 shadow-2xl backdrop-blur bg-white/5">
            <table className="w-full text-left">

              {/* Header */}
              <thead className="bg-white/10 text-gray-300 uppercase text-sm tracking-wide">
                <tr>
                  <th className="p-5">Service</th>
                  <th className="p-5">Starting At</th>
                  <th className="p-5">Includes</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="text-gray-300">
                {[
                  ["Skin Base", "₹5,999", "Patch + Fixing"],
                  ["Lace Base", "₹6,999", "Patch + Fixing"],
                  ["Mono Base", "₹7,999", "Patch + Fixing"],
                  ["Premium Mirage", "₹9,999", "Patch + Fixing"],
                  ["Full Head Wig", "₹8,999", "Wig + Styling"],
                  ["Servicing", "₹999", "Clean + Refix"]
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-700 hover:bg-white/5 transition duration-300"
                  >
                    <td className="p-5 font-medium">{row[0]}</td>

                    {/* Highlight Price */}
                    <td className="p-5 font-bold text-[#0a58ca] text-lg">
                      {row[1]}
                    </td>

                    <td className="p-5">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Highlight CTA */}
          <div className="mt-10 text-center">
            <p className="text-gray-400 mb-4">
              Get a perfect natural look with our expert fitting
            </p>
            <button onClick={() => window.open("https://wa.me/918961194044", "_blank")} className="bg-[#0a58ca] hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition">
              Book Free Consultation
            </button>
          </div>

        </div>
      </section>

      {/* <section className="w-full py-16 px-4 md:px-10">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            100% Natural Indian Human Hair
          </h2>

          <p className="text-gray-600 leading-relaxed">
            We use only 100% natural Indian human hair — ensuring realistic texture, natural movement, styling flexibility, and long-lasting results. Ethically sourced and quality-checked for premium finish.
          </p>

        </div>
      </section>

      <section className="w-full py-16 px-4 md:px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
            Hair Patch Servicing in Kolkata
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            {[
              "Cleaning & Removal",
              "Scalp Treatment",
              "Re-bonding",
              "Styling & Blending"
            ].map((step, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border text-center">
                <p className="font-medium">{step}</p>
              </div>
            ))}

          </div>

        </div>
      </section> */}

      <section className="w-full py-20 px-4 md:px-10 bg-[#020617]">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            100% Natural Indian Human Hair
          </h2>

          {/* Highlight Line */}
          <div className="w-20 h-1 bg-[#0a58ca] mx-auto mb-6 rounded-full"></div>

          <p className="text-gray-400 leading-relaxed text-lg">
            We use only <span className="text-[#0a58ca] font-semibold">100% natural Indian human hair</span> —
            ensuring realistic texture, natural movement, styling flexibility, and long-lasting results.
            Ethically sourced and quality-checked for a premium finish.
          </p>

        </div>
      </section>
      <section className="w-full py-20 px-4 md:px-10 bg-[#0f172a]">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Hair Patch Servicing in Kolkata
            </h2>
            <p className="text-gray-400 mt-3">
              Complete care for long-lasting and natural look
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-4 gap-6">

            {[
              "Cleaning & Removal",
              "Scalp Treatment",
              "Re-bonding",
              "Styling & Blending"
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur border border-gray-700 p-6 rounded-2xl text-center hover:scale-105 hover:border-[#0a58ca] transition duration-300"
              >
                {/* Step Number */}
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#0a58ca]/20 text-[#0a58ca] font-bold">
                  {i + 1}
                </div>

                <p className="text-white font-medium">{step}</p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">
          Hair Replacement Services at Our Kolkata Branch
        </h2>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Left Side: Featured Image */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24 w-full h-auto aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-gray-100 hidden lg:block">
              <img
                src="/images/menhairpatch2.jpg"
                alt="Hair Replacement Services in Salt Lake"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Mobile version spans full width but limited height */}
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md border border-gray-100 lg:hidden mb-6">
              <img
                src="/images/menhairpatch2.jpg"
                alt="Hair Replacement Services in Salt Lake"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Side: Services Grid */}
          <div className="w-full lg:w-2/3 grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Hair Patch for Men</h3>
              <p className="text-gray-900 text-sm leading-relaxed">
                Cover any partial or full bald spot with a natural, undetectable hair patch in Salt Lake. Methods: bonding, clipping, taping or weaving.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Hair Wig for Men</h3>
              <p className="text-gray-900 text-sm leading-relaxed">
                Full head hair wig for completely bald men. Washable, adjustable, lasts 1–2 years. Swim, gym and run freely — no restrictions.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Non-Surgical Replacement</h3>
              <p className="text-gray-900 text-sm leading-relaxed">
                India's #1 non-surgical hair replacement service. No surgery, no medicine, no scars. Natural result in 60 minutes.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Hair Patch for Women</h3>
              <p className="text-gray-900 text-sm leading-relaxed">
                Crown thinning, frontal hair loss or alopecia — our women's hair patch blends seamlessly. Non-surgical and painless.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Extensions & Toppers</h3>
              <p className="text-gray-900 text-sm leading-relaxed">
                Clip-in extensions, hair toppers, color strands and buns for women in Salt Lake. 100% natural Indian human hair.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Hair Patch Servicing</h3>
              <p className="text-gray-900 text-sm leading-relaxed">
                Professional hair bonding maintenance every 25–45 days at our Salt Lake branch to keep your patch looking fresh and natural.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* How it works Section */}
      <div className="py-16 bg-gray-50 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Left Side: The Steps */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 leading-tight">
                How to Get Your Hair Patch at Salt Lake — 4 Simple Steps
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ef7f1a] transition-all shadow-sm hover:shadow-md">
                  <div className="absolute top-0 right-0 bg-[#ef7f1a] text-white font-black text-3xl opacity-10 rounded-bl-2xl px-3 py-1.5 transition-opacity group-hover:opacity-20">1</div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Free consultation</h3>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    Walk into our Salt Lake branch or call +918961194044. Our expert assesses your hair loss type, density and scalp condition — completely free.
                  </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ef7f1a] transition-all shadow-sm hover:shadow-md">
                  <div className="absolute top-0 right-0 bg-[#ef7f1a] text-white font-black text-3xl opacity-10 rounded-bl-2xl px-3 py-1.5 transition-opacity group-hover:opacity-20">2</div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Select your hair patch</h3>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    Choose from our range of 100% natural Indian human hair patches — matched to your hair colour, texture and style. Starts from Rs.5999.
                  </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ef7f1a] transition-all shadow-sm hover:shadow-md">
                  <div className="absolute top-0 right-0 bg-[#ef7f1a] text-white font-black text-3xl opacity-10 rounded-bl-2xl px-3 py-1.5 transition-opacity group-hover:opacity-20">3</div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Professional fixing</h3>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    Our technician applies your hair patch in Salt Lake using your chosen method — bonding, clipping, taping or weaving. Completely painless.
                  </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ef7f1a] transition-all shadow-sm hover:shadow-md">
                  <div className="absolute top-0 right-0 bg-[#ef7f1a] text-white font-black text-3xl opacity-10 rounded-bl-2xl px-3 py-1.5 transition-opacity group-hover:opacity-20">4</div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Walk out with a new look</h3>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    Your hair patch is styled, trimmed and blended with your natural hair. The result is 100% undetectable. Total time: 60–90 minutes.
                  </p>
                </div>

              </div>
            </div>

            {/* Right Side: Image/Video */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <div className="relative w-full aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-black">
                <iframe
                  src="https://www.youtube.com/embed/e9hO6amPGxg?autoplay=0&rel=0"
                  title="Hair Patch Fixing Indian Hair World"
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default SaltLake;
