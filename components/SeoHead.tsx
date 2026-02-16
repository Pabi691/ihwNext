import Head from "next/head";

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

const SeoHead = ({ seo }: { seo: SeoData }) => {
  if (!seo) return null;

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} key="description" />
      <meta name="keywords" content={seo.keywords} key="keywords" />
      <link rel="canonical" href={seo.canonicalUrl} key="canonical" />

      <meta property="og:title" content={seo.ogTitle} key="og:title" />
      <meta
        property="og:description"
        content={seo.ogDescription}
        key="og:description"
      />
      <meta property="og:image" content={seo.ogImage} key="og:image" />
      <meta property="og:url" content={seo.ogUrl} key="og:url" />
      <meta property="og:type" content={seo.ogType} key="og:type" />
      <meta property="og:site_name" content="Indian Hair World" key="og:site_name" />

      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={seo.ogTitle} key="twitter:title" />
      <meta
        name="twitter:description"
        content={seo.ogDescription}
        key="twitter:description"
      />
      <meta name="twitter:image" content={seo.ogImage} key="twitter:image" />
    </Head>
  );
};

export default SeoHead;
