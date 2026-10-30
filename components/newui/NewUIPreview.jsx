import React from "react";
import { Poppins } from "next/font/google";

// Scoped to the preview routes only — the live site's default font is untouched.
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

import Footer from "@/components/layoutParts/Footer";
import BottomFixedNav from "@/components/mobileComponents/BottomFixedNav";
import { useGlobal } from "@/global/GlobalContext";

import RBHeaderNav       from "@/components/newui/RBHeaderNav";
import RBPromoStrip      from "@/components/newui/RBPromoStrip";
import NHero             from "@/components/newui/NHero";
import PopularReels      from "@/components/home/PopularReels";
import NSaleOffers       from "@/components/newui/NSaleOffers";
import NEmiPromo         from "@/components/newui/NEmiPromo";
import NBookAppointment  from "@/components/newui/NBookAppointment";
import TransformationsGallery from "@/components/gallery/TransformationsGallery";
import NWomensCollections from "@/components/newui/NWomensCollections";
import NMensCollections   from "@/components/newui/NMensCollections";
import NProductSlider    from "@/components/newui/NProductSlider";
import NAbout            from "@/components/newui/NAbout";
import NServices         from "@/components/newui/NServices";
import NNonSurgical      from "@/components/newui/NNonSurgical";
import NAchievements     from "@/components/newui/NAchievements";
import NTransformations  from "@/components/newui/NTransformations";
import NBlogs            from "@/components/newui/NBlogs";
import NTeam             from "@/components/newui/NTeam";

/**
 * The redesigned homepage body, rendered by the theme-preview routes.
 * Must be mounted inside a <FestivalThemeProvider> (the page supplies it).
 */
export default function NewUIPreview() {
  const { accessoriesCat, planters, container, loadingCategories } = useGlobal();

  return (
    <>
      {/* Themed header (preview-only — the live site's header is untouched) */}
      <div className={poppins.className}>
        <RBPromoStrip />
        <RBHeaderNav />
      </div>

      <main className={poppins.className}>
        <NHero />

        {/* Shark Tank */}
        <div className="w-full py-6 bg-white flex justify-center">
          <div className="w-full max-w-7xl px-4 md:px-8">
            <img src="/images/sharkDesk.jpeg" alt="Featured on Shark Tank India Season 4"
              className="hidden md:block w-full h-auto object-contain rounded-2xl shadow-sm" />
            <img src="/images/sharkMobile.png" alt="Featured on Shark Tank India"
              className="block md:hidden w-full h-auto object-contain rounded-2xl" />
          </div>
        </div>

        <PopularReels />

        <TransformationsGallery />

        <NSaleOffers />

        <NEmiPromo />

        <NBookAppointment />

        <NProductSlider
          slugName="get_slug_data/men-products"
          title="Men's Hair Products"
          subtitle="For Him"
          accentWord="Hair Products"
        />

        <NMensCollections />

        <NWomensCollections />

        <NProductSlider
          slugName="get_slug_data/women-products"
          title="Women's Hair Products"
          subtitle="For Her"
          accentWord="Hair Products"
        />

        <NAbout />

        <NServices />

        <NNonSurgical />

        <NAchievements />

        <NTransformations />

        <NBlogs />

        <NTeam />
      </main>

      <BottomFixedNav />
      <Footer
        accessoriesCat={accessoriesCat}
        planters={planters}
        container={container}
        loading={loadingCategories}
      />
    </>
  );
}
