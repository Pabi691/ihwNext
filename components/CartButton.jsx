import React, { useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";

const CartButton = ({ product, cart, setCart, token, API_BASE_URL, fetchCart, addToCart, selectedSize  }) => {
  const [loading, setLoading] = useState(false); // State for loader

  // Remove from cart handler
  const removeFromCart = async (cartId) => {
    setLoading(true);
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/delete_cart_item/${cartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refetch the cart after removing item
      fetchCart();
      setCart((prev) => prev.filter((item) => item.id !== cartId));

      toast.success("Item removed from cart!", {
        position: "center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error removing item from cart:", error.response?.data?.message || error.message);
      toast.error("Failed to remove item from cart.");
    } finally {
      setLoading(false);
    }
  };

  // Add to cart handler
  const handleAddToCart = (product) => {
    // if(!selectedSize) {
    //   setOpenSizesBox(true);
    //   return;
    // }
    setLoading(true);
    try {
      addToCart(product);
      setCart((prev) => [...prev, { ...product, product_id: product.id }]);

      toast.success(`${product.name} added to your Cart!`, {
        position: "center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
      toast.error("Failed to add item to cart.");
    } finally {
      setLoading(false);
    }
  };

  // Determine if product is in cart
  const isInCart = cart.some((item) => item.product_id === product.id);

  return isInCart ? (
    <button
      className="text-black"
      onClick={() => {
        const cartId = cart.find((item) => item.product_id === product.id).id;
        removeFromCart(cartId);
      }}
      disabled={loading} // Disable button while loading
    >
      {loading ? (
        <span className="loader"></span> // Add a loader (can customize with CSS)
      ) : (
        <FaCartShopping />
      )}
    </button>
  ) : (
    <button
      className="text-gray-400"
      onClick={() => handleAddToCart(product)}
      disabled={loading} // Disable button while loading
    >
      {loading ? (
        <span className="loader"></span> // Add a loader (can customize with CSS)
      ) : (
        <FaCartPlus />
      )}
    </button>
  );
};

export default CartButton;

