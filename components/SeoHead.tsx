import Head from "next/head";
import { useRouter } from "next/router";
import {
  hasMeaningfulSeo,
} from "@/utils/seoSessionCache";
import { htmlToElements } from "@/utils/htmlToElements";

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
  headCode?: string;
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.indianhairworld.com").replace(/\/+$/, "");

// Account, checkout and other utility pages: never indexed, whatever the SEO API returns.
const NOINDEX_PATHS = [
  "/cart", "/checkout", "/payment", "/thank-you", "/thank-you-contact",
  "/login", "/register", "/logout", "/reset-password", "/email-verification",
  "/myaccount", "/u", "/wishlist", "/review", "/search",
  "/theme-preview", "/test-home", "/contact-us/page", "/mobile",
];

const isNoindexPath = (path: string) =>
  NOINDEX_PATHS.some((p) => path === p || path.startsWith(`${p}/`));

const SeoHead = ({ seo }: { seo: SeoData | null }) => {
  const router = useRouter();

  // Strict 404 Guard
  if (router.pathname === "/404" || router.pathname === "/_error") return null;

  const path = (router.asPath || "/").split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const noindex = isNoindexPath(path);
  const s = hasMeaningfulSeo(seo) ? (seo as SeoData) : null;

  // Every indexable page declares a canonical: the SEO API's when set, otherwise
  // its own URL without the query string, so ?utm / old ?filter_* variants
  // consolidate onto the real page instead of counting as duplicates.
  const canonicalUrl = noindex ? "" : s?.canonicalUrl || `${SITE_URL}${path}`;
  const robots = noindex ? "noindex, nofollow" : s?.robots;

  if (!s) {
    return (
      <Head>
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} key="canonical" />}
        {robots && <meta name="robots" content={robots} key="robots" />}
      </Head>
    );
  }

  return (
    <Head>
      {s.title && <title>{s.title}</title>}
      {s.description && <meta name="description" content={s.description} key="description" />}
      {s.keywords && <meta name="keywords" content={s.keywords} key="keywords" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} key="canonical" />}
      {robots && <meta name="robots" content={robots} key="robots" />}

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

      {/* CRM → Pages → Head Code: tags for this page only (site-wide code is in _document). */}
      {htmlToElements(s.headCode, "page-head")}
    </Head>
  );
};

export default SeoHead;

