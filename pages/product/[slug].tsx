import React from 'react';
import MainLayOut from '@/layout/MainLayOut';
import ProductDetailsAll from '@/components/products/ProductDetailsAll';
// import { ProductDetailsPage } from '../components/products';
import MobileMainLayout from '@/layout/MobileMainLayout';
import type { GetServerSideProps } from "next";
import { toAbsoluteUrlIfPresent } from "@/utils/seo";
import { fetchPageSeo } from "@/utils/serverSeo";

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

  const pathname = `/product/${slug}`;
  const seo = await fetchPageSeo(pathname, slug);

  return {
    props: {
      seo: {
        ...seo,
        canonicalUrl: toAbsoluteUrlIfPresent(seo.canonicalUrl),
        ogUrl: toAbsoluteUrlIfPresent(seo.ogUrl),
        ogImage: toAbsoluteUrlIfPresent(seo.ogImage),
      },
    },
  };
};

export default ProductDetails;
