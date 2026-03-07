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

  // Strict 404 Guard
  if (router.pathname === "/404") return null;

  // Only render meaningful SEO data
  if (!hasMeaningfulSeo(seo)) return null;

  const s = seo as SeoData;

  return (
    <Head>
      {s.title && <title>{s.title}</title>}
      {s.description && <meta name="description" content={s.description} key="description" />}
      {s.keywords && <meta name="keywords" content={s.keywords} key="keywords" />}
      {s.canonicalUrl && <link rel="canonical" href={s.canonicalUrl} key="canonical" />}
      {s.robots && <meta name="robots" content={s.robots} key="robots" />}

      {s.ogTitle && <meta property="og:title" content={s.ogTitle} key="og:title" />}
      {s.ogDescription && (
        <meta property="og:description" content={s.ogDescription} key="og:description" />
      )}
      {s.ogImage && <meta property="og:image" content={s.ogImage} key="og:image" />}
      {s.ogUrl && <meta property="og:url" content={s.ogUrl} key="og:url" />}
      {s.ogType && <meta property="og:type" content={s.ogType} key="og:type" />}
      <meta property="og:site_name" content="Indian Hair World" key="og:site_name" />

      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      {s.ogTitle && <meta name="twitter:title" content={s.ogTitle} key="twitter:title" />}
      {s.ogDescription && (
        <meta name="twitter:description" content={s.ogDescription} key="twitter:description" />
      )}
      {s.ogImage && <meta name="twitter:image" content={s.ogImage} key="twitter:image" />}
    </Head>
  );
};

export default SeoHead;

