import React from "react";
import { CheckCircle2, Shield, Zap, Leaf, Clock, MapPin, BadgeCheck } from 'lucide-react';

const Siliguri = () => {
  return (
    <section className="w-full">

      {/* ── 1. Best Hair Patch for Men in Siliguri ── */}
      <div className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">For Men</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                Best Hair Patch for Men in Siliguri
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Hair loss can affect confidence, appearance, and self-esteem. Our premium <strong>hair patch for men</strong> in Siliguri provides a natural and comfortable solution without surgery or medication. Whether you prefer a <strong>hair patch</strong>, a <strong>toupee for men</strong>, a <strong>hair wig for men</strong>, or a <strong>wig for men</strong> — we have the right solution for you.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Whether you have partial baldness, receding hairline, or complete crown baldness, our customized <strong>hair patches</strong> blend seamlessly with your existing hair and lifestyle. Restore your confidence with 100% natural human hair in just 60 minutes — without surgery.
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                Our hair specialists help you choose the ideal solution based on your age, hair texture, scalp condition, and styling preferences.
              </p>
              <a href="tel:+917439436698" className="inline-flex items-center gap-2 bg-[#0A3D91] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0d4db5] transition-colors">
                Book Free Consultation
              </a>
            </div>
            <div className="space-y-5">
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Benefits of Hair Patches</h3>
                <ul className="space-y-3">
                  {[
                    "Natural appearance",
                    "Lightweight and breathable",
                    "Easy maintenance",
                    "Swim, gym, and travel confidently",
                    "Immediate results",
                    "No pain or surgery",
                  ].map((b) => (
                    <li key={b} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#ef7f1a]/5 border border-[#ef7f1a]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Affordable Hair Patch Price in Siliguri</h3>
                <p className="text-gray-600 text-sm mb-3">One of the most common questions we receive is about hair patch pricing. Hair patch cost depends on:</p>
                <ul className="space-y-2 mb-4">
                  {["Hair quality", "Base material", "Hair density", "Size of bald area", "Customization requirements"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ef7f1a] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-700 mb-2">
                  At Indian Hair World Siliguri, we offer affordable solutions suitable for every budget while maintaining premium quality and natural results.
                </p>
                <p className="text-sm font-semibold text-[#0A3D91]">Book a free consultation to get a personalized quote.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Non-Surgical Hair Replacement in Siliguri ── */}
      <div className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">No Surgery Required</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Non-Surgical Hair Replacement in Siliguri
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed mb-3">
              The most trusted alternative to hair transplant in Siliguri. No surgery, no scars, no medicines, and immediate results. Our <strong>non-surgical hair replacement</strong> is the preferred <strong>hair replacement near Siliguri</strong> for men and women seeking a natural, painless solution.
            </p>
            <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
              This advanced <strong>hair replacement</strong> procedure attaches a customized hair system that perfectly matches your existing colour, texture, and density — whether you have pattern baldness, alopecia, thinning hair, or complete hair loss.
            </p>
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">Why Choose Non-Surgical Hair Replacement?</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { icon: <Shield className="w-5 h-5" />, title: "No Surgery", desc: "Zero incisions, no hospital visits, no anaesthesia required." },
              { icon: <Zap className="w-5 h-5" />, title: "Immediate Transformation", desc: "Walk in with hair loss, walk out with a full natural look in 60 minutes." },
              { icon: <Leaf className="w-5 h-5" />, title: "No Scars", desc: "Completely safe — leaves no marks or scars on the scalp." },
              { icon: <Clock className="w-5 h-5" />, title: "No Recovery Period", desc: "Return to all normal activities immediately after the procedure." },
              { icon: <CheckCircle2 className="w-5 h-5" />, title: "Safe & Painless", desc: "Suitable for all ages and all stages of hair loss, zero side effects." },
              { icon: <BadgeCheck className="w-5 h-5" />, title: "All Hair Loss Types", desc: "Works for pattern baldness, alopecia, thinning, and complete hair loss." },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  {c.icon}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{c.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How It Works ── */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 leading-tight">
                How to Get Your Hair Patch at Siliguri — 4 Simple Steps
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { n: 1, title: "Free Consultation", desc: "Walk into our Siliguri branch or call +917439436698. Our expert assesses your hair loss type, density and scalp condition — completely free." },
                  { n: 2, title: "Select Your Hair Patch", desc: "Choose from our range of 100% natural Indian human hair patches — matched to your hair colour, texture and style. Starts from ₹5,999." },
                  { n: 3, title: "Professional Fixing", desc: "Our technician applies your hair patch using your chosen method — bonding, clipping, taping or weaving. Completely painless." },
                  { n: 4, title: "Walk Out With a New Look", desc: "Your hair patch is styled, trimmed and blended with your natural hair. The result is 100% undetectable. Total time: 60–90 minutes." },
                ].map((s) => (
                  <div key={s.n} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ef7f1a] transition-all shadow-sm hover:shadow-md">
                    <div className="absolute top-0 right-0 bg-[#ef7f1a] text-white font-black text-3xl opacity-10 rounded-bl-2xl px-3 py-1.5 group-hover:opacity-20 transition-opacity">
                      {s.n}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900">{s.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img src="/images/serv_img.jpg" alt="4 Simple Steps to Get a Hair Patch in Siliguri" className="w-full h-full object-cover" />
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

      {/* ── 3. Human Hair Wigs in Siliguri for Men & Women ── */}
      <div className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Human Hair Wigs in Siliguri for Men &amp; Women
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed mb-2">
              Indian Hair World offers premium <strong>human hair wigs</strong> in Siliguri for both men and women.
            </p>
            <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Our wigs are made using ethically sourced Indian human hair, ensuring a realistic appearance, durability, and styling flexibility. Our <strong>hair wig</strong> collection includes <strong>curly hair wigs</strong>, <strong>curly wigs</strong>, lace wigs, medical wigs, and fully customized systems for every need.
            </p>
          </div>

          {/* Wig Types Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {[
              { title: "Full Wigs", desc: "Complete coverage for all stages of hair loss. Natural and undetectable for men and women." },
              { title: "Lace Wigs", desc: "Lightweight lace base for an ultra-realistic hairline and maximum breathability." },
              { title: "Medical Wigs", desc: "Specially designed for post-chemotherapy or alopecia recovery. Gentle on the scalp." },
              { title: "Curly Hair Wigs", desc: "Natural-looking curly systems matching your curl pattern, volume, and texture." },
              { title: "Fashion Wigs", desc: "Trendy styles and colours for instant transformation and confidence." },
              { title: "Customized Wigs", desc: "Bespoke wigs crafted to your exact measurements, colour, density, and style." },
            ].map((t) => (
              <div key={t.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="w-8 h-1 bg-[#0A3D91] rounded-full mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm mb-10">Each wig is designed to provide maximum comfort while maintaining a completely natural look.</p>

          {/* Wig for Women + Wig for Men subsections */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100">
              <span className="inline-block bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">For Women</span>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-4">Wig for Women in Siliguri</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Hair thinning, alopecia, chemotherapy, and hormonal changes can impact hair volume and confidence.
              </p>
              <p className="text-gray-700 leading-relaxed mb-5">
                Our <strong>wig for women</strong> collection offers beautiful, natural-looking solutions for every lifestyle.
              </p>
              <p className="text-gray-600 text-sm font-semibold mb-3">Features</p>
              <ul className="space-y-3 mb-5">
                {["Natural hairline", "Lightweight construction", "Multiple lengths and styles", "Straight, wavy, and curly options", "Custom colour matching"].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <span className="text-gray-800 text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 text-sm leading-relaxed">Our experts help women choose the perfect wig based on face shape, hair texture, and styling preferences.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">For Men</span>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-4">Wig for Men in Siliguri</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Modern <strong>wig for men</strong> solutions are designed to look completely natural and undetectable. Whether you need full or partial coverage, our customized <strong>hair wig for men</strong> provides a youthful appearance with comfort and durability.
              </p>
              <p className="text-gray-600 text-sm mb-4 font-semibold">Perfect for:</p>
              <ul className="space-y-3">
                {["Complete baldness", "Advanced hair loss", "Medical hair loss recovery", "Fashion styling", "Youthful natural appearance"].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-800 text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Hair Toppers & Hair Patches for Women in Siliguri ── */}
      <div className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="inline-block bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Women's Solutions</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                Hair Toppers &amp; Hair Patches for Women in Siliguri
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Hair toppers are ideal for women experiencing thinning hair at the crown, parting line, or front scalp area.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Unlike full <strong>hair wigs for women</strong>, toppers provide targeted coverage while blending naturally with existing hair. Perfect solutions for crown thinning, alopecia, and volume enhancement using natural Indian human hair.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits of Hair Toppers</h3>
              <ul className="space-y-3 mb-5">
                {[
                  "Natural volume enhancement",
                  "Lightweight and comfortable",
                  "Easy attachment",
                  "Ideal for early-stage hair loss",
                  "Available in human hair and synthetic options",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <span className="text-gray-800 text-sm font-medium">{b}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">Our experts help match your topper perfectly to your natural hair.</p>
            </div>
            <div className="space-y-5">
              <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Hair Patches for Women</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Our customized women's hair patches provide highly effective solutions for localized hair loss. They are designed to integrate naturally with your existing hair for a completely undetectable result.
                </p>
                <ul className="space-y-2">
                  {["Alopecia & pattern hair loss", "Post-chemotherapy recovery", "Hormonal & stress-related loss", "Frontal and crown thinning", "Custom colour & density matching"].map((i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Toupee for Men in Siliguri</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">
                  A <strong>toupee for men</strong> remains one of the most trusted solutions for men seeking natural coverage of bald areas.
                </p>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Our premium toupees are crafted using high-quality human hair and advanced base materials for maximum comfort and durability.
                </p>
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Toupee Benefits</p>
                <ul className="space-y-2">
                  {["Natural appearance", "Custom fitting", "Secure attachment", "Long-lasting performance", "Easy styling"].map((i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D91] flex-shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Indian Human Hair, Lace Hair & Hair Bundles ── */}
      <div className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Indian Human Hair, Lace Hair &amp; Hair Bundles
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Shop premium <strong>Indian hair</strong>, lace hair systems and <strong>human hair bundles</strong> sourced ethically and crafted for long-lasting natural results. The ideal choice for a <strong>hair wig for women</strong> or men requiring the most realistic <strong>lace hair</strong> systems available.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              <div className="w-10 h-1 bg-[#0A3D91] rounded-full mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Indian Human Hair in Siliguri</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Indian Hair World specializes in premium <strong>Indian human hair</strong> products sourced ethically and processed with strict quality standards.
              </p>
              <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Why Choose Indian Human Hair?</p>
              <ul className="space-y-2 mb-3">
                {["Natural shine", "Long-lasting quality", "Soft texture", "Styling flexibility", "Realistic appearance"].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D91] flex-shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 leading-relaxed">Indian human hair remains one of the most sought-after hair types worldwide due to its durability and natural look.</p>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              <div className="w-10 h-1 bg-[#ef7f1a] rounded-full mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lace Hair Systems</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                <strong>Lace hair</strong> systems are popular for the most realistic hairline possible. Lightweight construction provides exceptional breathability and an undetectable appearance for men and women.
              </p>
              <ul className="space-y-2">
                {["Front hairline restoration", "Full lace hair systems", "Men's hair replacement", "Women's hair enhancement", "Ultra-realistic appearance"].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef7f1a] flex-shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              <div className="w-10 h-1 bg-green-500 rounded-full mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Human Hair Bundles Available in Siliguri</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                We offer premium <strong>human hair bundles</strong> suitable for:
              </p>
              <ul className="space-y-2 mb-3">
                {["Hair extensions", "Wig making", "Hair volumizing", "Professional salon applications"].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 leading-relaxed">Available in multiple lengths, textures, and densities to suit every requirement.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. Synthetic Wigs & Affordable Hair Solutions in Siliguri ── */}
      <div className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Budget Friendly</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                Synthetic Wigs &amp; Affordable Hair Solutions in Siliguri
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For customers looking for budget-friendly options, we offer high-quality <strong>synthetic wigs</strong> that provide style and convenience.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Budget-friendly <strong>synthetic wigs</strong> available in various styles, lengths and colours. Our range of <strong>affordable wigs</strong> provides style and convenience for customers looking for a low-maintenance solution in Siliguri.
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                Whether you want a fashion look, a ready-to-wear style, or a lightweight solution at an accessible price point, our synthetic wig collection covers every preference and occasion.
              </p>
              <ul className="space-y-3">
                {[
                  "Affordable pricing — accessible for every budget",
                  "Ready-to-wear styles — no customization wait",
                  "Low maintenance — easy to care for",
                  "Lightweight construction — comfortable all day",
                  "Wide variety of colours, lengths and designs",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-800 text-sm font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Synthetic Wig", desc: "Various styles and colours" },
                { label: "Affordable Wigs", desc: "Budget-friendly options" },
                { label: "Fashion Wigs", desc: "Trendy ready-to-wear" },
                { label: "Short Wigs", desc: "Easy & low maintenance" },
                { label: "Long Wigs", desc: "Dramatic full length styles" },
                { label: "Coloured Wigs", desc: "Bold colour choices" },
              ].map((c) => (
                <div key={c.label} className="bg-purple-50 rounded-xl p-4 border border-purple-100 text-center">
                  <p className="font-bold text-gray-900 text-sm mb-1">{c.label}</p>
                  <p className="text-xs text-gray-500">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 7. Curly Hair Wigs & Curly Hair Pieces in Siliguri ── */}
      <div className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="inline-block bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Curly Collection</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Curly Hair Wigs &amp; Curly Hair Pieces in Siliguri
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Natural-looking <strong>curly wigs</strong> and <strong>curly hair pieces</strong> designed for volume, texture and effortless styling. Looking for a <strong>curly hair wig</strong> or <strong>curly hair piece</strong> near Siliguri? We offer premium curly hair systems designed to match natural curl patterns and provide realistic volume and texture.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our curly hair collection is available in various densities, lengths, and curl patterns for the most natural result possible.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["Curly Wigs", "Curly Hair Pieces", "Curly Toppers", "Curly Lace Wigs", "Custom Curly Systems", "Multiple Curl Patterns"].map((o) => (
                  <div key={o} className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-gray-100 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800">{o}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Services at Our Siliguri Branch</h3>
              <div className="space-y-5">
                {[
                  { title: "Hair Patch for Men", desc: "Cover any partial or full bald spot. Methods: bonding, clipping, taping or weaving. Result in 60 minutes from ₹5,999.", color: "bg-[#0A3D91]" },
                  { title: "Hair Wig for Men", desc: "Full head hair wig for completely bald men. Washable, adjustable, lasts 1–2 years. No activity restrictions.", color: "bg-[#ef7f1a]" },
                  { title: "Hair Patch for Women", desc: "Crown thinning, frontal hair loss or alopecia — our women's hair patch blends seamlessly. Non-surgical and painless.", color: "bg-pink-500" },
                  { title: "Hair Extensions & Toppers", desc: "Clip-in extensions, hair toppers, colour strands and buns. 100% natural Indian human hair.", color: "bg-green-500" },
                  { title: "Hair Patch Servicing", desc: "Professional bonding maintenance every 25–45 days to keep your patch looking fresh and natural.", color: "bg-purple-500" },
                ].map((s) => (
                  <div key={s.title} className={`border-l-4 ${s.color.replace('bg-', 'border-')} pl-4`}>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">{s.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 8. Why Choose Indian Hair World Siliguri? ── */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <img
                src="/images/LOL02994.png"
                alt="Why Indian Hair World Siliguri"
                className="w-full h-auto rounded-2xl shadow-xl object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 leading-tight">
                Why Choose Indian Hair World Siliguri?
              </h2>
              <div className="space-y-5">
                {[
                  { label: "Shark Tank India Featured", desc: "North Bengal's first non-surgical center with national TV credibility and investor backing." },
                  { label: "100% Human Hair", desc: "No artificial fibre, no plastic. Every hair system uses premium Indian human hair." },
                  { label: "Natural Undetectable Results", desc: "Friends and family cannot tell the difference — 100% seamless look guaranteed." },
                  { label: "10,000+ Customers Served", desc: "North Bengal's most trusted hair replacement center with thousands of happy clients." },
                  { label: "Same Day Fixing — Result in 60 Minutes", desc: "Come in with hair loss, walk out with a full natural hairstyle the same day." },
                  { label: "EMI Available from ₹5,999", desc: "Affordable monthly payment options — a fraction of the cost of a hair transplant." },
                  { label: "Open 7 Days, 11am–7pm", desc: "No appointment needed. Walk in at City Plaza, Sevoke Road anytime." },
                  { label: "Experienced Hair Specialists", desc: "Our team has helped thousands of clients regain confidence through customized hair replacement solutions." },
                  { label: "Premium Quality Products", desc: "We use high-quality human hair and advanced hair system technology." },
                  { label: "Personalized Consultation", desc: "Every client receives expert guidance based on their hair loss condition and styling goals." },
                  { label: "Natural Results", desc: "Our focus is creating completely natural and undetectable transformations." },
                  { label: "Convenient Location", desc: "Serving customers from Siliguri and surrounding North Bengal regions." },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm leading-relaxed">
                      <strong className="text-gray-900">{item.label}</strong> — {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Book Your Free Consultation Today ── */}
      <div className="bg-[#0A3D91] py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Book Your Free Consultation Today
          </h2>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-3">
            Restore your confidence with the most trusted destination for hair patch, wigs, hair toppers, toupees, lace hair systems, and non-surgical hair replacement in Siliguri.
          </p>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-8">
            Visit Indian Hair World Siliguri and discover a natural-looking hair solution designed specifically for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+917439436698" className="inline-flex items-center justify-center gap-2 bg-[#ef7f1a] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#d96f10] transition-colors text-base">
              Call +91 74394 36698
            </a>
            <a href={`https://wa.me/917439436698`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-[#0A3D91] font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-base">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* ── Areas We Serve ── */}
      <div className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Areas We Serve Near Siliguri</h2>
            <p className="text-gray-600">Serving customers from Siliguri and across North Bengal &amp; beyond</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {["Siliguri", "Matigara", "Bagdogra", "Pradhan Nagar", "Sevoke Road", "Hakim Para", "Jalpaiguri", "Kalimpong", "Darjeeling", "Kurseong", "Islampur", "North Bengal", "Sikkim"].map((area) => (
              <div key={area} className="flex items-center gap-2 bg-white border border-blue-100 rounded-full px-5 py-2 shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-[#0A3D91]" />
                <span className="text-sm font-semibold text-[#0A3D91]">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Siliguri;
