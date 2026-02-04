import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@/components/compat/router';
import { useGlobal } from '../global/GlobalContext';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import compressImage from '../utils/compressImage';
import { themeBgColor } from '../styles/typography';

function ShopByCategorySkincare({ title }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useGlobal();

  const fetchSkincareProducts = useCallback(async () => {
    try {
      const cached = sessionStorage.getItem('skincareproducts');

      if (cached && cached !== "") {
        try {
          setProducts(JSON.parse(cached));
        } catch (error) {
          console.error('Error parsing cached skincare products:', error);
        } 
        setLoading(false);
        return;
      }

      if (cached === "") {
        sessionStorage.removeItem('skincareproducts');
        setProducts([]);
        setLoading(true);
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_slug_data/skincare`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedProducts = response?.data?.products;

      if (response.status === 200 && Array.isArray(fetchedProducts)) {
        setProducts(fetchedProducts);
        sessionStorage.setItem('skincareproducts', JSON.stringify(fetchedProducts));
      } else {
        throw new Error('Invalid product data');
      }
    } catch (err) {
      console.error('Skincare product fetch error:', err);
      setError('Failed to load skincare products.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSkincareProducts();
  }, [fetchSkincareProducts]);

  return (
    <div className={`${themeBgColor} pt-3 bg-opacity-5`}>
      <h4 className="text-start md:text-center my-4 md:my-8  capitalize md:uppercase">
        {title}
      </h4>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex flex-wrap gap-3 px-2 justify-center">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5" key={index}>
                <Skeleton height={200} width="100%" />
              </div>
            ))
          : products.map((product) => (
              <div className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5" key={product.id}>
                <Link to={`/product/${product.slug}`} className="block bg-white shadow-md rounded-md overflow-hidden">
                  <div className="relative aspect-[3/4]">
                    <img
                      src={compressImage(product.primary_img, 400, 70, 'webp')}
                      alt={product.prod_name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2">
                    <h5 className="text-sm font-semibold text-gray-800 line-clamp-2">{product.prod_name}</h5>
                    <p className="text-sm text-green-600 font-bold mt-1">₹{product.sale_price || product.regular_price}</p>
                    {product.product_tag && (
                      <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        {product.product_tag}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
      </div>
    </div>
  );
}

export default ShopByCategorySkincare;


