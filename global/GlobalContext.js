import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import { ENV } from "../config/env";

const GlobalContext = createContext();
export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children, initialGlobalContent }) => {
  const isBrowser = typeof window !== "undefined";
  const apiBase = `${ENV.API_URL}/api`;
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [globalContentData, setGlobalContentData] = useState(initialGlobalContent || null);

  const hasFetchedProducts = useRef(false);

  const webToken = ENV.WEB_TOKEN;
  // const [token, setToken] = useState(() => localStorage.getItem("userToken") || webToken); 

  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return webToken;
    const storedToken = localStorage.getItem("userToken");
    const verified = localStorage.getItem("uservarified");
    return storedToken && verified !== null ? storedToken : webToken;
  });
  const safeToken = token || webToken;
  const publicToken = webToken;
  const isNoCustomerError = (data) =>
    data?.status === false &&
    /no customer data found/i.test(
      String(data?.error_message || data?.message || "")
    );

  const cartLength = useMemo(() => cart?.length || 0, [cart]);

  // 🛒 Merge local cart items with server
  const mergeLocalCartWithServer = useCallback(async (userToken) => {
    if (!isBrowser) return;
    const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
    if (!localCart.length) return;

    try {
      for (const item of localCart) {
        const productId = item.product_id ?? item.id;
        const variationId = item.prod_variation_id ?? null;
        const price = item.sale_price ?? item.regular_price ?? 0;
        if (!productId || !price) continue;

        await axios.post(`${apiBase}/v1/add_to_cart`, {
          product_id: productId,
          prod_variation_id: variationId,
          quantity: item.quantity || 1,
          price,
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
  }, [isBrowser, apiBase]);

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
      await mergeLocalCartWithServer(userToken);
      const getCartByToken = async (authToken) => {
        const { data } = await axios.get(`${apiBase}/v1/get_customer_cart`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        return data;
      };

      let data = await getCartByToken(userToken);
      if (isNoCustomerError(data) && webToken && webToken !== userToken) {
        data = await getCartByToken(webToken);
      }

      setCart(Array.isArray(data?.cart_items) ? data.cart_items : []);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  }, [mergeLocalCartWithServer, isBrowser, apiBase, webToken]);

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

    const endpoint = `${apiBase}/v1/get_active_products`;
    const tokenCandidates = [safeToken, webToken].filter(
      (t, i, arr) => t && arr.indexOf(t) === i
    );

    try {
      let res = null;

      for (const candidate of tokenCandidates) {
        try {
          const withAuth = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${candidate}`,
            },
          });

          if (withAuth.ok) {
            res = withAuth;
            break;
          }

          if (withAuth.status !== 401 && withAuth.status !== 403) {
            res = withAuth;
            break;
          }
        } catch (err) {
          console.error("[GlobalContext] Product fetch with auth token failed:", err);
        }
      }

      if (!res) {
        res = await fetch(endpoint);
      }

      if (!res.ok) {
        console.error(`[GlobalContext] Product fetch failed: ${res.status} ${res.statusText}`);
        return;
      }

      const data = await res.json();
      if (data.status) {
        setProducts(data.products);
        hasFetchedProducts.current = true;
      }
    } catch (err) {
      console.error("[GlobalContext] Fetch products error:", err);
    }
  }, [safeToken, webToken, apiBase]);

  // 🧠 Add to Cart
  const addToCart = useCallback(async (product, selectedSize) => {
    const userToken = isBrowser ? localStorage.getItem("userToken") : null;

    const selectedVariation = product.product_variations?.find(
      (v) => v.id === selectedSize
    );
    const resolvedPrice =
      selectedVariation?.sale_price ??
      selectedVariation?.regular_price ??
      product.sale_price ??
      product.regular_price;

    if (!product || !product.id || resolvedPrice === undefined || resolvedPrice === null) {
      console.error("Invalid product payload for addToCart:", {
        productId: product?.id,
        selectedSize,
        salePrice: product?.sale_price,
        regularPrice: product?.regular_price,
      });
      return false;
    }

    const payload = {
      product_id: product.id,
      prod_variation_id: selectedSize ?? null,
      quantity: 1,
      price: resolvedPrice,
    };

    if (userToken) {

      // if(cart.length > 0) {
      //   const isInCart = cart.some((item) => item.product_id === product.id);
      //   console.log('not selected', isInCart);
      //   if (isInCart) return;
      // }

      try {
        const postAddToCart = async (authToken) =>
          axios.post(`${apiBase}/v1/add_to_cart`, payload, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

        const triedTokens = [];
        const tokenCandidates = [userToken, webToken].filter(
          (t, i, arr) => t && arr.indexOf(t) === i
        );

        let lastErrorData = null;
        for (const authToken of tokenCandidates) {
          triedTokens.push(authToken === userToken ? "userToken" : "webToken");
          const response = await postAddToCart(authToken);
          const data = response?.data;

          if (!data || data.status !== false) {
            await fetchCart();
            return true;
          }

          lastErrorData = data;
          if (!isNoCustomerError(data)) {
            console.error("Add to cart API rejected:", data);
            return false;
          }
        }

        console.warn(
          "Add to cart API rejected with no customer on tokens:",
          triedTokens,
          lastErrorData
        );
      } catch (err) {
        console.error("Add to cart failed:", err);
      }
    } else if (isBrowser) {
      const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
      const exists = localCart.find(
        (item) =>
          item.product_id === product.id &&
          (item.prod_variation_id ?? null) === (selectedSize ?? null)
      );
      const updatedCart = exists
        ? localCart.map((item) =>
          item.product_id === product.id &&
            (item.prod_variation_id ?? null) === (selectedSize ?? null)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        : [
            ...localCart,
            {
              ...product,
              quantity: 1,
              sale_price: resolvedPrice,
              prod_variation_id: selectedSize ?? null,
              product_id: product.id,
            },
          ];

      localStorage.setItem("localCart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      return true;
    }

    // Final fallback for invalid/missing customer context: store as guest local cart.
    if (isBrowser) {
      const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
      const exists = localCart.find(
        (item) =>
          item.product_id === product.id &&
          (item.prod_variation_id ?? null) === (selectedSize ?? null)
      );
      const updatedCart = exists
        ? localCart.map((item) =>
            item.product_id === product.id &&
            (item.prod_variation_id ?? null) === (selectedSize ?? null)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...localCart,
            {
              ...product,
              quantity: 1,
              sale_price: resolvedPrice,
              prod_variation_id: selectedSize ?? null,
              product_id: product.id,
            },
          ];
      localStorage.setItem("localCart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      return true;
    }

    return false;
  }, [fetchCart, isBrowser, apiBase, webToken]);

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

