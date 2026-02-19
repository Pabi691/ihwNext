import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const isBrowser = typeof window !== 'undefined';
    const rawWishlist = isBrowser ? localStorage.getItem('wishlistItems') : null;
    if (rawWishlist) {
      try {
        const parsedWishlist = JSON.parse(rawWishlist);
        setWishlistItems(parsedWishlist || []);
      } catch (error) {
        console.error('Error parsing wishlist data:', error);
        setWishlistItems([]);
      }
    }
  }, []);

  // Sync wishlist to localStorage when it changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
      }
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlistItems]);

  const addToWishlist = (item) => {
    if (!wishlistItems.find((wishlistItem) => wishlistItem.id === item.id)) {
      const updatedWishlist = [...wishlistItems, item];
      setWishlistItems(updatedWishlist);
    }
  };

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updatedWishlist);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
