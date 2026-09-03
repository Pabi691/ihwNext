import React from "react";
import { FaTruckFast, FaShieldHalved, FaArrowRotateLeft, FaAward } from "react-icons/fa6";

const ITEMS = [
  { icon: FaTruckFast, title: "Free Shipping", subtitle: "On orders above ₹999" },
  { icon: FaShieldHalved, title: "100% Secure Payment", subtitle: "Safe & encrypted" },
  { icon: FaArrowRotateLeft, title: "Easy Returns", subtitle: "Hassle free returns" },
  { icon: FaAward, title: "Top Rated", subtitle: "4.9/5 by customers" },
];

export default function RBQuickTrustStrip() {
  return (
    <div className="w-full bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ITEMS.map(({ icon: Icon, title, subtitle }, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-[var(--rb-primary)]/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[var(--rb-primary)]" />
              </span>
              <div className="min-w-0">
                <p className="text-gray-900 font-bold text-xs md:text-sm leading-tight">{title}</p>
                <p className="text-gray-400 text-[10px] md:text-xs mt-0.5">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
