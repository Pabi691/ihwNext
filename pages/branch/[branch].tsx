import React from "react";
import type { GetServerSideProps } from "next";
import MainLayOut from "@/layout/MainLayOut";
import { DesktopNav } from "@/components/Navigation";
import BranchHero from "@/components/branches/BranchHero";
import BranchContent from "@/components/branches/BranchContent";
import PopularReels from "@/components/home/PopularReels";
import OurWorks from "@/components/home/OurWorks";
import TransformationsGallery from "@/components/gallery/TransformationsGallery";
import { toAbsoluteUrlIfPresent } from "@/utils/seo";
import { fetchPageSeo } from "@/utils/serverSeo";
import { getActiveFestivalTheme } from "@/utils/festivalTheme";
import JsonLd from "@/components/JsonLd";
import { useParams } from "@/components/compat/router";
import { branchData } from "@/content/branchData";
import AchievementSlider from "@/components/men/AchievementSlider";
import OurStoresSection from "@/components/men/OurStoresSection";
import BranchMap from "@/components/branches/BranchMap";
import RBHeaderNav from "@/components/newui/RBHeaderNav";
import RBPromoStrip from "@/components/newui/RBPromoStrip";
import NHero from "@/components/newui/NHero";
import FestivalBranchIntro from "@/components/branches/FestivalBranchIntro";
import { useFestivalTheme } from "@/components/newui/FestivalThemeContext";


const Branches = () => {
    const { branch } = useParams();
    const data = (branchData as any)[branch as string];
    const branchName = data?.name || "Kolkata";
    const SITE = "https://www.indianhairworld.com";
    const { theme } = useFestivalTheme();
    const festivalActive = theme.active;
    const branchPage = (theme.branchPages as Record<string, any> | undefined)?.[branch as string] || null;

    return (
        <>
            <JsonLd
                localBusiness={data ? {
                    name: `Indian Hair World - ${branchName}`,
                    address: data.address,
                    telephone: data.phones[0],
                    url: `${SITE}/branch/${branch}`,
                    image: data.image ? `${SITE}${data.image}` : undefined,
                    sameAs: data.gmbUrl ? [data.gmbUrl] : undefined,
                } : undefined}
                breadcrumbs={[
                    { name: "Home", url: SITE },
                    { name: "Branches", url: SITE },
                    { name: branchName, url: `${SITE}/branch/${branch}` },
                ]}
            />
            <MainLayOut themed={festivalActive}>
                {festivalActive ? (
                    <>
                        <RBPromoStrip />
                        <RBHeaderNav />
                        <NHero branchDetails={data} branchPage={branchPage} />
                        <FestivalBranchIntro content={branchPage?.content} branchName={branchName} />
                    </>
                ) : (
                    <>
                        <DesktopNav />
                        <BranchHero />
                    </>
                )}
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
                                <p className="text-[var(--site-brand)] font-bold text-base md:text-lg mb-4 leading-snug">
                                    {data.paragraph}
                                </p>
                                <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
                                    {data.paragraph2}
                                </p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                    {data.highlights.map((item: string) => (
                                        <li key={item} className="flex items-center gap-2 text-gray-800 text-sm md:text-base font-medium">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--site-brand-bright)] flex items-center justify-center">
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
                            <div className="mt-0 md:mt-10 border-l-4 border-[var(--site-brand-bright)] pl-6">
                                <div className="w-12 h-[2px] bg-[var(--site-brand-bright)] mb-6"></div>
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
                <TransformationsGallery />
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

    // Same as the homepage: resolve the active festival theme server-side so
    // _app's FestivalThemeProvider ships the palette in the SSR HTML, with no
    // flash of the default colours. null when no theme is active: the provider
    // then injects nothing and every --site-* token keeps its original colour.
    const festivalTheme = await getActiveFestivalTheme();

    return {
        props: {
            festivalTheme,
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
