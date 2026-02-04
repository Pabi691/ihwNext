import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const rawWishlist = localStorage.getItem('wishlistItems');
    // console.log('Raw Wishlist Data from localStorage:', rawWishlist);
    if (rawWishlist) {
      try {
        const parsedWishlist = JSON.parse(rawWishlist);
        // console.log('Parsed Wishlist:', parsedWishlist);
        setWishlistItems(parsedWishlist || []);
      } catch (error) {
        console.error('Error parsing wishlist data:', error);
        setWishlistItems([]); // Initialize as empty if parsing fails
      }
    }
  }, []);

  // Sync wishlist to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
      // console.log('Wishlist saved to localStorage:', wishlistItems);
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
