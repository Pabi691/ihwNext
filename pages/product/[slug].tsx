import React from 'react';
import MainLayOut from '@/layout/MainLayOut';
import ProductDetailsAll from '@/components/products/ProductDetailsAll';
// import { ProductDetailsPage } from '../components/products';
import MobileMainLayout from '@/layout/MobileMainLayout';

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

export const getServerSideProps = async () => {
  return { props: {} };
};

export default ProductDetails;
