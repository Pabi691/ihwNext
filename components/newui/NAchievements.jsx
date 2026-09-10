import React from "react";
import { FaTrophy } from "react-icons/fa6";

const achievements = [
  { badge: "TBI 2024", title: "Times Brand Icons 2024", subtitle: "Leading Hair Replacement Center of West Bengal 2024", description: "Indian Hair World (IHW) is thrilled to be recognized as the Leading Hair Replacement Center of West Bengal 2024 by the prestigious Times Brand Icons.", image: "/images/times_brand_icons_in_2024.jpeg" },
  { badge: "IEA 2024", title: "International Excellence Award 2024", subtitle: "Best Hair Replacement Center In East Zone", description: "Indian Hair World has been recognized with the prestigious International Excellence Award 2024 for exceptional services as the Best Hair Replacement Center in the East Zone.", image: "/images/iea_award_in_2024.jpeg" },
  { badge: "GFA 2024", title: "Global Fame Award 2024", subtitle: "Best Hair Replacement Center In Kolkata", description: "Indian Hair World has been honoured with the Global Fame Award 2024 for being the Best Hair Replacement Center in Kolkata, West Bengal.", image: "/images/gfa_award_in_2024.jpeg" },
  { badge: "NPA 2022", title: "Nation Pride Award 2022", subtitle: "Best Hair Replacement Center of West Bengal", description: "Indian Hair World received the prestigious Nation Pride Award 2022 for being the Best Hair Replacement Center in West Bengal.", image: "/images/npa_award_in_2022.jpeg" },
  { badge: "BPA 2021", title: "Bengal Pride Award 2021", subtitle: "Best Hair Replacement Center of Kolkata", description: "Indian Hair World was awarded the prestigious Bengal Pride Award 2021 for its top-notch professional services in Kolkata.", image: "/images/Awards_3.jpg" },
];

export default function NAchievements() {
  return (
    <section className="py-8 md:py-12 bg-[var(--rb-dark)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-[var(--rb-heading-dark)] text-xs font-bold uppercase tracking-widest">Recognition</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-1">
            Indian Hair World <span className="text-[var(--rb-heading-dark)]">Achievements</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-md mx-auto">
            Nationally recognised for excellence in hair replacement services.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {achievements.map((a, i) => (
            <div
              key={i}
              className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-[var(--rb-primary)]/50 transition-all duration-300 flex flex-col gap-3"
            >
              {a.image && (
                <div className="w-full h-44 overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="bg-[var(--rb-primary)]/20 text-[var(--rb-heading-dark)] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {a.badge}
                  </span>
                  <FaTrophy className="w-5 h-5 text-[var(--rb-accent)]" />
                </div>
                <h3 className="text-white font-bold text-sm leading-snug">{a.title}</h3>
                <p className="text-[var(--rb-heading-dark)] text-xs font-semibold leading-snug">{a.subtitle}</p>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 flex-1">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
