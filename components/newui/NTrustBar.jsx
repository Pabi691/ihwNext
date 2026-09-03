import React from "react";
import { FaStar, FaAward, FaTrophy, FaThumbsUp, FaFire } from "react-icons/fa6";

const badges = [
  { icon: <img src="/images/sharkDesk.jpeg" alt="Shark Tank" className="h-6 w-auto object-contain" />, text: "As Seen on Shark Tank India" },
  { icon: <FaStar className="text-yellow-400 w-4 h-4 flex-shrink-0" />, text: "Trusted by 10,000+ Customers" },
  { icon: <FaAward className="text-[var(--rb-accent)] w-4 h-4 flex-shrink-0" />, text: "Times Brand Icons 2024" },
  { icon: <FaTrophy className="text-[var(--rb-accent)] w-4 h-4 flex-shrink-0" />, text: "International Excellence Award 2024" },
  { icon: <FaTrophy className="text-[var(--rb-primary)] w-4 h-4 flex-shrink-0" />, text: "Global Fame Award 2024" },
  { icon: <FaThumbsUp className="text-[var(--rb-primary)] w-4 h-4 flex-shrink-0" />, text: "Nation Pride Award 2022" },
  { icon: <FaThumbsUp className="text-emerald-500 w-4 h-4 flex-shrink-0" />, text: "Bengal Pride Award 2021" },
  { icon: <FaFire className="text-red-400 w-4 h-4 flex-shrink-0" />, text: "No Surgery. No Side Effects." },
];

const BadgeItem = ({ icon, text }) => (
  <div className="flex-shrink-0 flex items-center gap-2.5 px-5 py-2.5 bg-white border border-gray-100 rounded-full shadow-sm mx-2">
    {icon}
    <span className="text-gray-700 text-sm font-semibold whitespace-nowrap">{text}</span>
  </div>
);

export default function NTrustBar() {
  return (
    <div className="w-full bg-gray-50 border-y border-gray-100 overflow-hidden py-4">
      <style>{`
        @keyframes nhw-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .nhw-marquee-track {
          display: flex;
          width: max-content;
          animation: nhw-marquee 35s linear infinite;
        }
        .nhw-marquee-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="nhw-marquee-track">
        {[...badges, ...badges].map((b, i) => (
          <BadgeItem key={i} icon={b.icon} text={b.text} />
        ))}
      </div>
    </div>
  );
}
