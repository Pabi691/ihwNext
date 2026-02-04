import React from 'react';
import MetaData from '../../layout/MetaData';
import MetaContentConfig from '../../content/MetaContentConfig';

function ProductMeta({ product }) {
  if (!product) return null;

  return (
    <MetaData
      title={
        product.seo_metadata?.meta_title ||
        `${product.prod_name} | Indian Hair World`
      }
      description={
        product.seo_metadata?.meta_description ||
        product.prod_desc ||
        MetaContentConfig.default.description
      }
      keywords={
        product.seo_metadata?.meta_keywords ||
        product.product_tag ||
        MetaContentConfig.default.keywords
      }
      image={
        product.seo_metadata?.og_image ||
        product.primary_img ||
        MetaContentConfig.default.image
      }
      url={product.seo_metadata?.og_url}
    />
  );
}

export default ProductMeta;
