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
import { ENV } from "@/config/env";
import JsonLd from "@/components/JsonLd";
import NewUIPreview from "@/components/newui/NewUIPreview";

const Home = ({ festivalTheme }: { festivalTheme?: any }) => {

  // When a festival theme is active, the homepage becomes the redesigned
  // festival homepage (festival hero + N* sections). The global
  // FestivalThemeProvider in _app.tsx is seeded with this same `festivalTheme`
  // (via pageProps) so the theme is applied synchronously — no first-paint flash.
  // No active theme => the normal homepage below, unchanged.
  if (festivalTheme) {
    return (
      <>
        <JsonLd organization />
        <NewUIPreview />
      </>
    );
  }

  return (
    <>
      <JsonLd organization />
      <TopBar />
      <MainLayOut>
        <DesktopNav />
        {/* <MobileNav /> */}
        <HeroSection />
        {/* Shark Tank Images */}
        <div className="w-full my-4 md:my-8 flex justify-center">
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

// Cache get_public_settings across requests so the homepage doesn't hit the
// backend on every render (bots + traffic were flooding it and tripping the
// host WAF). One process-wide fetch per minute is plenty for a theme flag.
let publicSettingsCache: { at: number; data: any } | null = null;
const PUBLIC_SETTINGS_TTL_MS = 60 * 1000;

async function getPublicSettings(): Promise<any> {
  if (publicSettingsCache && Date.now() - publicSettingsCache.at < PUBLIC_SETTINGS_TTL_MS) {
    return publicSettingsCache.data;
  }
  const res = await fetch(`${ENV.API_URL}/api/v1/get_public_settings`, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    },
  } as any);
  const json = await res.json();
  publicSettingsCache = { at: Date.now(), data: json };
  return json;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pathname = "/";
  const seo = await fetchPageSeo(pathname, "home");

  // Decide the homepage variant server-side (avoids a layout flash).
  let festivalTheme: any = null;
  try {
    const json = await getPublicSettings();
    const raw = json?.settings?.festival_theme;
    const ft = typeof raw === "string" ? JSON.parse(raw || "{}") : raw;
    if (ft && ft.active) festivalTheme = ft;
  } catch {
    festivalTheme = null;
  }

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

export default Home;
