import React, { useState } from "react";
import MobileHeader from '../components/layoutParts/mobile/MobileHeader';
import Footer from '../components/layoutParts/Footer';
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import NavTop from "../components/layoutParts/NavTop";
import { useGlobal } from "../global/GlobalContext";
import { themeBgColor } from "../styles/typography";

/**
 * @param {{ children: any, title?: any, ProductsCount?: any, link?: string | null }} props
 */
const MobileMainLayout = ({ children, title, ProductsCount, link = null }) => {
    const [showMenu, setShowMenu] = useState(false);
    const { accessoriesCat, menCat, womenCat, loadingCategories } = useGlobal();
    return (
        <>
            <div className="md:hidden block">
                <MobileHeader ProductsCount={ProductsCount} title={title} link={link}/>
            </div>
            <div className="hidden md:block">
                <NavTop />
            </div>
            <div>
                {children}
            </div>
            <div className="block md:hidden mb-12">
                <div className={`${themeBgColor} p-4 text-white font-medium border-b flex justify-between text-base`} onClick={() => setShowMenu(!showMenu)}>
                    <span>More About Indian Hair World</span>
                    <span className="text-2xl">
                        {showMenu ? <BiChevronUp /> : <BiChevronDown />}
                    </span>
                </div>
                <div>
                    {showMenu && (
                        <Footer
                            accessoriesCat={accessoriesCat}
                            menCat={menCat}
                            womenCat={womenCat}
                            loading={loadingCategories}
                        />
                    )}
                </div>
            </div>
            <div className="hidden md:block">
                <Footer
                    accessoriesCat={accessoriesCat}
                    menCat={menCat}
                    womenCat={womenCat}
                    loading={loadingCategories}
                />
            </div>
        </>
    )
}

export default MobileMainLayout;
