// src/components/Navigation/DesktopNav.jsx

import { Link } from "@/components/compat/router";
import { desktopNavItems } from "../../content/navItems";

const DesktopNav = () => {
  return (
    <div className="justify-center p-2 md:flex items-center gap-20 hidden font-medium border-t border-b">
      {desktopNavItems.map((item, index) => {
        // DROPDOWN MENU
        if (item.children) {
          return (
            <div key={index} className="relative group cursor-pointer">
              <span className="flex items-center gap-1">
                {item.label}
                <span className="text-xs">▼</span>
              </span>

              {/* Dropdown */}
              <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg border rounded-md min-w-[220px] z-50">
                {item.children.map((child) => (
                  <a
                    key={child.path}
                    href={child.path}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            </div>
          );
        }

        // NORMAL LINK
        return (
          <a
            key={item.path}
            href={item.path}
            className="flex items-center flex-col"
          >
            <span>{item.label}</span>
          </a>
        );
      })}
    </div>
  );
};

export default DesktopNav;

