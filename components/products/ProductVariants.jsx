import React from 'react';
import { Link } from '@/components/compat/router';
import { themeBgColor, themeTextColor } from '../../styles/typography';

function ProductVariants({
  product,
  productVariations,
  colorVariations,
  selectedSize,
  setSelectedSize,
  openSizeChart,
  setOpenSizeChart,
  setSizeChart,
}) {
  return (
    <>
      {/* Color */}
      {productVariations.some(v => v.color) && (
        <div className="mt-4">
          <p className="font-medium my-3">Select Color</p>
          <div className="flex items-center gap-3">
            {productVariations
              .filter(
                (variation) =>
                  variation.color !== null && variation.color_page_link !== "null"
              )
              .map((variation) => (
                <React.Fragment key={variation.color_id}>
                  <Link
                    className="w-8 h-8 rounded-full border border-[#b7b5b5] inline-block"
                    to={variation.color_page_link}
                    style={{ backgroundColor: variation.color }}
                  ></Link>
                </React.Fragment>
              ))}
          </div>
        </div>
      )}

      {/* Size */}
      {productVariations.some(v => v.size_id !== null) && (
        <div className={`mt-6 ${openSizeChart ? 'openPopup' : ''}`}>
          <div className="flex justify-between">
            <p className="font-medium">Select Size</p>
            {product.size_chart_details && (
              <button
                onClick={() => setSizeChart(true)}
                className={themeTextColor}
              >
                SIZE GUIDE
              </button>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            {productVariations
              .filter(v => v.size)
              .map(size => (
                <label
                  key={size.size_id}
                  className={`border rounded-lg px-3 py-1 cursor-pointer
                  ${selectedSize === size.id
                      ? `${themeBgColor} text-white`
                      : ''
                    }`}
                >
                  <input
                    type="radio"
                    hidden
                    disabled={size.stock_qty === 0}
                    onChange={() => setSelectedSize(size.id)}
                  />
                  {size.size}
                </label>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ProductVariants;

