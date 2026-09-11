import React from "react";
import { CheckCircle2, ChevronRight, IndianRupee, Star, HeartPulse, MapPin } from 'lucide-react';

const LakeGarden = () => {
  return (
    <section className="w-full">

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-center">
          Hair Replacement Services at Our Lake Gardens, Kolkata Branch
        </h2>
        <p className="text-center text-gray-600 mb-8">Looking for hair wig Kolkata? Indian Hair World is your #1 destination.</p>
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

                <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--site-accent)] transition-all shadow-sm hover:shadow-md">
                  <div className="absolute top-0 right-0 bg-[var(--site-accent)] text-white font-black text-3xl opacity-10 rounded-bl-2xl px-3 py-1.5 transition-opacity group-hover:opacity-20">1</div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Free consultation</h3>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    Walk into our Lake Gardens branch or call +917980221032. Our expert assesses your hair loss type, density and scalp condition — completely free.
                  </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--site-accent)] transition-all shadow-sm hover:shadow-md">
                  <div className="absolute top-0 right-0 bg-[var(--site-accent)] text-white font-black text-3xl opacity-10 rounded-bl-2xl px-3 py-1.5 transition-opacity group-hover:opacity-20">2</div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Select your hair patch</h3>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    Choose from our range of 100% natural Indian human hair patches — matched to your hair colour, texture and style. Starts from Rs.5999.
                  </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--site-accent)] transition-all shadow-sm hover:shadow-md">
                  <div className="absolute top-0 right-0 bg-[var(--site-accent)] text-white font-black text-3xl opacity-10 rounded-bl-2xl px-3 py-1.5 transition-opacity group-hover:opacity-20">3</div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Professional fixing</h3>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    Our technician applies your hair patch in Lake Gardens using your chosen method — bonding, clipping, taping or weaving. Completely painless.
                  </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--site-accent)] transition-all shadow-sm hover:shadow-md">
                  <div className="absolute top-0 right-0 bg-[var(--site-accent)] text-white font-black text-3xl opacity-10 rounded-bl-2xl px-3 py-1.5 transition-opacity group-hover:opacity-20">4</div>
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
                Why Choose Our Hair Wig Shop in Kolkata?
              </h2>

              <p className="text-gray-700 text-lg leading-relaxed">
                Indian Hair World is a leading wig shop in Kolkata known for 100% natural hair wigs, personalized styling, and affordable pricing. From hair wigs for men to designer wigs for women, we cater to every need — whether it's fashion, hair loss, or medical use. We also offer custom hair patches for those looking for a lightweight, targeted solution.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Indian Hair World is the most trusted hair wig centre in Kolkata — serving Lake Gardens, Tollygunge, Gariahat and south Kolkata.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="py-20 bg-gray-50/50 border-t border-gray-100 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-orange-50/50 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-50/50 blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 group">
              <div className="w-16 h-16 bg-[var(--site-accent-tint)] text-[var(--site-accent-deep)] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--site-accent)] group-hover:text-white transition-all duration-300 shadow-sm">
                <IndianRupee className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
                Natural Hair Wig Price in Kolkata — Affordable & Transparent
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                We believe everyone deserves access to premium wigs. Our hair wig price range starts from budget-friendly options to luxury collections. We also have competitive hair patch pricing for all budgets. Visit our store or call us for a complete price list with no hidden charges.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 group">
              <div className="w-16 h-16 bg-[var(--site-accent-tint)] text-[var(--site-accent-deep)] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--site-accent)] group-hover:text-white transition-all duration-300 shadow-sm">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
                Best Hair Wig for Men & Women
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Looking for the best hair wig that looks completely natural? Our collection includes full lace wigs, front lace wigs, clip-on wigs, and custom-fitted wigs — all crafted from 100% natural human hair.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 group">
              <div className="w-16 h-16 bg-[var(--site-accent-tint)] text-[var(--site-accent-deep)] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--site-accent)] group-hover:text-white transition-all duration-300 shadow-sm">
                <HeartPulse className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
                Hair Wig for Medical & Hair Loss Solutions
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                If you're experiencing hair thinning or hair loss, our non-surgical hair replacement solutions, including natural wigs and hair patches, offer a natural, undetectable look. Our specialists at the wig center in Kolkata provide private consultations.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 group">
              <div className="w-16 h-16 bg-[var(--site-accent-tint)] text-[var(--site-accent-deep)] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--site-accent)] group-hover:text-white transition-all duration-300 shadow-sm">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
                Visit Our Wig Shop in Kolkata
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Looking for a hair wig near me in Kolkata? Visit Indian Hair World at Lake Gardens — open 7 days a week. Walk in for a free trial and experience the quality of our natural hair wigs and hair patches firsthand. All our hair wigs are made from 100% real human hair — not synthetic.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hair Wig Price Table */}
      <section className="w-full py-20 px-4 md:px-10 bg-[var(--site-deep)]">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Hair Wig Price in Kolkata
            </h2>
            <p className="text-gray-400 mt-3">
              The hair wig cost in Kolkata at Indian Hair
              World starts from
              ₹
              5,999 — with transparent pricing and no hidden charges.
            </p>
            <p className="text-gray-400 mt-3">
              Affordable, Real Human Hair — Not Synthetic
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-700 shadow-2xl backdrop-blur bg-white/5">
            <table className="w-full text-left">
              <thead className="bg-white/10 text-gray-300 uppercase text-sm tracking-wide">
                <tr>
                  <th className="p-5">Service</th>
                  <th className="p-5">Starting At</th>
                  <th className="p-5">Includes</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[
                  ["Men's Full Wig", "₹8,999", "Wig + Styling"],
                  ["Women's Full Wig", "₹7,999", "Wig + Styling"],
                  ["Full Lace Wig", "₹12,999", "Wig + Fixing"],
                  ["Premium Wig", "₹18,999", "Wig + Styling"],
                  ["Clip-On Wig", "₹5,999", "Wig only"],
                  ["Wig Servicing", "₹999", "Clean + Restyle"]
                ].map((row, i) => (
                  <tr key={i} className="border-t border-gray-700 hover:bg-white/5 transition duration-300">
                    <td className="p-5 font-medium">{row[0]}</td>
                    <td className="p-5 font-bold text-[var(--site-on-deep)] text-lg">{row[1]}</td>
                    <td className="p-5">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-400 mb-4">
              Get a perfect natural look with our expert fitting
            </p>
            <button onClick={() => window.open("https://wa.me/917980221032", "_blank")} className="bg-[var(--site-on-deep-cta)] hover:bg-[var(--site-on-deep-cta-hover)] text-white px-6 py-3 rounded-full font-semibold shadow-lg transition">
              Book Free Consultation
            </button>
          </div>

        </div>
      </section>

      {/* Buy Human Hair Near Me CTA */}
      <section className="w-full py-16 px-4 md:px-10 bg-[var(--site-accent-tint)] border-t border-orange-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Buy Human Hair Wigs & Patches Near You
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            Buy 100% natural human hair wigs and patches near you at our Lake Gardens store. Walk in for a free trial — no appointment needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => window.open("https://wa.me/917980221032", "_blank")} className="bg-[var(--site-accent)] hover:bg-[var(--site-accent-deep)] text-white px-8 py-3 rounded-full font-semibold shadow-lg transition">
              Buy Now — WhatsApp Us
            </button>
            <a href="tel:+917980221032" className="border-2 border-[var(--site-accent)] text-[var(--site-accent)] hover:bg-[var(--site-accent-tint)] px-8 py-3 rounded-full font-semibold transition text-center">
              Call to Buy
            </a>
          </div>
        </div>
      </section>

    </section>
  );
};

export default LakeGarden;
