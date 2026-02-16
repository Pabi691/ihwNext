import React from "react";
import type { GetServerSideProps } from "next";
import MainLayOut from '../layout/MainLayOut';
import HeroSection from '../components/HeroSection';
import HomeBody from '../components/home/HomeBody';
import MobileHomeBody from "@/components/mobileComponents/MobileHomeBody";
import { DesktopNav, MobileNav } from "../components/Navigation";
import TopBar from "../components/home/TopBar";
import { normalizeSeoFromApi, toAbsoluteUrlIfPresent } from "@/utils/seo";

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

export const getServerSideProps: GetServerSideProps = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = process.env.NEXT_PUBLIC_WEB_TOKEN;
  let apiData = null;

  if (apiUrl && token) {
    try {
      const res = await fetch(`${apiUrl}/api/v1/get_slug_data/home`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.pageData || data?.product_details) {
          apiData = data;
        }
      }
    } catch {
      apiData = null;
    }
  }

  const pathname = "/";
  const seo = normalizeSeoFromApi(apiData, pathname, "home");

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
