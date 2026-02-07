import React from "react";
import MainLayOut from "../layout/MainLayOut";
import { DesktopNav } from "../components/Navigation";
import HeroSection from "@/components/men/HeroSection";
import PopularReels from "@/components/men/PopularReels";
import MensHairPatchSection from "@/components/men/MensHairPatchSection";
import ReviewPopup from "@/components/men/ReviewPopup";
import ScrollingBanner from "@/components/men/ScrollingBanner";
import MensHairProductsSection from "@/components/men/MensHairProductsSection";
import OurStoresSection from "@/components/men/OurStoresSection";
import AchievementSlider from "@/components/men/AchievementSlider";
import CelebritySection from "@/components/men/CelebritySection";
import HairTransformation from "@/components/men/HairTransformation";
import Testimonials from "@/components/men/Testimonials";
import HairWigSection from "@/components/men/HairWigSection";
import SingleSlider from '@/components/men/SingleSlider';

const Men = () => {
    return (
        <MainLayOut>
            <DesktopNav />
            <HeroSection />
            <section className="relative w-[99vw]">
                <img src="/images/LAKE GARDENS.jpg" alt="Shark Tank India Banner" className="w-full h-auto object-cover" />
            </section>

            <PopularReels />
            {/* <MensHairPatchSection /> */}
            <SingleSlider slug_name="get_slug_data/men-products" title="MEN’S HAIR PRODUCTS" />
                  
            <ReviewPopup />
            <ScrollingBanner />
            {/* <MensHairProductsSection /> */}
            <OurStoresSection />
            <AchievementSlider />
            <CelebritySection />
            <HairTransformation />
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

export default Men;