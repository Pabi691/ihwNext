import Head from "next/head";
import { useRouter } from "next/router";
import {
  hasMeaningfulSeo,
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
  robots?: string;
};

const SeoHead = ({ seo }: { seo: SeoData | null }) => {
  const router = useRouter();

  // Strict 404 Guard: If Next.js has internally fallen back to the 404 page, 
  // immediately escape and DO NOT render any cached or inferred SEO tags.
  if (router.pathname === "/404") {
    return null;
  }

  // Only render meaningful SEO data
  if (!hasMeaningfulSeo(seo)) return null;

  const effectiveSeo = seo as SeoData;

  return (
    <Head>
      <title>{effectiveSeo.title}</title>
      <meta name="description" content={effectiveSeo.description} key="description" />
      <meta name="keywords" content={effectiveSeo.keywords} key="keywords" />
      <link rel="canonical" href={effectiveSeo.canonicalUrl} key="canonical" />
      {effectiveSeo.robots && (
        <meta name="robots" content={effectiveSeo.robots} key="robots" />
      )}

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

