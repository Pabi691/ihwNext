import React from "react";
import MainLayOut from "../layout/MainLayOut";
import { DesktopNav } from "../components/Navigation";
import HeroSection from "@/components/women/HeroSection";
import PopularReels from "@/components/women/PopularReels";
import MensHairPatchSection from "@/components/women/MensHairPatchSection";
import ReviewPopup from "@/components/women/ReviewPopup";
import ScrollingBanner from "@/components/women/ScrollingBanner";
import MensHairProductsSection from "@/components/women/MensHairProductsSection";
import OurStoresSection from "@/components/women/OurStoresSection";
import AchievementSlider from "@/components/women/AchievementSlider";
import CelebritySection from "@/components/women/CelebritySection";
import HairTransformation from "@/components/women/HairTransformation";
import Testimonials from "@/components/women/Testimonials";
import HairWigSection from "@/components/women/HairWigSection";

const Women = () => {
    return (
        <MainLayOut>
            <DesktopNav />
            <HeroSection />
            <section className="relative w-[99vw]">
                <img src="/images/LAKE GARDENS.jpg" alt="Shark Tank India Banner" className="w-full h-auto object-cover" />
            </section>

            <PopularReels />
            {/* <MensHairPatchSection /> */}
            <ReviewPopup />
            <ScrollingBanner />
            {/* <MensHairProductsSection /> */}
            <OurStoresSection />
            <AchievementSlider />
            <CelebritySection />
            {/* <HairTransformation /> */}
            <Testimonials />

            <HairWigSection
                subtitle="MOST NATURAL LOOKING"
                title="HUMAN HAIR WIGS"
                description="We provide top-quality 
                Human Hair Wigs in India. Schedule a 1-on-1 video call with our team to view our products up close."
                ctaText="BOOK A SESSION NOW!"
                ctaLink="tel:+918910097668"
                videoUrl="https://www.youtube.com/watch?v=2JgUC0iVauA"
                videoThumbnail="https://img.youtube.com/vi/2JgUC0iVauA/maxresdefault.jpg"
            />
        </MainLayOut>
    )
}

export default Women;