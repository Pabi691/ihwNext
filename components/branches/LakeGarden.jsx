import React from "react";
import { CheckCircle2, ChevronRight } from 'lucide-react';

const LakeGarden = () => {
  return (
    <section className="w-full">

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">
          Hair Replacement Services at Our Lake Gardens, Kolkata Branch
        </h2>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Left Side: Featured Image */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24 w-full h-auto aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-gray-100 hidden lg:block">
              <img
                src="/images/hairpatchSourav.webp"
                alt="Hair Replacement Services in Lake Gardens"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Mobile version spans full width but limited height */}
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md border border-gray-100 lg:hidden mb-6">
              <img
                src="/images/hairpatchSourav.webp"
                alt="Hair Replacement Services in Lake Gardens"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Side: Services Grid */}
          <div className="w-full lg:w-2/3 grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Hair Patch for Men</h3>
              <p className="text-gray-900 text-sm leading-relaxed">
                Cover any partial or full bald spot with a natural, undetectable hair patch in Lake Gardens. Methods: bonding, clipping, taping or weaving.
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
                Crown thinning, frontal hair loss or alopecia. Women's hair patch near Tollygunge blends seamlessly. Non-surgical and painless.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Extensions & Toppers</h3>
              <p className="text-gray-900 text-sm leading-relaxed">
                Clip-in extensions, hair toppers, color strands and buns for women in Lake Gardens, Gariahat and Behala.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">Hair Patch Servicing</h3>
              <p className="text-gray-900 text-sm leading-relaxed">
                Professional hair bonding maintenance every 25–45 days at our Lake Gardens branch to keep your patch looking fresh and natural.
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
                How to Get Your Hair Patch at Lake Gardens — 4 Simple Steps
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ef7f1a] transition-all shadow-sm hover:shadow-md">
                  <div className="absolute top-0 right-0 bg-[#ef7f1a] text-white font-black text-3xl opacity-10 rounded-bl-2xl px-3 py-1.5 transition-opacity group-hover:opacity-20">1</div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Free consultation</h3>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    Walk into our Lake Gardens branch or call +91 7980221032. Our expert assesses your hair loss type, density and scalp condition — completely free.
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
                    Our technician applies your hair patch in Lake Gardens using your chosen method — bonding, clipping, taping or weaving. Completely painless.
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
                Why Indian Hair World Lake Gardens is Kolkata's Best Hair Patch Center
              </h2>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0 mt-1" />
                <p className="text-gray-900 text-lg"><strong>As featured on Shark Tank India</strong> — the only hair replacement center in Lake Gardens with national TV credibility and investor backing.</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0 mt-1" />
                <p className="text-gray-900 text-lg"><strong>5-time nationally award winning</strong> — Times Brand Icons 2024, IEA 2024, GFA 2024, NPA 2022 and BPA 2021. No other hair center in Kolkata has this recognition.</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0 mt-1" />
                <p className="text-gray-900 text-lg"><strong>100% natural Indian human hair</strong> — no artificial fibre, no plastic, no synthetic material. Every hair patch in Lake Gardens is made from premium Indian human hair.</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0 mt-1" />
                <p className="text-gray-900 text-lg"><strong>Result in 60 minutes</strong> — come in with hair loss, walk out with a full natural hairstyle. Same-day results at our Lake Gardens branch near Tollygunge Metro.</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0 mt-1" />
                <p className="text-gray-900 text-lg"><strong>Starting at just Rs.5999 with EMI</strong> — a fraction of the Rs.70,000+ cost of hair transplant in Kolkata. Easy monthly payment options available.</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0 mt-1" />
                <p className="text-gray-900 text-lg"><strong>Serving all of south Kolkata</strong> — Lake Gardens, Tollygunge, Gariahat, Behala, New Alipore and Ballygunge. Open 7 days, 11am–7pm, no appointment needed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default LakeGarden;
