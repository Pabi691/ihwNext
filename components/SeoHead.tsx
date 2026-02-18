import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  hasMeaningfulSeo,
  normalizeSeoPath,
  readSeoFromSession,
  writeSeoToSession,
} from "@/utils/seoSessionCache";

type SeoData = {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
};

const SeoHead = ({ seo }: { seo: SeoData | null }) => {
  const router = useRouter();
  const [effectiveSeo, setEffectiveSeo] = useState<SeoData | null>(
    hasMeaningfulSeo(seo) ? seo : null
  );

  useEffect(() => {
    if (hasMeaningfulSeo(seo)) {
      setEffectiveSeo(seo);
      return;
    }

    const cached = readSeoFromSession(normalizeSeoPath(router.asPath || "/"));
    if (cached && hasMeaningfulSeo(cached)) {
      setEffectiveSeo(cached as SeoData);
      return;
    }

    setEffectiveSeo(null);
  }, [router.asPath, seo]);

  useEffect(() => {
    const path = normalizeSeoPath(router.asPath || "/");

    if (hasMeaningfulSeo(seo)) {
      writeSeoToSession(path, seo);
      setEffectiveSeo(seo as SeoData);
      return;
    }

    const cached = readSeoFromSession(path);
    if (cached && hasMeaningfulSeo(cached)) {
      setEffectiveSeo(cached as SeoData);
    }
  }, [router.asPath, seo]);

  useEffect(() => {
    // Browser-side debug for every page SEO payload
    console.log(`[SEO-DEBUG] SeoHead payload | path=${router.asPath || "/"}`, effectiveSeo);
  }, [router.asPath, effectiveSeo]);

  if (!effectiveSeo) return null;

  return (
    <Head>
      <title>{effectiveSeo.title}</title>
      <meta name="description" content={effectiveSeo.description} key="description" />
      <meta name="keywords" content={effectiveSeo.keywords} key="keywords" />
      <link rel="canonical" href={effectiveSeo.canonicalUrl} key="canonical" />

      <meta property="og:title" content={effectiveSeo.ogTitle} key="og:title" />
      <meta
        property="og:description"
        content={effectiveSeo.ogDescription}
        key="og:description"
      />
      <meta property="og:image" content={effectiveSeo.ogImage} key="og:image" />
      <meta property="og:url" content={effectiveSeo.ogUrl} key="og:url" />
      <meta property="og:type" content={effectiveSeo.ogType} key="og:type" />
      <meta property="og:site_name" content="Indian Hair World" key="og:site_name" />

      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={effectiveSeo.ogTitle} key="twitter:title" />
      <meta
        name="twitter:description"
        content={effectiveSeo.ogDescription}
        key="twitter:description"
      />
      <meta name="twitter:image" content={effectiveSeo.ogImage} key="twitter:image" />
    </Head>
  );
};

export default SeoHead;
