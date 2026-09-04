import React from "react";

const team = [
  { name: "Soham Chakraborty", role: "Chairman & Founder", image: "/images/Soham-Chakraborty.jpg", note: "Founded IHW in 2015 after personally overcoming hair loss." },
  { name: "Sayak Chakraborty", role: "Chief Executive Officer", image: "/images/Sayak-Chakraborty.jpg", note: "Drives operations and brand growth across all branches." },
  { name: "Sudipto Ghosh", role: "Co-Founder", image: "/images/Sudipto-ghosh.jpg", note: "Leads technical excellence and client satisfaction." },
  { name: "Saheb Ghosh", role: "Co-Owner", image: "/images/saheb-ghosh.jpg", note: "Oversees customer relations and branch management." },
];

export default function NTeam() {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end mb-8">
          <div>
            <span className="text-[var(--rb-heading)] text-xs font-bold uppercase tracking-widest">Leadership</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-1">
              Who <span className="text-[var(--rb-heading)]">We Are</span>
            </h2>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Indian Hair World is built by a passionate team that believes everyone deserves to feel confident. Our leaders combine deep expertise with genuine empathy for every client.
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div key={i} className="group text-center">
              <div className="relative overflow-hidden rounded-3xl mb-4 aspect-[3/4] bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={e => { e.currentTarget.src = "/images/noimage.jpg"; }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[var(--rb-primary)]/80 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs font-medium leading-relaxed">{member.note}</p>
                </div>
              </div>
              <h3 className="text-gray-900 font-black text-sm uppercase tracking-wide">{member.name}</h3>
              <p className="text-[var(--rb-heading)] text-xs font-semibold mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
