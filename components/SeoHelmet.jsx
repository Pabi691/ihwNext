import Head from "next/head";
const SeoHelmet = ({ seo }) => {
    if (!seo) return null;

    return (
        <>
        <Head>
                <title>{seo.meta_title}</title>
                <link rel="canonical" href={seo.canonical_url} />
                <meta name="description" content={seo.meta_description} />
                <meta name="keywords" content={seo.meta_keywords} />

                {/* Open Graph */}
                <meta property="og:title" content={seo.og_title} />
                <meta property="og:description" content={seo.og_description} />
                <meta property="og:image" content={seo.og_image} />
                <meta property="og:url" content={seo.og_url} />
                <meta property="og:type" content={seo.og_type} />
                {/* Twitter */}
                {/* <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.meta_title} />
      <meta name="twitter:description" content={seo.meta_description} />
      <meta name="twitter:image" content={seo.og_image} /> */}
            </Head>

        </>
            
    );
};

export default SeoHelmet;
