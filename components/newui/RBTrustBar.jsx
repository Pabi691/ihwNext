import React from "react";
import { FaLeaf, FaUserDoctor, FaWandMagicSparkles, FaArrowRotateLeft, FaShieldHalved } from "react-icons/fa6";

const STATS = [
  { icon: FaLeaf, title: "100% Natural Human Hair", subtitle: "Premium quality assured" },
  { icon: FaUserDoctor, title: "Non-Surgical Solutions", subtitle: "Safe & painless process" },
  { icon: FaWandMagicSparkles, title: "Expert Stylists", subtitle: "Professional support" },
  { icon: FaArrowRotateLeft, title: "Easy Returns", subtitle: "Hassle free returns" },
  { icon: FaShieldHalved, title: "Secure Payments", subtitle: "100% safe & secure" },
];

export default function RBTrustBar() {
  return (
    <div className="relative z-20 w-full -mt-6 md:-mt-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-[var(--rb-dark)] to-[var(--rb-primary-mid)] rounded-2xl md:rounded-3xl shadow-xl px-5 md:px-10 py-5 md:py-6">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-x-4 gap-y-4">
          {STATS.map(({ icon: Icon, title, subtitle }, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 min-w-[150px] md:min-w-0 ${i > 0 ? "md:border-l md:border-white/10 md:pl-4" : ""}`}
            >
              <span className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[var(--rb-accent-light)]" />
              </span>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs md:text-sm leading-tight md:whitespace-nowrap">{title}</p>
                <p className="text-white/50 text-[10px] md:text-xs mt-0.5 md:whitespace-nowrap">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
