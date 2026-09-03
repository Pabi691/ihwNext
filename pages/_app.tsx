import React, { useEffect } from "react";
import App, { AppProps, AppContext } from "next/app";
import Router, { useRouter } from "next/router";
import Script from "next/script";

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
import { GuestCheckProvider } from "@/global/GuestCheckContext";
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
    <>
      {/* Google Tag Manager — deferred until page is interactive */}
      <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NK7P55MK');`}</Script>

      {/* Google Analytics — deferred */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-DC5TNC8E6Q" strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-DC5TNC8E6Q');`}</Script>

      {/* Meta Pixel — deferred */}
      <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','8204283123019412');fbq('track','PageView');`}</Script>

      <LoadingProvider>
        <AuthProvider>
          <GlobalProvider initialGlobalContent={null}>
            <GuestCheckProvider>
              <RouteLoadingEvents />
              <SeoHead seo={resolvedSeo} />
              <FloatingContact />
              <Loader />
              <LoadingWrapper>
                <ScrollToTop />
                <Component {...pageProps} />
              </LoadingWrapper>
            </GuestCheckProvider>
          </GlobalProvider>
        </AuthProvider>
      </LoadingProvider>
    </>
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
