import React from 'react';
import { themeTextColor } from '../../styles/typography';

function ProductInfo({ product, reviews }) {
  const overallRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h2 className="font-semibold text-sm md:text-lg uppercase">
            {product.brand_details?.brand_name}
          </h2>
          <p className="text-gray-500">{product.prod_name}</p>
        </div>

        {reviews && (
          <p className={`${themeTextColor} font-semibold`}>
            {overallRating} | {reviews.length} Reviews
          </p>
        )}
      </div>

      <div className="flex gap-4 mt-3">
        <p className="font-semibold text-lg">
          ₹ {product.sale_price || product.regular_price}
        </p>

        {product.sale_price && (
          <p className="line-through text-gray-500">
            ₹ {product.regular_price}
          </p>
        )}

        {product.sale_price && (
          <p className="text-green-600">
            {(100 - (product.sale_price / product.regular_price) * 100).toFixed(
              2
            )}
            % OFF
          </p>
        )}
      </div>

      <p className="text-gray-500">Exclusive of all taxes</p>
    </>
  );
}

export default ProductInfo;
