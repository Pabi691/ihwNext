import React, { useState } from "react";
import NavTop from '../components/layoutParts/NavTop';
import Footer from '../components/layoutParts/Footer';
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { useGlobal } from "../global/GlobalContext";
import { themeBgColor } from "../styles/typography";
import BottomFixedNav from "@/components/mobileComponents/BottomFixedNav";

const MainLayOut = ({ children, themed = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  // const [loading, setLoading] = useState(true);
  const { accessoriesCat, planters, container, loadingCategories } = useGlobal();

  return (
    <>
      {!themed && <NavTop />}
      <main>{children}</main>

      {/* Mobile Footer */}
      <div className="block md:hidden">
        <div
          className={`${themeBgColor} p-4 text-white font-medium border-b flex justify-between text-base`}
          onClick={() => setShowMenu(!showMenu)}
        >
          <span>More About Indian Hair World</span>
          <span className="text-2xl">
            {showMenu ? <BiChevronUp /> : <BiChevronDown />}
          </span>
        </div>
        {showMenu &&
          <Footer
            accessoriesCat={accessoriesCat}
            planters={planters}
            container={container}
            loading={loadingCategories}
          />
        }
      </div>
      <BottomFixedNav />

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer
          accessoriesCat={accessoriesCat}
          planters={planters}
          container={container}
          loading={loadingCategories}
        />
      </div>
    </>
  );
};

export default MainLayOut;
