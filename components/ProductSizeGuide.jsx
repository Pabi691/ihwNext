import React, { useState, useEffect } from 'react';
import { Link, useParams } from '@/components/compat/router';
import { useGlobal } from '../global/GlobalContext';
import { themeBgColor } from '../styles/typography';
// import API_BASE_URL from './../global/apiConfig';

function ProductSizeGuide() {
  const [selectedSize, setSelectedSize] = useState(null);
  const [productVariations, setProductVariations] = useState([]);
  const [colorVariations, setColorVariations] = useState([]);
  const { token } = useGlobal();
  const { slug } = useParams();

  // console.log('selectedSize', selectedSize);

  // localStorage.setItem('selectedSize', selectedSize );

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_slug_data/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.status) {
          const variations = data.product_details?.product_variations || [];
          const variationsColor = data.product_details?.color_details || [];
          setColorVariations(variationsColor);
          setProductVariations(variations);
          
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductDetails();
  }, [slug, token]);

 
  return (
    <div className="product-size-guide bg-white rounded-lg">
      {/* Color Selection */}
      {productVariations.some((variation) => variation.color_id !== null) ? (
      <div className="w-full mt-3 relative">
        <div className="flex mb-2 flex-col">
          <p className="font-medium text-lg text-gray-800 flex gap-2">
            Colour Options: <span>{colorVariations.color_name}</span>
          </p>
          <span className="text-gray-600 flex gap-4 mt-2 items-center">
            {productVariations
              .filter(
                (variation) => variation.color !== null && variation.color_page_link !== "null"
              )
              .map((variation) =>
                variation.color_id === colorVariations.id ? (
                  <div style={{
                    border: `2px solid ${variation.color}`,
                  }} className={`p-1 rounded-full`}>
                    <Link
                      className="w-8 h-8 rounded-full block border-2"
                      to={variation.color_page_link}
                      key={variation.color_id}
                      style={{ backgroundColor: variation.color }}
                    ></Link>
                    <span>{variation.id}</span>
                  </div>
                  
                ) : (
                  <>
                  <Link
                    className="w-8 h-8 rounded-full block border border-[#b7b5b5]"
                    to={variation.color_page_link}
                    key={variation.color_id}
                    style={{ backgroundColor: variation.color }}
                  ></Link>
                  <span>{variation.id}</span>
                  </>
                  
                )
              )}
          </span>
        </div>
      </div>
    ) : null}

      {/* Size Selection */}
      {productVariations.some((variation) => variation.size_id !== null)?(
      <div className="mt-4">
        <p className="font-medium text-lg text-gray-800 flex gap-2">
            Select Size
        </p>
        <div className="mt-2 flex gap-2">
        {Array.isArray(productVariations) && productVariations.length > 0 ? (
          productVariations
            .filter((size) => size.size !== null)
            .map((size) => (
              <label
                key={size.size_id}
                className={`cursor-pointer relative border-1 rounded-sm flex items-center justify-center border
                   transition-all duration-200 ease-in-out ${
                  selectedSize === size.id
                    ? `border-black ring-1 ring-black ${themeBgColor} text-white`
                    : 'border-gray-300'
                }`}
              >
                <span>
                  {size.id}
                </span>

                <input
                  type="radio"
                  name="size"
                  value={size.size}
                  checked={selectedSize === size.id}
                  onChange={() => setSelectedSize(size.id)}
                  className="absolute opacity-0 -z-10"
                />
                <div className="flex items-center justify-center text-center px-2 py-1 rounded-md">
                  {size.size}
                </div>
              </label>
            ))
        ) : null} 
          
        </div>

      </div>
      ):""}
    </div>
  );
}

export default ProductSizeGuide;


