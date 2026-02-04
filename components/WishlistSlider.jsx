import React, { useState } from 'react';
import axios from 'axios';
import { useGlobal } from '../global/GlobalContext';
import { FaTrashCan } from 'react-icons/fa6';
import { Link } from '@/components/compat/router';
import compressImage from '../utils/compressImage';

// Import Swiper core and required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { themeBgColor } from '../styles/typography';

const WishlistSlider = () => {
  const { setCart, wishlist, addToCart, token, setWishlist } = useGlobal();
  const [selectedSize, setSelectedSize] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupItem, setPopupItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const removeFromWishlist = async (productId) => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/delete_wishlist_item/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prevItems) => prevItems.filter((item) => item.id !== productId));
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  const openSizePopup = (item) => {
    setPopupItem(item);
    setShowPopup(true);
  };

  const closeSizePopup = () => {
    setShowPopup(false);
    setSelectedSize(null);
  };

  return (
    <div className="wishlist-page p-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link to={'/wishlist'} className="text-lg font-semibold">
        My Wishlist
      </Link>

      {wishlist.length === 0 ? (
        <>
          <div className="text-center text-lg font-bold my-10">
            Nothing there in wishlist to add cart !
          </div>
        </>

      ) : (
        <>
          {wishlist.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              navigation
              pagination={{ clickable: true }}
              className="my-4"
            >
              {wishlist.map((item) => (
                item.product &&
                (<SwiperSlide key={item.id}>
                  <div className="wishlist-item border rounded-lg shadow-md">
                    <Link to={`../product/${item.product.slug}`}>
                      <img
                        src={compressImage(item.product.primary_img, 400, 70, 'webp')}
                        alt={item.product.prod_name}
                        className="w-full h-[350px] object-cover object-top" loading="lazy"
                      />
                    </Link>
                    <div className='p-4'>
                    <h3 className="text-sm font-semibold mt-2 truncate">{item.product.prod_name}</h3>

<div className="flex items-center gap-3 my-2">
  <p className="text-black text-sm font-bold">₹{item.product.sale_price}</p>
  <p className="text-gray-500 line-through text-sm">₹{item.product.regular_price}</p>
  <p className="text_hightlight text-xs">
    {(((item.product.regular_price - item.product.sale_price) / item.product.regular_price) * 100).toFixed(2)}% OFF
  </p>
</div>

<div className="flex justify-between border-t-2 pt-2">
  <button onClick={() => removeFromWishlist(item.id)} className="text-black text-sm underline">
    <FaTrashCan />
  </button>

  <button
    onClick={() => openSizePopup(item)}
    className={`text-white ${themeBgColor} px-4 py-2 rounded-sm text-sm`}
  >
    Add to Cart
  </button>
</div>
                    </div>
                    
                  </div>
                </SwiperSlide>)
              ))}
            </Swiper>
          ) : (
            <p className="text-center my-8 text-gray-600">Your wishlist is empty!</p>
          )}

          {showPopup && popupItem && (
            <div className={`fixed inset-0 ${themeBgColor} bg-opacity-50 flex justify-center items-center z-30`}>
              <div className="bg-white p-6 rounded-lg w-96 relative">
                <h3 className="text-lg font-semibold mb-4">Select Size</h3>
                <div className='mb-4 flex gap-2'>
                  {popupItem.product_variation?.filter((size) => size.size && size.size.trim() !== '')
                    .map((size) => (
                      <label
                        key={size.size_id}
                        className={`cursor-pointer relative border 
                          rounded-md flex items-center justify-center min-w-8 h-8 text-sm 
                          font-medium transition-all duration-200 ease-in-out ${selectedSize === size.id
                            ? `border-black ring-1 ring-black ${themeBgColor} text-white`
                            : 'border-gray-300'
                          }`}
                      >
                        <input
                          type="radio"
                          name="size"
                          value={size.size}
                          checked={selectedSize === size.id}
                          onChange={() => setSelectedSize(size.id)}
                          className="absolute opacity-0 cursor-pointer"
                        />
                        {size.size}
                      </label>
                    ))}
                </div>
                <button
                  className={`${themeBgColor} text-white px-4 py-2 rounded-sm ml-auto block text-xs disabled:opacity-50`}
                  onClick={async () => {
                    if (!selectedSize) return;

                    setIsLoading(true);
                    try {
                      await addToCart(popupItem.product, selectedSize);
                      setSuccess(true);

                      // ✅ Correct cart update
                      setCart(prevCart => {
                        const updatedCartItems = [
                          ...(prevCart.cart_items || []),
                          {
                            product: popupItem.product,
                            product_id: popupItem.product.id, // If needed
                            size: selectedSize
                          }
                        ];

                        return {
                          ...prevCart,
                          cart_items: updatedCartItems
                        };
                      });
                      setShowPopup(false);
                      setSelectedSize(null);
                    } catch (error) {
                      console.error('Error adding to cart:', error);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={!selectedSize || isLoading}
                >
                  {isLoading ? "Adding..." : success ? "Added!" : "Add to Cart"}
                </button>
                <button
                  className="text-gray-500 absolute top-3 right-3"
                  onClick={closeSizePopup}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </>
      )
      }


    </div>
  );
};

export default WishlistSlider;


