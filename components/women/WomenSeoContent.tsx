"use client"
import React, { useState } from 'react';
import { CheckCircle2, ChevronDown } from 'lucide-react';

const faqData = [
  {
    q: "What is a hair topper and who should use it?",
    a: "A hair topper is a small hairpiece that clips onto your existing hair to cover thinning areas on the top or crown. It's perfect for women with thinning hair who don't need a full wig."
  },
  {
    q: "How much does a hair topper for women cost in Kolkata?",
    a: "Hair topper price starts from ₹5,999 at Indian Hair World. Price depends on size, hair length, and base type."
  },
  {
    q: "How long do hair extensions last?",
    a: "Depending on the type, hair extensions last from 3 months (clip-in) to 6-8 months (tape-in/bonded). With proper care, natural hair extensions can be reused."
  },
  {
    q: "Is a ladies hair patch noticeable?",
    a: "Not at all. Our ladies hair patch uses a thin, skin-like base and is perfectly matched to your natural hair, making it completely invisible."
  },
  {
    q: "Can I style/color my hair topper or wig?",
    a: "Yes! Since all our products use 100% natural human hair, you can blow-dry, curl, straighten, and even color them just like your own hair."
  },
  {
    q: "Do you offer solutions for hair loss due to chemotherapy?",
    a: "Yes, we provide comfortable, soft-base wigs and hair patches specially designed for women undergoing chemotherapy or medical treatments."
  }
];

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm hover:border-blue-200 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-4 flex justify-between items-center bg-white font-bold text-gray-900"
      >
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 text-blue-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`px-6 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export default function WomenSeoContent() {
  return (
    <div className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 space-y-20">

        {/* Top 4 Sections: Topper, Extensions, Patch, Wig */}
        <div className="space-y-16">
          {/* Topper */}
          <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-800 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
            <div className="w-full md:w-1/2 rounded-[2rem] overflow-hidden aspect-[4/3] relative group">
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors z-10" />
              <img src="/images/newhairtopperfemale.jpg" alt="Hair Topper for Women" className="object-cover object-top w-full h-full transform group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full md:w-1/2 space-y-5">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Hair Topper for Women <br/><span className="text-blue-500 md:text-2xl text-xl mt-1 block">The #1 Solution for Thinning Hair</span>
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                A hair topper is the most natural and lightweight solution for women experiencing thinning hair or hair loss at the crown area. Unlike a full wig, a hair topper for women blends seamlessly with your existing hair, adding instant volume and coverage. At Indian Hair World, our toppers are handmade with 100% natural human hair — lightweight, breathable, and completely undetectable.
              </p>
              <h3 className="font-bold text-white text-lg">Types of Hair Toppers We Offer:</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Silk top hair topper — most natural scalp appearance</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Mono-filament hair topper — breathable & durable</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Clip-in hair topper — easy to wear daily</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Custom hair topper — matched to your hair color</li>
              </ul>
              <p className="text-gray-400 text-sm mt-2">
                Shop hair toppers for women at Indian Hair World — Kolkata's most trusted hair topper shop with free trial and expert fitting.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Hair topper Kolkata — Indian Hair World offers the best selection starting ₹5,999 at our Lake Gardens and Salt Lake branches.
              </p>
            </div>
          </div>

          {/* Extension */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
            <div className="w-full md:w-1/2 rounded-[2rem] overflow-hidden aspect-[4/3] relative group">
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors z-10" />
              <img src="/images/extensionwomen.jpg" alt="Hair Extension for Women" className="object-cover object-top w-full h-full transform group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full md:w-1/2 space-y-5">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Hair Extension for Women in Kolkata <br/><span className="text-blue-600 md:text-2xl text-xl mt-1 block">Add Length & Volume Instantly</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Want longer, fuller hair without the wait? Our hair extensions are made from 100% natural human hair, giving you a flawless, natural look. Choose from:
              </p>
              <ul className="space-y-3 text-gray-700 mb-4">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Clip-in hair extensions — easy on, easy off</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Tape-in hair extensions — semi-permanent, 6-8 weeks</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Micro-ring hair extensions — no heat, no glue</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Keratin bonded extensions — long-lasting & seamless</li>
              </ul>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Clip-In Hair Extensions in Kolkata — Starting ₹3,999</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our clip in hair extensions in Kolkata are the easiest way to add instant length and volume — no glue, no heat, no damage. Simply clip in and go. Available in 14", 18", and 22" lengths across 20+ natural shades, matched to your existing hair. Visit our Lake Gardens or Salt Lake store for a free colour match.
                </p>
              </div>
              <div className="inline-block bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm">
                <p className="text-blue-800 text-sm font-bold">
                  Available in all lengths, colors, and textures at the best price in Kolkata.
                </p>
              </div>
              <p className="text-gray-600 text-sm mt-3">
                Visit our hair extensions shop in Kolkata at Lake Gardens or Salt Lake — walk in for a free trial, no appointment needed.
              </p>
            </div>
          </div>

          {/* Patch */}
          <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-800 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
            <div className="w-full md:w-1/2 rounded-[2rem] overflow-hidden aspect-[4/3] relative group bg-slate-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors z-10" />
              <img src="/images/hairpatchwomen (1).jpg" alt="Ladies Hair Patch" className="object-cover object-top w-full h-full transform group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full md:w-1/2 space-y-5">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Ladies Hair Patch <br/><span className="text-blue-500 md:text-2xl text-xl mt-1 block">Natural Coverage for Hair Loss</span>
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                Our ladies hair patch is designed for women experiencing hair loss or bald patches in specific areas. Each hair patch for women is custom-made to match your natural hair perfectly — giving you a confident, worry-free look.
              </p>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 text-lg">Ideal for:</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div> Alopecia & medical hair loss</li>
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div> Post-chemotherapy hair recovery</li>
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div> Thinning at crown or parting area</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Wig */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
            <div className="w-full md:w-1/2 rounded-[2rem] overflow-hidden aspect-[4/3] relative group bg-gray-100 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors z-10" />
              <img src="/images/women1.png" alt="Hair Wig for Women" className="object-cover object-top w-full h-full transform group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full md:w-1/2 space-y-5">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Hair Wigs for Women in Kolkata <br/><span className="text-blue-600 md:text-2xl text-xl mt-1 block">Complete Transformation</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Explore our full range of wigs for women — from natural everyday wigs to glamorous fashion styles, all made with 100% real human hair.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Explore our stunning collection of hair wigs for women — from everyday natural wigs to glamorous fashion wigs:
              </p>
              <ul className="space-y-4 text-gray-700 font-medium">
                <li className="flex items-start gap-3 bg-gray-50/50 p-3 rounded-xl hover:bg-blue-50 transition-colors"><CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" /> Full lace wig — 360° natural hairline</li>
                <li className="flex items-start gap-3 bg-gray-50/50 p-3 rounded-xl hover:bg-blue-50 transition-colors"><CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" /> Front lace wig — realistic front hairline</li>
                <li className="flex items-start gap-3 bg-gray-50/50 p-3 rounded-xl hover:bg-blue-50 transition-colors"><CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" /> Headband wig — no glue, easy to wear</li>
                <li className="flex items-start gap-3 bg-gray-50/50 p-3 rounded-xl hover:bg-blue-50 transition-colors"><CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" /> Custom wig — made to your specifications</li>
              </ul>
              <div className="px-5 border-l-4 border-blue-400 py-2">
                <p className="text-gray-600 italic text-sm font-medium">
                  Every wig for women is crafted with natural human hair for realistic movement and styling flexibility.
                </p>
              </div>
              <p className="text-gray-600 text-sm">
                Our ladies wig collection includes full lace, front lace, headband, and custom wigs — all made from 100% natural human hair.
              </p>
            </div>
          </div>
        </div>

        {/* Data Tables Section */}
        <div className="grid lg:grid-cols-2 gap-12 mt-20">
          {/* Table 1: Problem vs Solution as sleek cards */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Women Hair Loss — <span className="text-blue-600">Solutions</span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Women hair loss can happen due to hormonal changes, stress, PCOD, postpartum, or medical conditions. The good news — you don't need surgery. Our non-surgical solutions include:
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-5 bg-blue-50/50 hover:bg-blue-50 rounded-2xl border border-blue-100 transition-colors">
                <span className="text-gray-700 font-medium w-1/2">Thinning on top/crown</span>
                <span className="font-bold text-blue-600 w-1/2 text-right">Hair Topper</span>
              </div>
              <div className="flex justify-between items-center p-5 bg-blue-50/50 hover:bg-blue-50 rounded-2xl border border-blue-100 transition-colors">
                <span className="text-gray-700 font-medium w-1/2">Specific bald spot</span>
                <span className="font-bold text-blue-600 w-1/2 text-right">Ladies Hair Patch</span>
              </div>
              <div className="flex justify-between items-center p-5 bg-blue-50/50 hover:bg-blue-50 rounded-2xl border border-blue-100 transition-colors">
                <span className="text-gray-700 font-medium w-1/2">Overall thinning/full coverage</span>
                <span className="font-bold text-blue-600 w-1/2 text-right">Women Hair Wig</span>
              </div>
              <div className="flex justify-between items-center p-5 bg-blue-50/50 hover:bg-blue-50 rounded-2xl border border-blue-100 transition-colors">
                <span className="text-gray-700 font-medium w-1/2">Want extra length/volume</span>
                <span className="font-bold text-blue-600 w-1/2 text-right">Hair Extension</span>
              </div>
            </div>
            <p className="mt-8 text-gray-600 text-sm italic border-l-2 border-blue-300 pl-4">
              <span className="font-bold text-gray-900">Book a free private consultation</span> at Indian Hair World to find the right solution.
            </p>
          </div>

          {/* Table 2: Pricing */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Hair Topper & Wig <span className="text-blue-600">Price in Kolkata</span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We offer the most competitive pricing for women's premium hair replacement solutions:
            </p>
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900">
                    <th className="p-5 font-bold border-b border-blue-200 uppercase text-xs tracking-wider">Product</th>
                    <th className="p-5 font-bold border-b border-blue-200 text-right uppercase text-xs tracking-wider">Starting Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-5 text-gray-700 font-medium">Hair Topper for Women</td>
                    <td className="p-5 font-extrabold text-[#ef7f1a] text-right text-lg">₹5,999</td>
                  </tr>
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-5 text-gray-700 font-medium">Clip-in Hair Extension</td>
                    <td className="p-5 font-extrabold text-[#ef7f1a] text-right text-lg">₹3,999</td>
                  </tr>
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-5 text-gray-700 font-medium">Ladies Hair Patch</td>
                    <td className="p-5 font-extrabold text-[#ef7f1a] text-right text-lg">₹4,999</td>
                  </tr>
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-5 text-gray-700 font-medium">Full Wig for Women</td>
                    <td className="p-5 font-extrabold text-[#ef7f1a] text-right text-lg">₹9,999</td>
                  </tr>
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-5 text-gray-700 font-medium">Custom Hair Topper</td>
                    <td className="p-5 font-extrabold text-[#ef7f1a] text-right text-lg">₹8,999</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-8 text-gray-500 text-sm text-center">
              *Exact pricing varies by length, density & customization. <br className="hidden md:block"/> Contact us for a precise quote.
            </p>
          </div>
        </div>

        {/* Why Trust Us & FAQs */}
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Why Trust Us */}
          <div className="lg:col-span-4 bg-gray-900 text-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-extrabold mb-8 tracking-tight">
              Why Women Trust Indian Hair World
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a]" /> 100% Natural Human Hair products</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a]" /> Private consultation rooms for women</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a]" /> Free trial before purchase</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a]" /> Expert female stylists available</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a]" /> Custom matching — hair color, texture & density</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a]" /> Affordable prices — best in Kolkata</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a]" /> After-sale maintenance & styling support</li>
            </ul>
          </div>

          {/* FAQs */}
          <div className="lg:col-span-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
              ❓ FAQs — Hair Topper, Extensions & Wigs for Women
            </h2>
            <div>
              {faqData.map((faq, idx) => (
                <AccordionItem key={idx} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
