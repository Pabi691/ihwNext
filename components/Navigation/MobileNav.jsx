// src/components/Navigation/MobileNav.jsx

import { Link } from "@/components/compat/router";
import { mobileNavItems } from "../../content/navItems";

const MobileNav = () => {
  return (
    <div className="overflow-scroll scrollbar-none md:hidden">
      <div className="justify-start px-4 py-2 flex items-baseline gap-4 w-[1000px]">
        {mobileNavItems.map((item) => (
          <Link key={item.path} to={item.path} reloadDocument className="text-center">
            {item.image && (
              <img
                src={item.image}
                alt={item.label}
                loading="lazy"
                className="w-[70px] p-2 rounded-lg bg-gray-100"
              />
            )}
            <span className="block text-[12px]">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;

