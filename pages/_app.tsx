import React, { useEffect } from "react";
import App, { type AppContext, type AppProps } from "next/app";
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
import FloatingContact from "@/components/FloatingContact";
import Loader from "@/components/Loader";
import ScrollToTop from "@/components/ScrollToTop";
import { useLoading } from "@/global/LoadingContext";
import SeoHead from "@/components/SeoHead";
import {
  buildDefaultSeo,
  getSlugFromRoute,
  normalizeSeoFromApi,
  resolvePathname,
} from "@/utils/seo";

// Prevent SSR crashes when code accesses localStorage/sessionStorage
if (typeof window === "undefined") {
  const storageStub = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
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

const MyApp = ({ Component, pageProps }: AppProps) => {
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
        <GlobalProvider>
          <RouteLoadingEvents />
          <SeoHead seo={pageProps?.seo} />
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

const fetchSeoBySlug = async (slug: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = process.env.NEXT_PUBLIC_WEB_TOKEN;
  if (!apiUrl || !token) return null;

  try {
    const res = await fetch(`${apiUrl}/api/v1/get_slug_data/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  if (appProps.pageProps?.seo) {
    return appProps;
  }

  const query = appContext.ctx.query as Record<string, string | string[] | undefined>;
  const pathname = appContext.ctx.pathname || "/";
  const resolvedPath = resolvePathname(pathname, query);
  const slug = getSlugFromRoute(pathname, query);

  let seo = buildDefaultSeo(resolvedPath, slug);

  if (slug) {
    const apiData = await fetchSeoBySlug(slug);
    seo = normalizeSeoFromApi(apiData, resolvedPath, slug);
  }

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      seo: appProps.pageProps?.seo || seo,
    },
  };
};

export default MyApp;
