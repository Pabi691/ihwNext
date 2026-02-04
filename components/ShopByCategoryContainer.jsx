import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@/components/compat/router';
import { useGlobal } from '../global/GlobalContext';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import compressImage from '../utils/compressImage';
import { themeBgColor } from '../styles/typography';

function ShopByCategoryContainer({title}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useGlobal();

  const fetchContainerCategory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const cachedCategories = sessionStorage.getItem('container');

      if (cachedCategories) {
        // const parsed = JSON.parse(cachedCategories);
        // console.log('JSON.parse(cachedCategories)', JSON.parse(cachedCategories));
        setCategories((JSON.parse(cachedCategories)));
        setLoading(false);
        return;
      }

      if(cachedCategories === '') {
        sessionStorage.removeItem('container');
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_slug_data/container`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data?.category_data?.child_categories) {
        const fetchedCategories = response.data.category_data.child_categories;
        // console.log('isArrayWoMen', fetchedCategories);
        const isArray = Array.isArray(fetchedCategories) ? fetchedCategories : [fetchedCategories];
        // console.log('isArrayWoMen', JSON.stringify(isArray));
        // sessionStorage.setItem('womencategories', JSON.stringify(isArray));
        // sessionStorage.setItem('womencategories', fetchedCategories);
        setCategories(isArray);
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
    fetchContainerCategory();
  }, [fetchContainerCategory]);

  return (
    <div className={`${themeBgColor} pt-3 bg-opacity-5`}>
      <h4 className="text-start md:text-center my-4 md:my-8  capitalize md:uppercase">
        {title}
      </h4>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="women_category flex flex-wrap">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div className="women_category_item w-1/2 md:w-1/4 mb-4" key={index}>
                <Skeleton height={450} width={"100%"} />
              </div>
            ))
          : categories.map((cat) => (

            <>

            <div className="women_category_item w-1/2 md:w-1/4 mb-4 relative" key={cat.id}>
                <Link className="w-full h-full absolute left-0 top-0 z-10" to={`/${cat.slug}`} />
                <div className="bg-white shadow overflow-hidden relative h-[450px] w-full">
                  <img
                    src={compressImage(cat.cat_img, 400, 70, 'webp')}
                    alt={cat.category_name}
                    className="w-full absolute bottom-0 left-0" loading="lazy"
                  />
                  <p className="p-2 text-sm font-semibold text-gray-800 absolute">{cat.category_name}</p>
                </div>
              </div>

            {cat.child_categories && cat.child_categories.length > 0 && (
                  cat.child_categories.map(child => (
                    <div className="women_category_item w-1/2 md:w-1/4 mb-4 relative h-[450px]">
                    <div key={child.id}>
                      <Link className="w-full h-full absolute left-0 top-0 z-10" to={`/${child.slug}`} />
                      <div className="bg-white shadow overflow-hidden relative h-[450px] w-full">
                        <img
                          src={compressImage(child.cat_img, 400, 70, 'webp')}
                          alt={child.category_name}
                          className="w-full h-full object-cover absolute top-0 left-0" loading="lazy"
                        />
                      </div>
                    </div>
                    </div>
                  ))          
              )}
            </>
              
            ))}
      </div>
    </div>
  );
}

export default ShopByCategoryContainer;


