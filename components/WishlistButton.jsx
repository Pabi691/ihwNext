import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "@/components/compat/router";
import { hoverScale } from "../styles/typography";

const WishlistButton = ({ product, wishlist, setWishlist, token, content }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const username = localStorage.getItem('username');
  // Remove from wishlist handler
  const removeFromWishlist = async (productId) => {
    setLoading(true);
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/delete_wishlist_item/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('productId',productId);

      // Update wishlist state
      setWishlist((prev) => prev.filter((item) => item.id !== productId));

      toast.success("Item removed from wishlist!", {
        position: "center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast.error("Failed to remove item from wishlist.");
    } finally {
      setLoading(false);
    }
  };

  // Add to wishlist handler
  const handleAddToWishlist = async (product) => {
    if (!username) {
      navigate('/login');
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/add_to_wishlist`,
        { product_id: product.id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update wishlist state
      setWishlist((prev) => [...prev, { ...product, product_id: product.id }]);

      toast.success(`${product.name} added to your wishlist!`, {
        position: "center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      toast.error("Failed to add item to wishlist.");
    } finally {
      setLoading(false);
    }
  };

  // Determine if product is in wishlist
  const isInWishlist = wishlist.some((item) => item.product_id === product.id);

  return (
    <button
      className={`${hoverScale} font-semibold ${content ? 'flex items-center gap-2 px-4 m-2 py-2 border rounded-lg' : ''} ${isInWishlist ? 'text-black' : 'text-gray-400'}`}
      onClick={() => {
        if (loading) return;
        if (isInWishlist) {
          const productId = wishlist.find((item) => item.product_id === product.id).id;
          removeFromWishlist(productId);
        } else {
          handleAddToWishlist(product);
        }
      }}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        <>
          {isInWishlist ? <FaHeart /> : <FaRegHeart />}
          {content && <span className="hidden md:inline-block">{isInWishlist ? 'Wishlisted' : 'Wishlist'}</span>}
        </>
      )}
    </button>

  )
};

export default WishlistButton;


