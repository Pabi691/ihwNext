import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";

const GlobalContext = createContext();
export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children, initialGlobalContent }) => {
  const apiBase = `${process.env.NEXT_PUBLIC_API_URL}/api`;
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [container, setContainer] = useState([]);
  const [accessoriesCat, setAccessoriesCat] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [globalContentData, setGlobalContentData] = useState(initialGlobalContent || null);

  const hasFetchedProducts = useRef(false);

  const webToken = process.env.NEXT_PUBLIC_WEB_TOKEN;
  // const [token, setToken] = useState(() => localStorage.getItem("userToken") || webToken); 

  const [token, setToken] = useState(() => {
    if (!isBrowser) return webToken;
    const storedToken = localStorage.getItem("userToken");
    const verified = localStorage.getItem("uservarified");
    return storedToken && verified !== null ? storedToken : webToken;
  });
  const safeToken = token || webToken;
  const publicToken = webToken;

  const cartLength = useMemo(() => cart?.length || 0, [cart]);

  // 🛒 Merge local cart items with server
  const mergeLocalCartWithServer = useCallback(async (userToken) => {
    if (!isBrowser) return;
    const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
    if (!localCart.length) return;

    try {
      for (const item of localCart) {
        await axios.post(`${apiBase}/v1/add_to_cart`, {
          product_id: item.id,
          prod_variation_id: item.prod_variation_id,
          quantity: item.quantity || 1,
          price: item.sale_price,
        }, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      }
      localStorage.removeItem("localCart");
    } catch (err) {
      console.error("Merge cart error:", err);
    }
  }, []);

  // 🧾 Fetch Cart
  const fetchCart = useCallback(async () => {
    if (!isBrowser) return;
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
      setCart(Array.isArray(localCart) ? localCart : []);
      return;
    }

    try {
      await mergeLocalCartWithServer(token);
      // console.log("userToken", userToken);
      const { data } = await axios.get(`${apiBase}/v1/get_customer_cart`, {
        headers: { Authorization: `Bearer ${safeToken}` },
      });
      // console.log('test', data);
      setCart(data.cart_items || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  }, [mergeLocalCartWithServer, safeToken, isBrowser]);

  // 💖 Fetch Wishlist
  const fetchWishlist = useCallback(async () => {
    if (!safeToken || safeToken === webToken) return;
    try {
      const { data } = await axios.get(`${apiBase}/v1/get_customer_wishlist`, {
        headers: {
          Authorization: `Bearer ${safeToken}`,
          "Content-Type": "application/json",
        },
      });
      if (data.status) {
        setWishlist(data.wishlist);
      }
    } catch (err) {
      console.error("Fetch wishlist error:", err);
    }
  }, [safeToken, webToken]);

  // 🛍️ Fetch Products
  const fetchProducts = useCallback(async () => {
    if (hasFetchedProducts.current) return;
    try {
      const res = await fetch(`${apiBase}/v1/get_active_products`, {
        headers: { Authorization: `Bearer ${safeToken}` },
      });
      const data = await res.json();
      // console.log('data', data);
      if (data.status) {
        setProducts(data.products);
        hasFetchedProducts.current = true;
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  }, [safeToken, apiBase]);

  // 🧠 Add to Cart
  const addToCart = useCallback(async (product, selectedSize) => {
    const userToken = isBrowser ? localStorage.getItem("userToken") : null;

    if (!product || !product.id || !product.sale_price) {
      console.error("Invalid product:", product);
      return;
    }

    const selectedVariation = product.product_variations?.find(
      (v) => v.id === selectedSize
    );

    const payload = {
      product_id: product.id,
      prod_variation_id: selectedSize,
      quantity: 1,
      price: selectedVariation?.sale_price || product.sale_price,
    };

    if (userToken) {

      // if(cart.length > 0) {
      //   const isInCart = cart.some((item) => item.product_id === product.id);
      //   console.log('not selected', isInCart);
      //   if (isInCart) return;
      // }

      try {
        await axios.post(`${apiBase}/v1/add_to_cart`, payload, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        fetchCart();
      } catch (err) {
        console.error("Add to cart failed:", err);
      }
    } else if (isBrowser) {
      const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
      const exists = localCart.find((item) => item.product_id === product.id);
      const updatedCart = exists
        ? localCart.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        : [...localCart, { ...product, quantity: 1, prod_variation_id: selectedSize, product_id: product.id }];

      localStorage.setItem("localCart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
  }, [fetchCart, isBrowser]);

  // 💘 Add/Remove Wishlist
  const addToWishlist = useCallback(async (product) => {
    const isInWishlist = wishlist.some((item) => item.product_id === product.id);

    try {
      const res = await fetch(`${apiBase}/v1/add_to_wishlist`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${safeToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
          prod_variation_id: product.prod_variation_id,
        }),
      });
      const data = await res.json();

      if (data.status) {
        setWishlist((prev) =>
          isInWishlist
            ? prev.filter((item) => item.product_id !== product.id)
            : [...prev, product]
        );
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  }, [wishlist, safeToken]);

  // 🔄 Increase/Decrease Quantity
  const increaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((item) => item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prev) =>
      prev
        .map((item) => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  // 💵 Cart Totals
  const calculateSummary = useCallback(() => {
    // Ensure cart is an array
    const items = Array.isArray(cart) ? cart : []; // Fallback to empty array if not an array

    // Calculate total amount, total MRP, and subtotal
    const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.product_variation?.sale_price ?? item.sale_price) * item.quantity, 0);
    const totalMRP = items.reduce((sum, item) => sum + parseFloat(item.product_variation?.regular_price ?? item.regular_price) * item.quantity, 0);
    const subtotal = totalAmount; // You could use the same calculation for subtotal as totalAmount

    const CGST = subtotal * 0.09
    const SGST = subtotal * 0.09
    const totalGST = CGST + SGST
    const grandTotal = subtotal + totalGST

    const savings = totalAmount < totalMRP ? (totalMRP - grandTotal) : 'N/A';

    return { totalMRP, subtotal, savings, totalAmount, CGST, SGST, totalGST, grandTotal };
  }, [cart]);

  const { totalMRP, subtotal, savings, totalAmount, CGST, SGST, totalGST, grandTotal } = calculateSummary();

  // 🔐 Logout
  const logout = () => {
    setToken(webToken);
    localStorage.removeItem("userToken");
    setCart([]);
    setWishlist([]);
  };

  // 🧠 Initial Load
  useEffect(() => {
    fetchWishlist();
    fetchCart();
    fetchProducts();
  }, [fetchWishlist, fetchCart, fetchProducts]);

  return (
    <GlobalContext.Provider
      value={{
        token: safeToken,
        publicToken,
        setToken,
        products,
        wishlist,
        setWishlist,
        addToWishlist,
        cart,
        cartLength,
        setCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        totalMRP,
        subtotal,
        CGST,
        SGST,
        totalGST,
        grandTotal,
        savings,
        totalAmount,
        mergeLocalCartWithServer,
        logout,
        globalContentData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

