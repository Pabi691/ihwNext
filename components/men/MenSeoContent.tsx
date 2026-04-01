"use client"
import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, MapPin } from 'lucide-react';

const faqData = [
  {
    q: "How much does a hair patch for men cost in Kolkata?",
    a: "A hair patch for men starts from ₹4,999 at Indian Hair World. Price depends on hair quality, base size, and customization. Contact us for a detailed price list."
  },
  {
    q: "Is a hair patch for men noticeable?",
    a: "Not at all. Our premium men hair patches are made with a thin, skin-like base and 100% natural hair, making them completely undetectable — even from close range."
  },
  {
    q: "How long does a men's hair patch last?",
    a: "A high-quality hair patch for men lasts 6 months to 1 year with proper care. We also provide replacement and maintenance services."
  },
  {
    q: "What is the difference between a hair patch and a hair wig for men?",
    a: "A hair patch covers a specific bald area (top, front, crown), while a hair wig for men covers the entire head. Both use natural human hair and look completely real."
  },
  {
    q: "Can I shower or swim with a hair patch?",
    a: "Yes! Our waterproof hair patches and bonding solutions allow you to shower, swim, and exercise without any issues."
  },
  {
    q: "Do you offer home service for hair patch fitting in Kolkata?",
    a: "Currently, we provide hair patch fitting at our Kolkata center for the best results. Contact us to book an appointment."
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

export default function MenSeoContent() {
  return (
    <div className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 space-y-20">

        {/* Top 4 Sections: Men's Solutions */}
        <div className="space-y-16">
          
          {/* Section 1: Why Hair Patch (Dark) */}
          <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-800 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
            <div className="w-full md:w-1/2 rounded-[2rem] overflow-hidden aspect-[4/3] relative group">
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors z-10" />
              <img src="/images/menpatch4.jpg" alt="Men's Hair Patch" className="object-cover object-top w-full h-full transform group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full md:w-1/2 space-y-5">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Why Hair Patch is the Best Solution <br/><span className="text-blue-500 md:text-2xl text-xl mt-1 block">For Men's Hair Loss</span>
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                A hair patch for men is the fastest, safest, and most affordable way to restore a full head of hair — without surgery. Unlike transplants, a men hair patch requires no downtime, no side effects, and delivers instant results. At Indian Hair World, our hair patches are crafted with 100% natural human hair for a completely realistic look.
              </p>
            </div>
          </div>

          {/* Section 2: Types & Options (Light) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
            <div className="w-full md:w-1/2 rounded-[2rem] overflow-hidden aspect-[4/3] relative group">
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors z-10" />
              <img src="/images/menhair4.jpg" alt="Types of Hair Patch for Men" className="object-cover object-top w-full h-full transform group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full md:w-1/2 space-y-5">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Our Hair Patch for Men <br/><span className="text-blue-600 md:text-2xl text-xl mt-1 block">Types & Options</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                We offer a wide variety of hair patches for men to suit every need:
              </p>
              <ul className="space-y-3 text-gray-700 mb-4">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> <span className="font-bold">Front hair patch</span> – Ideal for receding hairline</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> <span className="font-bold">Top/crown hair patch</span> – For bald spots on top</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> <span className="font-bold">Full head hair patch</span> – Complete coverage solution</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> <span className="font-bold">Custom hair patch</span> – Tailored to exact shape & density</li>
              </ul>
              <div className="inline-block bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm">
                <p className="text-blue-800 text-sm font-bold">
                  Every piece is lightweight, breathable, and designed for daily comfort.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Hair Wig (Dark) */}
          <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-800 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
            <div className="w-full md:w-1/2 rounded-[2rem] overflow-hidden aspect-[4/3] relative group bg-slate-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors z-10" />
              <img src="/images/shop-men.png" alt="Hair Wig for Men" className="object-cover object-top w-full h-full transform group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full md:w-1/2 space-y-5">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Hair Wig for Men <br/><span className="text-blue-500 md:text-2xl text-xl mt-1 block">Full Coverage Solutions</span>
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                If you're looking for a complete transformation, our hair wig for men collection offers full lace wigs, mono-filament wigs, and skin-base wigs. Each wig for men is handcrafted with natural hair, giving you a realistic hairline and natural movement.
              </p>
            </div>
          </div>

          {/* Section 4: Fitting & Maintenance (Light) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
            <div className="w-full md:w-1/2 rounded-[2rem] overflow-hidden aspect-[4/3] relative group bg-gray-100 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors z-10" />
              <img src="/images/hair-bonding.png" alt="Hair Patch Fitting" className="object-cover object-center w-full h-full transform group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full md:w-1/2 space-y-5">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Hair Patch Fitting <br/><span className="text-blue-600 md:text-2xl text-xl mt-1 block">& Maintenance Services</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our expert technicians provide professional hair patch fitting and hair bonding services at our Kolkata center. We ensure a seamless, secure attachment that lasts 3–4 weeks. We also offer regular maintenance and re-bonding services to keep your hair patch looking fresh.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing & Center block */}
        <div className="grid lg:grid-cols-2 gap-12 mt-20">
          
          {/* Table: Pricing */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Men Hair Patch & Wig <span className="text-blue-600">Price in Kolkata</span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              At Indian Hair World, we offer the best hair patch for men price starting from ₹4,999. Our men wig price varies based on hair length, base type, and customization.
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
                    <td className="p-5 text-gray-700 font-medium">Front Hair Patch</td>
                    <td className="p-5 font-extrabold text-[#ef7f1a] text-right text-lg">₹4,999</td>
                  </tr>
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-5 text-gray-700 font-medium">Custom Hair Patch</td>
                    <td className="p-5 font-extrabold text-[#ef7f1a] text-right text-lg">₹7,999</td>
                  </tr>
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-5 text-gray-700 font-medium">Full Head Hair Patch</td>
                    <td className="p-5 font-extrabold text-[#ef7f1a] text-right text-lg">₹9,999</td>
                  </tr>
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-5 text-gray-700 font-medium">Men's Natural Hair Wig</td>
                    <td className="p-5 font-extrabold text-[#ef7f1a] text-right text-lg">₹12,999</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-8 text-gray-500 text-sm text-center">
              *Prices may vary. Contact us for exact quotes.
            </p>
          </div>

          {/* Visit Center Block */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-xl text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ef7f1a]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
            
            <MapPin className="w-12 h-12 text-blue-500 mb-6 relative z-10" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight relative z-10 leading-tight">
              Visit Our Men's Hair Patch Center in Kolkata
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed relative z-10">
              Walk into Indian Hair World for a free consultation and trial. See, feel, and try our hair patches and wigs for men before you buy. Our private consultation rooms ensure complete comfort and confidentiality.
            </p>
            <div className="mt-10 relative z-10">
               <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 shadow-lg shadow-blue-600/30">
                 Book Free Consultation
               </button>
            </div>
          </div>
        </div>

        {/* Why Trust Us & FAQs */}
        <div className="grid lg:grid-cols-12 gap-12 mt-20">
          
          {/* Why Trust Us */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-extrabold mb-8 text-white tracking-tight">
              Why Choose Indian Hair World <br/><span className="text-blue-500">for Men's Hair Solutions?</span>
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0" /> <span className="text-gray-300">100% Natural Human Hair</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0" /> <span className="text-gray-300">Custom-made to your head shape & hair color</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0" /> <span className="text-gray-300">Undetectable & breathable base</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0" /> <span className="text-gray-300">Free trial before purchase</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0" /> <span className="text-gray-300">Professional fitting & bonding</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0" /> <span className="text-gray-300">Affordable men hair patch price — best in Kolkata</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-[#ef7f1a] flex-shrink-0" /> <span className="text-gray-300">After-sale maintenance support</span></li>
            </ul>
          </div>

          {/* FAQs */}
          <div className="lg:col-span-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
              ❓ FAQs — Hair Patch & Wig for Men
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
