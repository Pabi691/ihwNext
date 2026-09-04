import React from "react";

const teamMembers = [
  { name: "Soham Chakraborty", role: "Chairman",   image: "/images/Soham-Chakraborty.jpg" },
  { name: "Sayak Chakraborty", role: "CEO",        image: "/images/Sayak-Chakraborty.jpg" },
  { name: "Sudipto Ghosh",     role: "Co-Founder", image: "/images/Sudipto-ghosh.jpg" },
  { name: "Saheb Ghosh",       role: "Co-Owner",   image: "/images/saheb-ghosh.jpg" },
];

const WhoWeAre = () => {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-12 md:mb-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--site-heading)] mb-3">
              Our Team
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-gray-900">
              Who <span className="text-[var(--site-heading)]">We Are</span>
            </h2>
          </div>
          <p className="text-base text-gray-600 leading-relaxed">
            Indian Hair World offers top-quality, non-surgical hair replacement
            services in Kolkata. Our experienced team uses the finest Indian hair
            to create natural-looking patches and wigs tailored to every client.
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member, i) => (
            <div key={i} className="group text-center">
              <div className="overflow-hidden rounded-xl shadow-sm mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-[340px] md:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-sm md:text-base font-bold text-gray-900 uppercase tracking-wide">
                {member.name}
              </h3>
              <p className="text-xs md:text-sm text-[var(--site-heading)] font-semibold mt-1">
                {member.role}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhoWeAre;
