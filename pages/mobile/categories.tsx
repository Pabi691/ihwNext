// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from '@/components/compat/router';
import axios from 'axios';
import BottomFixedNav from '../../components/mobileComponents/BottomFixedNav';
import { useGlobal } from '../../global/GlobalContext';
import compressImage from '../../utils/compressImage';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useGlobal();
  const navigate = useNavigate();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [activeCategory, setActiveCategory] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || 'planters';
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShouldRedirect(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCategoryData = async (category) => {
      setLoading(true);
      const categoryKeyMap = {
        planters: 'planterscategories',
        container: 'containercategories',
        bucket: 'bucketcategories',
      };
      const sessionKey = categoryKeyMap[category];
      const sessionCategories = sessionStorage.getItem(sessionKey);
      // console.log('sessionKey', sessionKey);
      if (sessionCategories) {
        setLoading(true);
        
        try {
          const jsonSessionCat = JSON.parse(sessionCategories);
          // if (sessionKey === 'womencategories') {
          //   jsonSessionCat = JSON.parse(sessionCategories)?.child_categories;
          // }
          // console.log('sessionKey', sessionKey);
          // console.log('jsonSessionCat', jsonSessionCat);
          setCategories(jsonSessionCat);
          setSelectedCategory(jsonSessionCat.length > 0 ? jsonSessionCat[0] : null);
        } catch (error) {
          console.error("Failed to parse cached categories:", error);
        }
        setLoading(false);
        return;
      }
    
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_slug_data/${category}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log('response', response);
        const catData = response.data.category_data.child_categories;
        setCategories(catData);
        setSelectedCategory(catData.length > 0 ? catData[0] : null);
        // Store in session
        // sessionStorage.setItem(sessionKey, JSON.stringify(catData));
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData(activeCategory);
  }, [token, activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    navigate(`/categories?category=${category}`);
  };

  const handleSidebarClick = (item) => {
    setSelectedCategory(item);
  };

  // console.log('categories', categories);

  return shouldRedirect ? <Navigate to='/' replace /> : (
    <div>
      {/* Header Nav */}
      <div className="flex justify-around font-medium text-gray-600 shadow uppercase text-sm fixed top-0 w-full left-0 bg-white z-10">
        {['planters', 'container', 'bucket'].map((cat) => (
          <button
            key={cat}
            className={`border-b-4 px-4 py-2 uppercase ${activeCategory === cat ? 'border-black bg-white' : 'border-transparent'
              }`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex mt-10">
        {/* Sidebar */}
        <div className="py-4 w-1/3 bg-gray-300 fixed overflow-scroll scrollbar-none h-screen">
          {loading ? (
            <div className="px-4 space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-6 rounded animate-pulse w-3/4"></div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            categories.map((item) => (
              <div key={item.id} className="mb-2">
                <button
                  onClick={() => handleSidebarClick(item)}
                  className={`text-gray-600 text-xs text-left px-4 py-2 font-semibold w-full ${selectedCategory?.id === item.id ? 'bg-white' : ''
                    }`}
                >
                  {item.category_name}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">No items found</p>
          )}
        </div>

        {/* Body */}
        <div className="p-4 w-2/3 fixed right-0 h-screen overflow-y-scroll">
          <div className="flex flex-wrap gap-3">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="w-[47%] bg-gray-200 rounded-full animate-pulse" />
              ))
            ) : selectedCategory && selectedCategory.child_categories?.length > 0 ? (
              selectedCategory.child_categories.map((child) => (
                <Link to={`/${child.slug}`} className="w-[47%]" key={child.id}>
                  <img
                    loading="lazy"
                    className="w-full object-cover"
                    src={compressImage(child.cat_img, 400, 70, 'webp')}
                    alt={child.name}
                  />
                  <p className='font-semibold text-[10px] text-center uppercase'>{child.category_name}</p>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mb-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75h.008v.008H9.75V9.75zm0 4.5h.008v.008H9.75v-.008zm4.5-4.5h.008v.008H14.25V9.75zm0 4.5h.008v.008H14.25v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-lg font-medium text-center">No items found</p>
                <p className="text-sm text-gray-400 text-center">Please try adjusting your filters.</p>
              </div>

            )}
          </div>
        </div>
      </div>

      <BottomFixedNav />
    </div>
  );
};

export default Categories;


