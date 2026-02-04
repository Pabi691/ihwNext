import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@/components/compat/router';
import { useGlobal } from '../global/GlobalContext';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import compressImage from '../utils/compressImage';
import { themeBgColor } from '../styles/typography';

function ShopByCategoryAccessories({ title }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useGlobal();

  const fetchAccessoriesCategory = useCallback(async () => {
    setError(null);

    try {
      const cachedCategories = sessionStorage.getItem('accessoriescategories');

      if (cachedCategories) {
        setCategories(JSON.parse(cachedCategories));
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_slug_data/accessories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 && response.data?.category_data?.child_categories) {
        const fetchedCategories = response.data.category_data.child_categories;
        const isArray = Array.isArray(fetchedCategories)
          ? fetchedCategories
          : [fetchedCategories];

        setCategories(isArray);
        sessionStorage.setItem('accessoriescategories', JSON.stringify(isArray));
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (err) {
      setError('Error fetching categories. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAccessoriesCategory();
  }, [fetchAccessoriesCategory]);

  return (
    <div className={`${themeBgColor} py-3 bg-opacity-5`}>
    <h4 className="text-start md:text-center my-4 md:my-8  capitalize md:uppercase">
        {title}
    </h4>

    {error && <p className="text-red-500 text-center">{error}</p>}

    <div className="men_category flex flex-wrap gap-x-2 gap-y-4 px-2">
        {loading
        ? Array.from({ length: 4 }).map((_, index) => (
            <div className="w-1/2 md:w-1/4" key={index}>
                <Skeleton height={200} width="100%" />
            </div>
            ))
        : Array.isArray(categories) &&
            categories.map((cat) => (
            <React.Fragment key={cat.id}>
                <div className="w-1/2 md:w-1/4 relative">
                <div className="bg-white shadow-md overflow-hidden rounded-md relative aspect-[3/4] w-full">
                    <Link
                    className="absolute inset-0 z-10"
                    to={`/${cat.slug}`}
                    />
                    <img
                    src={compressImage(cat.cat_img, 400, 70, 'webp')}
                    alt={cat.category_name}
                    className="w-full h-full object-cover absolute inset-0"
                    loading="lazy"
                    />
                </div>
                </div>

                {cat.child_categories &&
                cat.child_categories.map((child) => (
                    <div className="w-1/2 md:w-1/4 relative" key={child.id}>
                    <div className="bg-white shadow-md overflow-hidden rounded-md relative aspect-[3/4] w-full">
                        <Link
                        className="absolute inset-0 z-10"
                        to={`/${child.slug}`}
                        />
                        <img
                        src={compressImage(child.cat_img, 400, 70, 'webp')}
                        alt={child.category_name}
                        className="w-full h-full object-cover absolute inset-0"
                        loading="lazy"
                        />
                    </div>
                    </div>
                ))}
            </React.Fragment>
            ))}
    </div>
    </div>

  );
}

export default ShopByCategoryAccessories;


