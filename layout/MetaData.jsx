// MetaData.jsx
import React from 'react';
import Head from 'next/head';

const MetaData = ({ title, description, keywords, image, url }) => {

  const metaTitle = title || "";
  const metaDescription = description || "";
  const metaKeywords = keywords || "";
  const metaImage = image || "";
  const metaUrl = url || "";

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Canonical */}
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:type" content="website" />

    </Head>
  );
};

export default MetaData;

