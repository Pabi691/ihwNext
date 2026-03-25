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
                <div className="w-full my-4 md:my-8 justify-center hidden md:flex">
                    <div className="w-full max-w-7xl px-4 md:px-8">
                        <img
                            src="/images/sharkDesk.jpeg"
                            alt="Indian Hair World featured on Shark Tank India Season 4"
                            className="hidden md:block w-full h-auto object-contain rounded-lg"
                        />
                        <img
                            src="/images/sharkMobile.png"
                            alt="Indian Hair World featured on Shark Tank India Season 4"
                            className="block md:hidden w-full h-auto object-contain rounded-lg"
                        />
                    </div>
                </div>
                <PopularReels />
                <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
                    {/* <h2 className="text-2xl mx-6 sm:text-4xl font-bold text-gray-900 mb-4 text-center">
                        Welcome to Indian Hair World {branchName}
                    </h2> */}
                    <p className="text-gray-900 font-bold text-base md:text-lg text-center">
                        {data.paragraph}
                    </p>
                </div>
                <AchievementSlider />
                <OurWorks />
                <BranchContent />
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
