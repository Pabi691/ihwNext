import React, { useEffect } from "react";
import App, { AppProps, AppContext } from "next/app";
import Router from "next/router";

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
import GlobalSeo from "@/global/GlobalSeo";
import FloatingContact from "@/components/FloatingContact";
import Loader from "@/components/Loader";
import ScrollToTop from "@/components/ScrollToTop";
import { useLoading } from "@/global/LoadingContext";
import SeoHead from "@/components/SeoHead";
import { globalContent } from "@/services/globalcontent.service";
import { getSlugFromPath } from "@/utils/slugUtils";
import { fetchPageSeo } from "@/utils/serverSeo";

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

const MyApp = ({ Component, pageProps, globalContentData, pageSeoData }: AppProps & { globalContentData: any; pageSeoData: any }) => {
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

  return (
    <LoadingProvider>
      <AuthProvider>
        <GlobalProvider initialGlobalContent={globalContentData}>
          <RouteLoadingEvents />
          <SeoHead seo={pageSeoData || pageProps?.seo} />
          <GlobalSeo disableMeta={Boolean(pageSeoData || pageProps?.seo)} initialSeo={pageSeoData} />
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

  // Fetch global content (only on server or initial client load if not present)
  // Note: getInitialProps runs on server for initial page load, and on client for client-side navigation.
  // We can optimize this to avoid re-fetching on client if we want, but for now we follow the plan.

  // Need to handle token. For public pages, we might use a default token or just let the service handle it (it tries process.env).
  // In _app, we don't easily have access to client-side localStorage auth token during server render.
  // The service uses process.env.NEXT_PUBLIC_WEB_TOKEN as fallback.

  const content = await globalContent(null);

  // Calculate slug and fetch SEO for the page
  const slug = getSlugFromPath(appContext.ctx.asPath || appContext.router.asPath);
  let pageSeoData = null;
  if (slug) {
    pageSeoData = await fetchPageSeo(appContext.ctx.asPath || "/", slug);
  }

  return { ...appProps, globalContentData: content, pageSeoData };
};

export default MyApp;
