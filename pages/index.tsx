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

import { ENV } from "@/config/env";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apiUrl = ENV.API_URL;
  const token = ENV.WEB_TOKEN;
  let apiData = null;

  console.log("[Index SSR] Fetching home data...", { apiUrl });

  if (apiUrl && token) {
    try {
      // Add timeout to prevent hanging requests causing 503s
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${apiUrl}/api/v1/get_slug_data/home`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data?.pageData || data?.product_details) {
          apiData = data;
        }
      } else {
        console.error(`[Index SSR] Failed to fetch: ${res.status}`);
      }
    } catch (e: any) {
      console.error("[Index SSR] Error fetching home data:", e.message);
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
