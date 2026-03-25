import React from "react";
import { CheckCircle2 } from 'lucide-react';

const Siliguri = () => {
  return (
    <section className="w-full">

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">
          Hair Replacement Services at Our Siliguri Branch
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Hair Patch for Men</h3>
            <p className="text-gray-900 leading-relaxed">
              Cover any partial or full bald spot with a natural, undetectable hair patch in Siliguri. Methods: bonding, clipping, taping or weaving. Result in 60 minutes from Rs.5999.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Hair Wig for Men</h3>
            <p className="text-gray-900 leading-relaxed">
              Full head hair wig for completely bald men. Washable, adjustable, lasts 1–2 years. Swim, gym and run freely — no restrictions. Available at our Siliguri branch.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Non-Surgical Hair Replacement</h3>
            <p className="text-gray-900 leading-relaxed">
              India's #1 non-surgical hair replacement service. No surgery, no medicine, no scars. Natural result in 60 minutes. Shark Tank India featured center.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Hair Patch for Women</h3>
            <p className="text-gray-900 leading-relaxed">
              Crown thinning, frontal hair loss or alopecia — our women's hair patch blends seamlessly with your natural hair. Non-surgical and painless in Siliguri.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Hair Extensions & Toppers</h3>
            <p className="text-gray-900 leading-relaxed">
              Clip-in extensions, hair toppers, color strands and buns for women in Siliguri, Jalpaiguri, and North Bengal. 100% natural Indian human hair.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Hair Patch Servicing</h3>
            <p className="text-gray-900 leading-relaxed">
              Professional hair bonding maintenance every 25–45 days at our Siliguri branch to keep your patch looking fresh and natural.
            </p>
          </div>
        </div>
      </div>

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
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 leading-tight">
                Why Indian Hair World is Siliguri's Best Hair Patch Center
              </h2>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0 mt-1" />
                <p className="text-gray-900 text-lg"><strong>As featured on Shark Tank India</strong> — the professional hair replacement center in Siliguri with national TV credibility and investor backing.</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0 mt-1" />
                <p className="text-gray-900 text-lg"><strong>5-time nationally award winning</strong> — Times Brand Icons 2024, IEA 2024, GFA 2024, NPA 2022 and BPA 2021.</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0 mt-1" />
                <p className="text-gray-900 text-lg"><strong>100% natural Indian human hair</strong> — no artificial fibre, no plastic, no synthetic material. Every hair patch is made from premium Indian human hair.</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0 mt-1" />
                <p className="text-gray-900 text-lg"><strong>Result in 60 minutes</strong> — come in with hair loss, walk out with a full natural hairstyle. Same-day results at our Siliguri branch.</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0 mt-1" />
                <p className="text-gray-900 text-lg"><strong>Starting at just Rs.5999 with EMI</strong> — a fraction of the cost of a hair transplant. Easy monthly payment options available.</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0 mt-1" />
                <p className="text-gray-900 text-lg"><strong>Serving all of North Bengal</strong> — Based in City Plaza, Sevoke Road. Open 7 days, 11am–7pm, no appointment needed.</p>
              </div>
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
                How to Get Your Hair Patch at Siliguri — 4 Simple Steps
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ef7f1a] transition-all shadow-sm hover:shadow-md">
                  <div className="absolute top-0 right-0 bg-[#ef7f1a] text-white font-black text-3xl opacity-10 rounded-bl-2xl px-3 py-1.5 transition-opacity group-hover:opacity-20">1</div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Free consultation</h3>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    Walk into our Siliguri branch or call +91 7439436698. Our expert assesses your hair loss type, density and scalp condition — completely free.
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
                    Our technician applies your hair patch in Siliguri using your chosen method — bonding, clipping, taping or weaving. Completely painless.
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

            {/* Right Side: Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/images/serv_img.jpg"
                  alt="4 Simple Steps to Get a Hair Patch"
                  className="w-full h-full object-cover"
                />

                {/* Floating Action Highlight */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#ef7f1a]/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-[#ef7f1a]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Result in 60 Minutes</p>
                    <p className="text-xs text-gray-500">Fast & Painless</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default Siliguri;
