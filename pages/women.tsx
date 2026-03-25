import React from "react";
import type { GetServerSideProps } from "next";
import MainLayOut from "../layout/MainLayOut";
import { DesktopNav } from "../components/Navigation";
import HeroSection from "@/components/women/HeroSection";
import PopularReels from "@/components/women/PopularReels";
import ReviewPopup from "@/components/women/ReviewPopup";
import ScrollingBanner from "@/components/women/ScrollingBanner";
import OurStoresSection from "@/components/women/OurStoresSection";
import AchievementSlider from "@/components/women/AchievementSlider";
import CelebritySection from "@/components/women/CelebritySection";
import HairTransformation from "@/components/women/HairTransformation";
import Testimonials from "@/components/women/Testimonials";
import HairWigSection from "@/components/women/HairWigSection";
import SingleSlider from '@/components/men/SingleSlider';
import OurCollections from "@/components/OurCollections";
import { toAbsoluteUrlIfPresent } from "@/utils/seo";
import { fetchPageSeo } from "@/utils/serverSeo";
import JsonLd from "@/components/JsonLd";

const Women = () => {
    return (
        <MainLayOut>
            <JsonLd
                service={{
                    name: "Women's Hair Replacement Services",
                    description: "Premium hair toppers, wigs, and extensions for women. Natural-looking solutions for thinning hair — comfortable and stunning.",
                    url: "https://www.indianhairworld.com/women",
                }}
                breadcrumbs={[
                    { name: "Home", url: "https://www.indianhairworld.com" },
                    { name: "Women", url: "https://www.indianhairworld.com/women" },
                ]}
            />
            <DesktopNav />
            <HeroSection />
            <PopularReels /> 
            <section className="relative w-[99vw]">
                <img src="/images/LAKE GARDENS.jpg" alt="Indian Hair World featured on Shark Tank India - women's hair solutions" className="w-full h-auto object-cover" />
            </section>

            <OurCollections title="Our Collections" />

            <SingleSlider slug_name="get_slug_data/women-products" title="WOMEN'S HAIR PRODUCTS" />
            <ReviewPopup />
            <ScrollingBanner />
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
    const pathname = "/women";
    const seo = await fetchPageSeo(pathname, ["women", "women-products"]);

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

export default Women;
