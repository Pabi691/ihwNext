import React from "react";
import type { GetServerSideProps } from "next";
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
import { toAbsoluteUrlIfPresent } from "@/utils/seo";
import { fetchPageSeo } from "@/utils/serverSeo";
import JsonLd from "@/components/JsonLd";

const Men = () => {
    return (
        <MainLayOut>
            <JsonLd
                service={{
                    name: "Men's Hair Replacement Services",
                    description: "Premium non-surgical hair replacement for men including hair patches, wigs, and hair systems. Natural-looking solutions starting at Rs. 5999.",
                    url: "https://www.indianhairworld.com/men",
                }}
                breadcrumbs={[
                    { name: "Home", url: "https://www.indianhairworld.com" },
                    { name: "Men", url: "https://www.indianhairworld.com/men" },
                ]}
            />
            <DesktopNav />
            <HeroSection />
            <section className="relative w-[99vw]">
                <img src="/images/sharkDesk.png" alt="Indian Hair World featured on Shark Tank India - men's hair solutions" className="w-full h-auto object-cover hidden md:block" />
                <img src="/images/sharkMobile.png" alt="Indian Hair World featured on Shark Tank India - men's hair solutions" className="w-full h-auto object-cover md:hidden" />
            </section>

            <PopularReels />
            <section className="relative w-[99vw]">
                <img src="/images/LAKE GARDENS.jpg" alt="Indian Hair World featured on Shark Tank India - men's hair solutions" className="w-full h-auto object-cover" />
            </section>
            {/* <MensHairPatchSection /> */}
            <SingleSlider slug_name="get_slug_data/men-products" title="MEN'S HAIR PRODUCTS" />

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

export const getServerSideProps: GetServerSideProps = async () => {
    const pathname = "/men";
    const seo = await fetchPageSeo(pathname, ["men", "men-products"]);

    return {
        props: {
            seo: {
                ...seo,
                canonicalUrl: toAbsoluteUrlIfPresent(seo.canonicalUrl),
                ogUrl: toAbsoluteUrlIfPresent(seo.ogUrl),
                ogImage: toAbsoluteUrlIfPresent(seo.ogImage),
            },
        },
    };
};

export default Men;