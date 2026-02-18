import React, { useEffect } from "react";
import App, { AppProps, AppContext } from "next/app";
import Router, { useRouter } from "next/router";

import "@/index.css";
import "@/App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import "react-medium-image-zoom/dist/styles.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/mousewheel";
import "swiper/css/pagination";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "owl.carousel/dist/assets/owl.carousel.min.css";
import "owl.carousel/dist/assets/owl.theme.default.min.css";
import "@/styles/FloatingContact.css";

import { AuthProvider } from "@/components/user/AuthContext";
import { GlobalProvider } from "@/global/GlobalContext";
import { LoadingProvider } from "@/global/LoadingContext";
import LoadingWrapper from "@/global/LoadingWrapper";
// import GlobalSeo from "@/global/GlobalSeo";
import FloatingContact from "@/components/FloatingContact";
import Loader from "@/components/Loader";
import ScrollToTop from "@/components/ScrollToTop";
import { useLoading } from "@/global/LoadingContext";
import SeoHead from "@/components/SeoHead";
import { getSeoSlugCandidatesFromPath } from "@/utils/slugUtils";
import { fetchPageSeo } from "@/utils/serverSeo";
import {
  normalizeSeoPath,
  preloadSeoSessionBySlugs,
  readSeoFromSession,
  writeSeoToSession,
} from "@/utils/seoSessionCache";

// Prevent SSR crashes when code accesses localStorage/sessionStorage
if (typeof window === "undefined") {
  const storageStub = {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
    clear: () => { },
  };
  const g = globalThis as typeof globalThis & {
    localStorage?: typeof storageStub;
    sessionStorage?: typeof storageStub;
  };
  g.localStorage = g.localStorage || storageStub;
  g.sessionStorage = g.sessionStorage || storageStub;
}

const RouteLoadingEvents = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleStop);
    Router.events.on("routeChangeError", handleStop);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleStop);
      Router.events.off("routeChangeError", handleStop);
    };
  }, [setLoading]);

  return null;
};

const MyApp = ({ Component, pageProps, pageSeoData }: AppProps & { pageSeoData: any }) => {
  const router = useRouter();
  const resolvedSeo = pageProps?.seo ?? pageSeoData ?? null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Ensure gtag exists even before GA/Tag Manager loads
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag =
      (window as any).gtag ||
      function () {
        (window as any).dataLayer.push(arguments);
      };

    const loadOwl = async () => {
      const $ = (await import("jquery")).default as any;
      (window as any).$ = $;
      (window as any).jQuery = $;
      await import("owl.carousel");
    };
    loadOwl();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentPath = normalizeSeoPath(router.asPath || "/");
    writeSeoToSession(currentPath, resolvedSeo);
  }, [router.asPath, resolvedSeo]);

  useEffect(() => {
    preloadSeoSessionBySlugs();
  }, []);

  return (
    <LoadingProvider>
      <AuthProvider>
        <GlobalProvider initialGlobalContent={null}>
          <RouteLoadingEvents />
          <SeoHead seo={resolvedSeo} />
          {/* <GlobalSeo disableMeta={Boolean(pageSeoData || pageProps?.seo)} initialSeo={pageSeoData} /> */}
          <FloatingContact />
          <Loader />
          <LoadingWrapper>
            <ScrollToTop />
            <Component {...pageProps} />
          </LoadingWrapper>
        </GlobalProvider>
      </AuthProvider>
    </LoadingProvider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  let pageSeoData = appProps?.pageProps?.seo ?? null;

  try {
    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("userToken") || process.env.NEXT_PUBLIC_WEB_TOKEN;
    }

    // Calculate slug and fetch SEO for the page
    const rawPath =
      appContext.ctx.asPath ||
      appContext.ctx.pathname ||
      appContext.router.asPath ||
      "/";
    const normalizedPath = normalizeSeoPath(rawPath);

    if (!pageSeoData && typeof window !== "undefined") {
      const cachedSeo = readSeoFromSession(normalizedPath);
      if (cachedSeo) {
        pageSeoData = cachedSeo;
      }
    }

    const seoSlugCandidates = getSeoSlugCandidatesFromPath(rawPath);
    if (!pageSeoData && seoSlugCandidates.length > 0) {
      pageSeoData = await fetchPageSeo(rawPath, seoSlugCandidates, token || undefined);
      if (typeof window !== "undefined") {
        writeSeoToSession(normalizedPath, pageSeoData);
      }
    }
  } catch (error) {
    console.error("Error fetching global/SEO data in _app:", error);
    // Suppress error to allow app to render with default/fallback data
  }

  return { ...appProps, pageSeoData };
};

export default MyApp;
