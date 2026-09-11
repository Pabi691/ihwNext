import React from "react";

// Optional location-specific message authored with a festival theme. The
// existing branch services, reviews, map and FAQs remain below this section.
export default function FestivalBranchIntro({ content, branchName }) {
  const heading = String(content?.heading || "").trim();
  const body = String(content?.body || "").trim();
  if (!heading && !body) return null;

  return (
    <section className="bg-[var(--rb-cream)] border-y border-[var(--rb-cream-border)] py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
        {heading && (
          <h2 className="text-2xl md:text-4xl font-black text-[var(--rb-heading)] leading-tight">
            {heading}
          </h2>
        )}
        {body && (
          <p className="mt-3 md:mt-4 text-sm md:text-base leading-relaxed text-gray-700 whitespace-pre-line max-w-3xl mx-auto">
            {body}
          </p>
        )}
        {!heading && body && <span className="sr-only">{branchName}</span>}
      </div>
    </section>
  );
}
