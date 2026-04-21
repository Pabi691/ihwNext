import React from "react";
import type { GetServerSideProps } from "next";
import MainLayOut from "../layout/MainLayOut";
import { DesktopNav } from "../components/Navigation";
import HeroSection from "@/components/men/HeroSection";
import PopularReels from "@/components/men/PopularReels";
import MensHairPatchSection from "@/components/men/MensHairPatchSection";
import ReviewPopup from "@/components/men/ReviewPopup";
import ScrollingBanner from "@/components/men/ScrollingBanner";
// import MensHairProductsSection from "@/components/men/MensHairProductsSection";
import OurStoresSection from "@/components/men/OurStoresSection";
import AchievementSlider from "@/components/men/AchievementSlider";
import CelebritySection from "@/components/men/CelebritySection";
import HairTransformation from "@/components/men/HairTransformation";
import Testimonials from "@/components/men/Testimonials";
import MenSeoContent from "@/components/men/MenSeoContent";
import HairWigSection from "@/components/men/HairWigSection";
import SingleSlider from '@/components/men/SingleSlider';
import { toAbsoluteUrlIfPresent } from "@/utils/seo";
import { fetchPageSeo } from "@/utils/serverSeo";
import JsonLd from "@/components/JsonLd";
// import Image from "next/image";
import OurWorks from "@/components/home/OurWorks";
import FindUsNearYou from "@/components/FindUsNearYou";

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
            <FindUsNearYou />
            {/* Shark Tank Images */}
            <div className="w-full my-6 md:my-16">
                <div className="max-w-6xl mx-auto px-4 md:px-6">

                    {/* IMAGE */}
                    <div className="rounded-2xl overflow-hidden">
                        <img
                            src="/images/sharkDesk.jpeg"
                            alt="Indian Hair World featured on Shark Tank India Season 4"
                            className="hidden md:block w-full h-auto object-contain rounded-lg"
                        />
                    </div>

                    {/* PARAGRAPH SECTION */}
                    <div className="mt-0 md:mt-10 border-l-4 border-blue-600 pl-6">

                        {/* subtle top divider */}
                        <div className="w-12 h-[2px] bg-blue-600 mb-6"></div>

                        <p className="text-gray-900 text-base md:text-lg leading-loose tracking-[0.2px]">
                            Are you looking for a natural-looking hair patch for men in Kolkata? Indian Hair World is Kolkata's leading destination for premium men hair patches, hair wigs for men, and non-surgical hair replacement solutions. Whether you're dealing with receding hairline, partial baldness, or complete hair loss — our 100% natural human hair products give you an undetectable, confident look at the best price in Kolkata.
                        </p>

                    </div>

                </div>
            </div>

            <PopularReels />
            <section className="relative w-[99vw]">
                <img src="/images/LAKE GARDENS.jpg" alt="Indian Hair World featured on Shark Tank India - men's hair solutions" className="w-full h-auto object-cover" />
            </section>
            {/* <MensHairPatchSection /> */}
            <SingleSlider slug_name="get_slug_data/men-products" title="MEN'S HAIR PRODUCTS" />

            <ReviewPopup />
            <ScrollingBanner />
            {/* <MensHairProductsSection /> */}
            {/* <OurStoresSection /> */}
            <AchievementSlider />
            <CelebritySection />
            <OurWorks />
            <MenSeoContent />
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