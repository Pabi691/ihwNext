    import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@/components/compat/router';
import { useGlobal } from '../global/GlobalContext';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import compressImage from '../utils/compressImage';
import { themeBgColor } from '../styles/typography';

function ShopByCategoryFootwear({ title }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useGlobal();

  const fetchFootwearCategories = useCallback(async () => {
    try {
      const cached = sessionStorage.getItem('footwearcategories');

      if (cached !== null && cached !== undefined && cached !== "") {
        setCategories(JSON.parse(cached));
        setLoading(false);
        return;
      }

      if (cached === "") {
        sessionStorage.removeItem('footwearcategories');
        setCategories([]);
        setLoading(true);
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_slug_data/footwear`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetched = response?.data?.category_data?.child_categories;

      if (response.status === 200 && Array.isArray(fetched)) {
        setCategories(fetched);
        sessionStorage.setItem('footwearcategories', JSON.stringify(fetched));
      } else {
        throw new Error('Invalid category data');
      }
    } catch (err) {
      console.error('Footwear category fetch error:', err);
      setError('Failed to load footwear categories.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchFootwearCategories();
  }, [fetchFootwearCategories]);

  return (
    <div className={`${themeBgColor} pt-3 bg-opacity-5`}>
      <h4 className="text-start md:text-center my-4 md:my-8  capitalize md:uppercase">
        {title}
      </h4>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex flex-wrap gap-x-2 gap-y-4 px-2">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div className="w-1/2 md:w-1/4" key={index}>
                <Skeleton height={200} width="100%" />
              </div>
            ))
          : categories.map((cat) => (
              <div className="w-1/2 md:w-1/4 relative" key={cat.id}>
                <div className="bg-white shadow-md overflow-hidden rounded-md relative aspect-[3/4] w-full">
                  <Link to={`/${cat.slug}`} className="absolute inset-0 z-10" />
                  <img
                    src={compressImage(cat.cat_img, 400, 70, 'webp')}
                    alt={cat.category_name}
                    className="w-full h-full object-cover absolute inset-0"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default ShopByCategoryFootwear;


