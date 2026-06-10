import React from "react";
import type { GetServerSideProps } from "next";
import MainLayOut from "@/layout/MainLayOut";
import { DesktopNav } from "@/components/Navigation";
import BranchHero from "@/components/branches/BranchHero";
import BranchContent from "@/components/branches/BranchContent";
import PopularReels from "@/components/home/PopularReels";
import OurWorks from "@/components/home/OurWorks";
import { toAbsoluteUrlIfPresent } from "@/utils/seo";
import { fetchPageSeo } from "@/utils/serverSeo";
import JsonLd from "@/components/JsonLd";
import { useParams } from "@/components/compat/router";
import { branchData } from "@/content/branchData";
import AchievementSlider from "@/components/men/AchievementSlider";
import OurStoresSection from "@/components/men/OurStoresSection";
import BranchMap from "@/components/branches/BranchMap";


const Branches = () => {
    const { branch } = useParams();
    const data = (branchData as any)[branch as string];
    const branchName = data?.name || "Kolkata";
    const SITE = "https://www.indianhairworld.com";

    return (
        <>
            <JsonLd
                localBusiness={data ? {
                    name: `Indian Hair World - ${branchName}`,
                    address: data.address,
                    telephone: data.phones[0],
                    url: `${SITE}/branch/${branch}`,
                    image: data.image ? `${SITE}${data.image}` : undefined,
                } : undefined}
                breadcrumbs={[
                    { name: "Home", url: SITE },
                    { name: "Branches", url: SITE },
                    { name: branchName, url: `${SITE}/branch/${branch}` },
                ]}
            />
            <MainLayOut>
                <DesktopNav />
                <BranchHero />
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
                        {data.paragraph2 && data.highlights ? (
                            <div className="mt-0 md:mt-10">
                                <p className="text-[#0A3D91] font-bold text-base md:text-lg mb-4 leading-snug">
                                    {data.paragraph}
                                </p>
                                <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
                                    {data.paragraph2}
                                </p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                    {data.highlights.map((item: string) => (
                                        <li key={item} className="flex items-center gap-2 text-gray-800 text-sm md:text-base font-medium">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none">
                                                    <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="mt-0 md:mt-10 border-l-4 border-blue-600 pl-6">
                                <div className="w-12 h-[2px] bg-blue-600 mb-6"></div>
                                <p className="text-gray-900 text-base md:text-lg leading-loose tracking-[0.2px]">
                                    {data.paragraph}
                                </p>
                                {data.serving_areas && (
                                    <p className="mt-4 text-sm text-gray-500 font-medium">
                                        Serving: {data.serving_areas}
                                    </p>
                                )}
                            </div>
                        )}

                    </div>
                </div>
                <PopularReels />
                <BranchContent />
                {/* <BranchMap data={data} compact /> */}
                <AchievementSlider />
                <OurWorks />
                <OurStoresSection />
            </MainLayOut>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const branch = context.params?.branch as string || "kolkata";
    const pathname = `/branch/${branch}`;
    const seo = await fetchPageSeo(pathname, [branch]);

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

export default Branches;
