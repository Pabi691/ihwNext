import React from 'react';
import { FaCartPlus } from 'react-icons/fa';
import { FaBolt } from 'react-icons/fa6';
import WishlistButton from '../WishlistButton';
import { themeBgColor } from '../../styles/typography';

function AddToCartActions({
  product,
  addSuccess,
  addedProductName,
  onAdd,
  onBuy,
  wishlist,
  setWishlist,
}) {
  return (
    <div className="flex flex-wrap mt-4">
      <button
        onClick={onAdd}
        className={`text-white px-6 gap-2 m-2 py-2 
        rounded-lg flex items-center text-sm font-semibold ${addSuccess ? 'bg-[#2CA003] flex-col w-full' : themeBgColor}`}
      >
        {addSuccess && addedProductName}
        {addSuccess && (<hr className='h-1 text-white w-full' />)}
        {!addSuccess && (<FaCartPlus />)}
        <div className='flex gap-2 items-center'>
          <span className={`hidden md:block ${addSuccess && 'text-black'}`}>{addSuccess ? 'Go to Bag' : 'Add to Cart'}</span>
          {addSuccess && (
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
              <path d="M9.5 3L14.5 8M14.5 8L9.5 13M14.5 8H2.5" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </button>

      <button
        onClick={onBuy}
        className={`text-white ${themeBgColor} px-6 gap-2 my-2 py-2 rounded-lg flex items-center text-sm font-semibold transform transition-transform duration-300 hover:scale-105 hover:shadow-lg`}
      >
        <FaBolt className="text-yellow-400" />
        BUY NOW
      </button>

      <WishlistButton
        product={product}
        wishlist={wishlist}
        setWishlist={setWishlist}
        content
      />
    </div>
  );
}

export default AddToCartActions;
