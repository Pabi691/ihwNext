import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const BranchFaq = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(0); // Open first FAQ by default

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-16 mb-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-900">
          Everything you need to know about our services and branch operations.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 text-left cursor-pointer focus:outline-none"
              >
                <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#ef7f1a] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="px-6 pb-5 pt-2 text-gray-900 leading-relaxed bg-white">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BranchFaq;
