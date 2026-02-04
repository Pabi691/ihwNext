import React from "react";

const teamMembers = [
  {
    name: "Soham Chakraborty",
    role: "Chairman",
    image:
      "/images/Soham-Chakraborty.jpg",
  },
  {
    name: "Sayak Chakraborty",
    role: "CEO",
    image:
      "/images/Sayak-Chakraborty.jpg",
  },
  {
    name: "Sudipto Ghosh",
    role: "Co Founder",
    image:
      "/images/Sudipto-ghosh.jpg",
  },
  {
    name: "Saheb Ghosh",
    role: "Co Owner",
    image:
      "/images/saheb-ghosh.jpg",
  },
];

const WhoWeAre = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* Top Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14 items-center">
          <h2 className="text-4xl md:text-5xl font-bold italic">
            WHO{" "}
            <span className="text-white [-webkit-text-stroke:1.5px_black]">
              WE ARE
            </span>
          </h2>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Indian Hair World offers top-quality, non-surgical hair replacement
            services in Kolkata. Our experienced team uses the finest Indian hair
            to create natural-looking patches and wigs.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="overflow-hidden rounded-lg shadow-md">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                {member.name}
              </h3>
              <p className="text-sm text-gray-600">
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
