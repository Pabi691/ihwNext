import React from "react";
import type { GetServerSideProps } from "next";
import MainLayOut from '../layout/MainLayOut';
import HeroSection from '../components/HeroSection';
import HomeBody from '../components/home/HomeBody';
import MobileHomeBody from "@/components/mobileComponents/MobileHomeBody";
import { DesktopNav, MobileNav } from "../components/Navigation";
import TopBar from "../components/home/TopBar";
import { toAbsoluteUrlIfPresent } from "@/utils/seo";
import { fetchPageSeo } from "@/utils/serverSeo";

const Home = () => {

  return (
    <>
      <TopBar />
      <MainLayOut>
        <DesktopNav />
        {/* <MobileNav /> */}
        <HeroSection />
        <div className="hidden md:block">
          <HomeBody />
        </div>
        <div className="md:hidden">
          <MobileHomeBody />
        </div>
      </MainLayOut>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pathname = "/";
  const seo = await fetchPageSeo(pathname, "home");

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

export default Home;
