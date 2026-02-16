import React from 'react';
import MainLayOut from '@/layout/MainLayOut';
import ProductDetailsAll from '@/components/products/ProductDetailsAll';
// import { ProductDetailsPage } from '../components/products';
import MobileMainLayout from '@/layout/MobileMainLayout';
import type { GetServerSideProps } from "next";
import { normalizeSeoFromApi, toAbsoluteUrl } from "@/utils/seo";

function ProductDetails() {
 
  return (
    <>
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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = process.env.NEXT_PUBLIC_WEB_TOKEN;
  let apiData = null;

  if (apiUrl && token) {
    try {
      const res = await fetch(`${apiUrl}/api/v1/get_slug_data/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        apiData = await res.json();
      }
    } catch {
      apiData = null;
    }
  }

  const pathname = `/product/${slug}`;
  const seo = normalizeSeoFromApi(apiData, pathname, slug);

  return {
    props: {
      seo: {
        ...seo,
        canonicalUrl: toAbsoluteUrl(seo.canonicalUrl, pathname),
        ogUrl: toAbsoluteUrl(seo.ogUrl, pathname),
        ogImage: toAbsoluteUrl(seo.ogImage, "/logo.png"),
      },
    },
  };
};

export default ProductDetails;
