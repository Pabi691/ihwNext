import React from 'react';
import type { GetServerSideProps } from "next";
import MainLayOut from '../layout/MainLayOut';
import { DesktopNav } from '../components/Navigation';
import SearchableTabs from '../components/contact/SearchableTabs';
import ContactBanner from '../components/contact/ContactBanner';
import BranchContactSections from '../components/branches/BranchContactSections';
import ContactFormSection from '../components/contact/ContactFormSection';
import { toAbsoluteUrlIfPresent } from "@/utils/seo";
import { fetchPageSeo } from "@/utils/serverSeo";


const Contact = () =>{
    return(
        <>
        <MainLayOut>
            <DesktopNav />
            <ContactBanner />
            <BranchContactSections />
            <ContactFormSection />
            <SearchableTabs />

        </MainLayOut>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const pathname = "/contact-us";
    const seo = await fetchPageSeo(pathname, "contact-us");

    console.log(
        `[SEO-DEBUG][contact-us] getServerSideProps result | title=${Boolean(seo.title)} canonical=${Boolean(seo.canonicalUrl)} ogImage=${Boolean(seo.ogImage)}`
    );

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

export default Contact;
