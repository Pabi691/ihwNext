// @ts-nocheck
import React, { useState } from 'react';
import axios from 'axios';
import { useGlobal } from '../global/GlobalContext';
import { FaTrashCan } from 'react-icons/fa6';
import { Link, useNavigate } from '@/components/compat/router';
import SimpleLayout from '../layout/SimpleLayout';
import { themeBgColor } from '../styles/typography';

const Wishlist = () => {
  const { wishlist, addToCart, token, setWishlist } = useGlobal();

  const [showPopup, setShowPopup] = useState(false);
  const [popupItem, setPopupItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  /* -------------------- Helpers -------------------- */

  const getVariations = (item) =>
    item?.product_variations || item?.product_variation || [];

  const hasValidSize = (item) =>
    getVariations(item).some(
      (v) => v.size_id !== null && v.size_id !== undefined
    );

  /* ---------------- Wishlist Actions ---------------- */

  const removeFromWishlist = async (productId) => {
    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/delete_wishlist_item/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWishlist((prev) => prev.filter((i) => i.id !== productId));
    } catch (error) {
      console.error('Wishlist remove failed:', error);
    }
  };

  /* ---------------- Add To Cart Logic ---------------- */

  const handleAddToCart = async (item) => {
    const product = item.product || item;

    // Product has sizes → open popup
    if (hasValidSize(item)) {
      setPopupItem(item);
      setSelectedSize(null);
      setShowPopup(true);
      return;
    }

    // Product has NO sizes → direct add
    try {
      setIsLoading(true);
      await addToCart(product, null);
      navigate('/cart');
    } catch (error) {
      console.error('Direct add to cart failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupItem(null);
    setSelectedSize(null);
  };

  /* -------------------- UI -------------------- */

  return (
    <SimpleLayout
      title="My Wishlist"
      ProductsCount={`(${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'
        })`}
    >
      <div className="max-w-7xl mx-auto p-4">
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => {
              const product = item.product || item;

              return (
                <div key={item.id} className="border p-4 rounded-lg">
                  <Link to={`../product/${product.slug}`}>
                    <img
                      src={product.primary_img}
                      alt={product.prod_name}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </Link>

                  <h3 className="text-sm font-semibold mt-2 truncate">
                    {product.prod_name}
                  </h3>

                  <div className="flex gap-3 my-2">
                    <p className="font-bold text-sm">₹{product.sale_price}</p>
                    <p className="line-through text-gray-400 text-sm">
                      ₹{product.regular_price}
                    </p>
                  </div>

                  <div className="flex justify-between border-t pt-2">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-sm underline"
                    >
                      <FaTrashCan />
                    </button>

                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isLoading}
                      className={`${themeBgColor} text-white text-xs px-4 py-2 rounded-lg`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center my-8">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              className="mb-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.62 20.29L12 20.77L11.38 20.29C6.21 16.28 2.5 13.06 2.5 9.14C2.5 6.34 4.68 4.25 7.25 4.25C8.89 4.25 10.46 5.14 11.25 6.42C12.04 5.14 13.61 4.25 15.25 4.25C17.82 4.25 20 6.34 20 9.14C20 13.06 16.29 16.28 11.12 20.29Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="text-center text-gray-700 font-semibold text-sm my-2">
              Your wishlist is feeling a little lonely 💔
            </p>
            <p className="text-center text-gray-400 mt-2 text-xs max-w-xs leading-5">
              But that's okay! Tap that ❤️ on your favorite items and build your dream list.
              Start discovering styles made just for you!
            </p>
            <button
              onClick={() => navigate('/')} // or use useNavigate if in React Router
              className={`my-6 px-6 py-2 ${themeBgColor} text-white text-sm rounded-md hover:bg-gray-800 transition-all`}
            >
              Start Exploring
            </button>
          </div>
        )}
      </div>

      {/* ---------------- Size Popup ---------------- */}

      {showPopup && popupItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <h3 className="text-lg font-semibold mb-4">Select Size</h3>

            <div className="flex gap-2 mb-4 flex-wrap">
              {getVariations(popupItem)
                .filter((v) => v.size)
                .map((v) => (
                  <label
                    key={v.id}
                    className={`border px-3 py-1 text-xs cursor-pointer ${selectedSize === v.id
                        ? `border-black ${themeBgColor} text-white`
                        : 'border-gray-300'
                      }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      checked={selectedSize === v.id}
                      onChange={() => setSelectedSize(v.id)}
                    />
                    {v.size}
                  </label>
                ))}
            </div>

            <button
              disabled={!selectedSize || isLoading}
              className={`${themeBgColor} text-white w-full py-2 text-xs rounded disabled:opacity-50`}
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await addToCart(
                    popupItem.product || popupItem,
                    selectedSize
                  );
                  navigate('/cart');
                } catch (error) {
                  console.error('Size add to cart failed:', error);
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {isLoading ? 'Adding...' : 'Add to Cart'}
            </button>

            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </SimpleLayout>
  );
};

export default Wishlist;


