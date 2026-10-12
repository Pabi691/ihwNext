import React from 'react';
import MainLayOut from '@/layout/MainLayOut';
import ProductDetailsAll from '@/components/products/ProductDetailsAll';
// import { ProductDetailsPage } from '../components/products';
import MobileMainLayout from '@/layout/MobileMainLayout';
import type { GetServerSideProps } from "next";
import { toAbsoluteUrlIfPresent } from "@/utils/seo";
import { fetchPageSeo } from "@/utils/serverSeo";
import Head from 'next/head';

function ProductDetails({ seo, productData }: any) {
  const schema = productData ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": productData.prod_name,
    "image": productData.primary_img,
    "description": productData.prod_desc ? productData.prod_desc.replace(/<[^>]*>?/gm, '').substring(0, 150) : "",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": productData.sale_price || productData.regular_price,
      "availability": productData?.stock_qty > 0 || productData.product_variations?.some((v: any) => v.stock_qty > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  } : null;

  return (
    <>
      {seo && productData && (
        <Head>
          <meta property="product:price:amount" content={productData.sale_price || productData.regular_price || ""} />
          <meta property="product:price:currency" content="INR" />
          <meta property="product:availability" content={productData?.stock_qty > 0 || productData.product_variations?.some((v: any) => v.stock_qty > 0) ? "in stock" : "out of stock"} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        </Head>
      )}
      <div className='hidden md:block'>
        <MainLayOut >
          <ProductDetailsAll />
        </MainLayOut>
      </div>
      <div className='md:hidden sigle_product_headline'>
        <MobileMainLayout title='Indian Hair World' link={'/'}>
          <ProductDetailsAll />
        </MobileMainLayout>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slugValue = context.params?.slug;
  const slug = Array.isArray(slugValue) ? slugValue[0] : slugValue;

  if (!slug) {
    return { props: {} };
  }

  const pathname = `/product/${slug}`;
  const { productData, slugLookupAnswered, ...seo } = await fetchPageSeo(pathname, slug);

  // The backend answered and there is no such product: a real 404, so made-up
  // or retired /product/... URLs stop counting as pages. If the backend could
  // not be reached we still render, rather than 404 a genuine product.
  if (!productData && slugLookupAnswered) {
    return { notFound: true };
  }

  return {
    props: {
      seo: {
        ...seo,
        canonicalUrl: toAbsoluteUrlIfPresent(seo.canonicalUrl),
        ogUrl: toAbsoluteUrlIfPresent(seo.ogUrl),
        ogImage: toAbsoluteUrlIfPresent(seo.ogImage),
      },
      productData: productData || null,
    },
  };
};

export default ProductDetails;
