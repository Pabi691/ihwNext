// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from "react";
import Script from "next/script";
import { Link, useNavigate, useLocation } from '@/components/compat/router';
import axios from 'axios';
import Swal from 'sweetalert2';
import SimpleLayout from "@/layout/SimpleLayout";
import { BiCheck, BiCycling, BiRupee } from 'react-icons/bi';
import { SiRazorpay } from "react-icons/si";
import { motion } from "framer-motion";
import { MdSwapHoriz, MdSecurity } from "react-icons/md";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import compressImage from '../utils/compressImage';
import { themeBgColor } from '../styles/typography';
import { useGlobal } from '../global/GlobalContext';
import ProtectedRoute from "@/components/ProtectedRoute";
import { FaCalendarAlt, FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

const messages = [
  { icon: <BiCycling />, text: "Yayy! You got free delivery" },
  { icon: <MdSwapHoriz />, text: "15 days easy return & exchange" },
  { icon: <MdSecurity />, text: "100% Secure Payments" }
];

const Checkout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guestInfo, setGuestInfo] = useState(null);
  const [showCompleteReg, setShowCompleteReg] = useState(false);
  // Complete-registration form state (for guests proceeding to checkout)
  const [regEmail, setRegEmail] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regErrors, setRegErrors] = useState({});
  const [regLoading, setRegLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [shippingValidate, setShippingValidate] = useState(false);
  // const [cartItems, setCartItems] = useState([]);
  const { cart, token, CGST, SGST, grandTotal, totalGST, subtotal, totalMRP, setToken, mergeLocalCartWithServer } = useGlobal();
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  // const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingDetails, setShippingDetails] = useState({
    full_name: '',
    email: '',
    mobile_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: '',
  });
  const [activeTab, setActiveTab] = useState("cod");
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isItemsOpen, setIsItemsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [varify, setVarify] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const finalAmount = searchParams.get("finalAmount");
  const discountParam = searchParams.get("discount");
  const couponCode = searchParams.get("couponCode");
  const discount = discountParam ? Number(discountParam) : null;
  const shippingFetchedRef = useRef(false);
  const shippingInFlightRef = useRef(false);

  useEffect(() => {
    const isBrowser = typeof window !== "undefined";
    const uservarified = isBrowser ? localStorage.getItem('uservarified') : null;
    if (uservarified && uservarified === 'null') {
      setVarify(true);
      return;
    }

  }, [])

  // // console.log('location', location);
  // // console.log('discount', discount);
  // // console.log('couponCode', couponCode);

  // const fetchCart = useCallback(async () => {
  //   try {
  //     const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_customer_cart`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const cartItems = response.data.cart_items || [];

  //     if (response.data.status && cartItems.length > 0) {
  //       setCartItems(cartItems);
  //     } else {
  //       navigate('/');
  //     }

  //   } catch (error) {
  //     console.error('Error fetching cart:', error.message);
  //     navigate('/');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [token, navigate]);

  const fetchShippingAddresses = useCallback(async () => {
    if (typeof window === "undefined") return;
    const userToken = localStorage.getItem("userToken");
    if (!userToken) return;
    if (shippingFetchedRef.current || shippingInFlightRef.current) return;
    shippingInFlightRef.current = true;

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_customer_shipping_addresses`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      const addresses = response.data.shipping_addresses || [];
      setShippingAddresses(addresses);

      // ✅ Automatically select the first address if available
      if (addresses.length > 0) {
        // console.log('address', addresses[0]);
        setSelectedAddress(addresses[0]);
        setShippingDetails(addresses[0]); // Ensure shipping details are also updated
      }
    } catch (error) {
      console.error("Error fetching shipping addresses:", error.message);
    } finally {
      shippingInFlightRef.current = false;
      shippingFetchedRef.current = true;
    }
  }, [token]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // 'username' is only in localStorage for real logged-in users.
    // 'userToken' is unreliable because AuthContext stores the web token there too.
    const isLoggedIn = !!localStorage.getItem("username");
    if (!isLoggedIn) {
      setIsAuthChecked(true);
      setIsAuthenticated(false);
      try {
        const stored = JSON.parse(localStorage.getItem('guestInfo') || 'null');
        if (stored) {
          setGuestInfo(stored);
          setShowCompleteReg(true);
          return;
        }
      } catch (_) {}
      navigate('/login', { state: { slug: '/checkout' } });
      return;
    }
    setIsAuthenticated(true);
    setIsAuthChecked(true);
    fetchShippingAddresses();
  }, [navigate, fetchShippingAddresses]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShippingDetails(address);
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setShippingDetails((prev) => ({ ...prev, [name]: value }));
  // };

  const calculateSummary = () => {
    const finalAmountNumber = finalAmount ? Number(finalAmount) : null;
    const newSubtotal = finalAmountNumber ? finalAmountNumber : grandTotal;
    return { totalMRP, newSubtotal, savings: (newSubtotal < totalMRP ? (totalMRP - grandTotal) : 'N/A') };
  };

  const { savings, newSubtotal } = calculateSummary();
  useEffect(() => {
    if (!isAuthenticated) return;
    const payment = async () => {
      const isBrowser = typeof window !== "undefined";
      const userToken = isBrowser ? localStorage.getItem('userToken') : null;
      if (!userToken) return;
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_payment_mothods`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      // console.log('paymentMenthod', response);
      if (response.data.status) {
        setPaymentMethods(Array.isArray(response.data.payment_methods) ? response.data.payment_methods : []);
      } else {
        setPaymentMethods([]);
      }
    }
    payment();
  }, [isAuthenticated]);

  const updatedSubtotal = (newSubtotal + (discount ? discount : 0)).toFixed(2); // Add ₹20 if COD
  const roundedSubtotal = Math.round(newSubtotal);
  const roundOff = (roundedSubtotal - newSubtotal).toFixed(2);


  // const handleSubmit = async () => {
  //   const delhiveryToken = '2123405d6ed233bc235200c24e2ad215f816f1ff'; // this token for ihw
  //   setIsLoading(true);

  //   const orderPayload = {
  //     pickup_location: {
  //       name: "Pickup Name",
  //       add: "Pickup Address",
  //       city: "City",
  //       state: "State",
  //       country: "India",
  //       pin: "PINCODE",
  //       phone: "9999999999"
  //     },
  //     shipments: [
  //       {
  //         waybill: "",
  //         order: "ORDER123",
  //         products_desc: "T-shirt",
  //         qty: 1,
  //         price: 499,
  //         weight: 0.5,
  //         cod_amount: 499,
  //         payment_mode: "COD",
  //         name: "Customer Name",
  //         add: "Customer Address",
  //         city: "Customer City",
  //         state: "State",
  //         country: "India",
  //         pin: "Customer PINCODE",
  //         phone: "8888888888"
  //       }
  //     ]
  //   };

  //   try {
  //     const response = await axios.post(
  //       'https://track.delhivery.com/api/cmu/create.json',
  //       orderPayload,
  //       {
  //         headers: {
  //           Authorization: `Token ${delhiveryToken}`,
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );

  //     console.log('Delhivery response:', response.data);

  //     if (!response.data || response.data.success !== true) {
  //       Swal.fire({
  //         title: "Order Creation Failed!",
  //         text: response.data?.error || "Your order could not be placed. Please try again.",
  //         icon: "error",
  //         confirmButtonText: "OK",
  //       });
  //       return;
  //     }

  //     Swal.fire({
  //       title: "Success!",
  //       text: "Order created successfully!",
  //       icon: "success",
  //       confirmButtonText: "OK",
  //     });

  //   } catch (error) {
  //     console.error("Delhivery order error:", error.response?.data || error.message);
  //     Swal.fire({
  //       title: "Error!",
  //       text: "Failed to place order. Please try again.",
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // console.log('cart', cart);  
  const handleSubmit = async () => {
    setIsLoading(true);
    setLoading(true);
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      navigate('/login', { state: { slug: '/checkout' } });
      setIsLoading(false);
      setLoading(false);
      return;
    }
    const shippingId = shippingDetails.id;
    const isCOD = activeTab !== "razorpay";

    // send total without gst
    const NoGstPrice = newSubtotal - totalGST

    const safePaymentMethods = Array.isArray(paymentMethods) ? paymentMethods : [];

    const orderPayload = {
      order_items: cart.map((item) => {
        const variation = item.product_variation;
        const salePrice =
          variation?.id === item.prod_variation_id
            ? (variation.sale_price ?? item.sale_price)
            : item.sale_price;

        const productName = variation?.id === item.prod_variation_id
          ? variation.variations_name
          : item.prod_name;

        const regularPrice = variation?.id === item.prod_variation_id
          ? variation.regular_price
          : item.regular_price;

        return ({
          product_id: item.product_id,
          prod_variation_id: item.prod_variation_id,
          product_name: productName,
          quantity: item.quantity,
          price: salePrice,
          regular_price: regularPrice,
          total_price: salePrice * item.quantity,
        })
      }),
      // pay_method_id:,
      pay_method_id: (() => {
        if (safePaymentMethods.length === 0) return null;
        const codMethod = safePaymentMethods.find((m) =>
          (m?.name || m?.payment_method || "").toString().toLowerCase().includes("cod")
        );
        const razorMethod = safePaymentMethods.find((m) =>
          (m?.name || m?.payment_method || "").toString().toLowerCase().includes("razor")
        );
        if (activeTab === "cod") {
          return codMethod?.id ?? safePaymentMethods[0]?.id ?? null;
        }
        return razorMethod?.id ?? safePaymentMethods[0]?.id ?? null;
      })(),
      shipping_address: shippingId,
      bill_amt: Number(updatedSubtotal) - totalGST,
      discount_amt: discount ? Number(discount) : 0, // newSubtotal + discount = updatedSubtotal
      coupon_code: couponCode,
      net_amt: NoGstPrice,
      shipping_total: isCOD ? 20 : 0,
      r_off: roundOff,
      pay_amt: roundOff < 0.5 ? (isCOD ? (NoGstPrice - roundOff + 20) : (NoGstPrice - roundOff)) :
        (isCOD ? (NoGstPrice - roundOff + 1 + 20) : (NoGstPrice - roundOff + 1)),
    };

    console.log('orderPayload', orderPayload);

    try {
      if (!shippingId) {
        setShippingValidate(true);
        setIsAddressOpen(true);
        setIsLoading(false);
        setLoading(false);
        return;
      }

      if (safePaymentMethods.length === 0) {
        Swal.fire({
          title: "Payment Methods Unavailable",
          text: "Payment methods are not loaded yet. Please wait a moment and try again.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        setIsLoading(false);
        setLoading(false);
        return;
      }

      if (!orderPayload.pay_method_id) {
        Swal.fire({
          title: "Payment Method Error",
          text: "Could not determine a valid payment method. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsLoading(false);
        setLoading(false);
        return;
      }

      const orderResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/create_order`, orderPayload, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log('orderPayload', orderPayload);

      console.log('orderResponse', orderResponse);
      // 376d684856fe7b99af6f0e2cb10c3710c690b3aa
      if (!orderResponse.data || !orderResponse.data.order_id) {
        Swal.fire({
          title: "Order Creation Failed!",
          text: orderResponse.data.error_message.shipping_address[0] ? orderResponse.data.error_message.shipping_address[0] : "Your order could not be placed. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      if (!isCOD) {
        initiateRazorpayPayment(orderResponse.data.order_id, newSubtotal, userToken);
      } else {
        console.log('test');
        const paymentResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/add_order_payment`,
          {
            order_id: orderResponse.data.order_id,
            payment_method: "COD",
            payment_status: "pending",
            payment_amount: roundOff < 0.5 ? (isCOD ? (newSubtotal - roundOff + 20) : (newSubtotal - roundOff)) :
              (isCOD ? (newSubtotal - roundOff + 1 + 20) : (newSubtotal - roundOff + 1)),
            payment_reference: "COD_" + orderResponse.data.order_id,
            payment_details: null,
          },
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        console.log('paymentResponse', paymentResponse);

        if (paymentResponse.data.status) {
          Swal.fire({
            title: "Order Placed Successfully!",
            text: "Your order has been placed successfully and will be processed soon.",
            icon: "success",
            confirmButtonText: "OK",
          })
          // setCartItems([]);
          // navigate(`/thank-you?nocache=${Date.now()}`, { replace: true });
          // setTimeout(() => {
          //   navigate("/thank-you");
          // }, 50);
          navigate("/thank-you");
          window.location.replace("/thank-you?nocache=" + new Date().getTime());
        }
      }
    } catch (error) {
      console.error("Error processing order:", error.response?.data || error.message);
      Swal.fire({
        title: "Error!",
        text: "Failed to place order. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const initiateRazorpayPayment = (orderId, amount, userToken) => {
    const options = {
      // key: "rzp_test_RxOgC9sPpereLC",
      key: "rzp_live_KeivW5UKhTBEPL",
      amount: amount * 100,
      currency: "INR",
      name: "Indian Hair World",
      description: "Order Payment",

      handler: async function (response) {
        if (!response.razorpay_payment_id) {
          Swal.fire({
            title: "Payment Cancelled!",
            text: "You cancelled the payment. Please try again.",
            icon: "warning",
            confirmButtonText: "OK",
          });
          return;
        }

        try {
          const paymentResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/add_order_payment`,
            {
              order_id: orderId,
              payment_method: "razorpay",
              payment_status: "completed",
              payment_amount: amount,
              payment_reference: response.razorpay_payment_id,
              payment_details: JSON.stringify(response),
            },
            {
              headers: { Authorization: `Bearer ${userToken}` },
            }
          );
          // console.log('paymentResponse', paymentResponse);

          if (paymentResponse.data.status) {
            Swal.fire({
              title: "Success!",
              text: "Order and payment successful!",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/thank-you");
              window.location.replace("/thank-you?nocache=" + new Date().getTime());
            });
          } else {
            Swal.fire({
              title: "Payment Failed!",
              text: paymentResponse.data.message || "Something went wrong.",
              icon: "error",
              confirmButtonText: "Try Again",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Payment Error!",
            text: "An error occurred while processing the payment.",
            icon: "error",
            confirmButtonText: "Try Again",
          });
        }
      },
      prefill: {
        name: selectedAddress?.full_name || "",
        email: selectedAddress.email,
        contact: selectedAddress?.mobile_number || "",
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        escape: true,
        ondismiss: async function () {
          // try {
          //   const res = await axios.post(
          //     `${process.env.NEXT_PUBLIC_API_URL}/api/v1/add_order_payment`,
          //     {
          //       order_id: orderId,
          //       payment_method: "razorpay",
          //       payment_status: "cancelled",
          //       payment_amount: amount,
          //       payment_reference: null,
          //       payment_details: JSON.stringify({ message: "Payment was cancelled or dismissed by user" }),
          //     },
          //     {
          //       headers: { Authorization: `Bearer ${token}` },
          //     }
          //   );
          // } catch (err) {
          //   console.error("Failed to notify server about cancellation:", err);
          // }

          Swal.fire({
            title: "Payment Cancelled!",
            text: "You cancelled the payment. Please try again.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        },
      }

    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const resendHandler = async () => {
    setLoading(true);
    setSuccess(null);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/resend_email_verification`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('userToken')}`
        },
      });

      // console.log("API Response:", response.data);
      // return;
      if (response.data.status) {
        setSuccess("Email sent successfully");
      } else {
        toast.error(response.data.message, { position: "top-center" });
      }
    }
    catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  }

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regEmail.trim() || !emailRegex.test(regEmail)) errs.email = 'Enter a valid email address';
    if (!regPassword || regPassword.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!regDob || new Date(regDob) > new Date(new Date().setFullYear(new Date().getFullYear() - 10)))
      errs.dob = 'You must be at least 10 years old';
    setRegErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setRegLoading(true);
    try {
      if (guestInfo?.guestToken) {
        // Guest account already created at modal stage — just update email/password/dob
        // and trigger email verification using the stored guest token.
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/complete_guest_registration`,
          { email: regEmail, password: regPassword, dob: regDob },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${guestInfo.guestToken}`,
            },
          }
        );

        if (!response.data?.status) {
          setRegErrors({ form: response.data?.message || 'Registration failed.' });
          return;
        }

        // Store token for the resend handler, but don't fully log in yet.
        setToken(guestInfo.guestToken);
        localStorage.removeItem('guestInfo');
        setShowVerify(true);
        return;
      }

      // Fallback: no guest token (modal sign_up failed) — create a full account now.
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/webuser/sign_up`,
        {
          username: regEmail,
          password: regPassword,
          name: guestInfo.name,
          gender: guestInfo.gender,
          dob: regDob,
          mobile_number: guestInfo.mobile,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const userData = response.data;
      if (!userData.status) {
        setRegErrors({ form: userData.message || 'Registration failed.' });
        return;
      }

      setToken(userData.user_token);
      localStorage.removeItem('guestInfo');
      setShowVerify(true);
    } catch (error) {
      setRegErrors({ form: error.response?.data?.message || 'Something went wrong. Try again.' });
    } finally {
      setRegLoading(false);
    }
  };

  const finaliseLogin = async (userToken, userData) => {
    setToken(userToken);
    localStorage.setItem('username', userData.name);
    localStorage.setItem('useremail', userData.email);
    localStorage.setItem('uservarified', userData.email_verified_at);
    localStorage.removeItem('guestInfo');
    await mergeLocalCartWithServer(userToken);
    setIsAuthenticated(true);
    setShowCompleteReg(false);
    if (userData.email_verified_at) fetchShippingAddresses();
  };

  if (!isAuthChecked) return null;

  if (showCompleteReg && !isAuthenticated) {
    if (showVerify) {
      return (
        <SimpleLayout title="Verify Your Email – Checkout">
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-blue-100 px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#04A9FF] to-[#0070cc] px-8 pt-8 pb-10 text-center relative">
                <h1 className="text-white text-2xl font-extrabold tracking-tight">Check Your Email!</h1>
                <p className="text-blue-100 text-sm mt-1">One last step before you can checkout</p>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-white"
                  style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0', transform: 'scaleX(1.1)' }} />
              </div>
              <div className="px-8 pt-6 pb-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📧</span>
                </div>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                  A verification link has been sent to your email address. Please check your inbox and click the link to activate your account, then log in to complete your order.
                </p>
                {loading ? (
                  <p className="text-gray-400 text-sm mb-4">Sending...</p>
                ) : success ? (
                  <p className="text-green-600 text-sm font-medium mb-4">{success}</p>
                ) : (
                  <button
                    onClick={resendHandler}
                    className="text-[#04A9FF] text-sm font-semibold hover:underline transition mb-4 block mx-auto"
                  >
                    Resend Verification Link
                  </button>
                )}
                <a
                  href="/login"
                  className="w-full py-3 rounded-xl font-bold text-white text-sm tracking-wide
                    bg-gradient-to-r from-[#04A9FF] to-[#0070cc]
                    hover:from-[#0070cc] hover:to-[#004fa3]
                    transition-all duration-200 shadow-lg shadow-[#04A9FF]/30
                    flex items-center justify-center"
                >
                  I verified — Log In
                </a>
              </div>
            </div>
          </div>
        </SimpleLayout>
      );
    }

    return (
      <SimpleLayout title="Complete Registration – Checkout">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-blue-100 px-4 py-10">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#04A9FF] to-[#0070cc] px-8 pt-8 pb-10 text-center relative">
              <h1 className="text-white text-2xl font-extrabold tracking-tight">Almost There!</h1>
              <p className="text-blue-100 text-sm mt-1">Complete your account to proceed to checkout</p>
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-white"
                style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0', transform: 'scaleX(1.1)' }} />
            </div>

            <div className="px-8 pt-6 pb-8">
              {/* Pre-filled read-only info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 text-sm text-blue-800">
                <p className="font-semibold mb-1">Your saved details</p>
                <p>Name: <span className="font-medium">{guestInfo?.name}</span></p>
                <p>Gender: <span className="font-medium capitalize">{guestInfo?.gender}</span></p>
                <p>Mobile: <span className="font-medium">+91 {guestInfo?.mobile}</span></p>
              </div>

              {regErrors.form && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                  ⚠ {regErrors.form}
                </div>
              )}

              <form onSubmit={handleCompleteRegistration}>
                {/* Email */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Email Address</label>
                  <div className={`flex items-center gap-2 border-2 rounded-xl bg-gray-50 px-3 transition-all duration-200
                    ${regErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-[#04A9FF] focus-within:bg-white'}`}>
                    <FaEnvelope size={14} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 py-3 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                    />
                  </div>
                  {regErrors.email && <p className="text-red-500 text-xs mt-1">⚠ {regErrors.email}</p>}
                </div>

                {/* Date of Birth */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Date of Birth</label>
                  <div className={`flex items-center gap-2 border-2 rounded-xl bg-gray-50 px-3 transition-all duration-200
                    ${regErrors.dob ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-[#04A9FF] focus-within:bg-white'}`}>
                    <FaCalendarAlt size={13} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="date"
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      className="flex-1 py-3 bg-transparent text-sm text-gray-700 outline-none"
                    />
                  </div>
                  {regErrors.dob && <p className="text-red-500 text-xs mt-1">⚠ {regErrors.dob}</p>}
                </div>

                {/* Password */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Password</label>
                  <div className={`flex items-center gap-2 border-2 rounded-xl bg-gray-50 px-3 transition-all duration-200
                    ${regErrors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-[#04A9FF] focus-within:bg-white'}`}>
                    <FaLock size={14} className="text-gray-400 flex-shrink-0" />
                    <input
                      type={regShowPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="flex-1 py-3 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                    />
                    <button type="button" onClick={() => setRegShowPassword(!regShowPassword)}
                      className="text-gray-400 hover:text-[#04A9FF] transition-colors flex-shrink-0">
                      {regShowPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                    </button>
                  </div>
                  {regErrors.password && <p className="text-red-500 text-xs mt-1">⚠ {regErrors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm tracking-wide
                    bg-gradient-to-r from-[#04A9FF] to-[#0070cc]
                    hover:from-[#0070cc] hover:to-[#004fa3]
                    transition-all duration-200 shadow-lg shadow-[#04A9FF]/30
                    disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {regLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Creating Account...
                    </>
                  ) : 'Complete Registration & Continue'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <ProtectedRoute>
      <SimpleLayout title='Checkout'>
        {
          varify ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md text-sm my-10 mx-auto w-1/2">
              <p className="mb-2">
                📧 A verification email has been sent to your email address. Please check your inbox and click the verification link.
              </p>
              <p>
                Didn’t receive the email?{" "}

                {loading ? 'Please Wait......' : success ? (
                  <div className='text-green-600 text-sm'>
                    A varification link send to your email.
                  </div>
                ) : (
                  <button
                    onClick={resendHandler}
                    className="text-blue-600 underline hover:text-blue-800 font-medium"
                  >
                    {loading ? 'Please Wait......' : 'Resend Verification Link'}
                  </button>
                )}
              </p>
            </div>

          ) : (

            <div className="checkout-page p-10 max-w-screen-2xl mx-auto">
              <h4 className='font-semibold text-gray-900 text-lg md:text-2xl mt-2 mb-6'>Choose Your Payment Method</h4>
              <div className="md:flex-row gap-6 flex-col flex">
                {/* Payment Method Tabs */}
                <div className="w-full md:w-1/5 flex flex-col border rounded-lg">
                  <button className={`p-3 border-b flex gap-4 items-center text-md md:text-xl ${activeTab === "cod" ? "text-black font-semibold" : "text-gray-300 font-medium"}`}
                    onClick={() => setActiveTab("cod")}>
                    <BiRupee className='p-2 border rounded-full text-5xl' />  Cash on Delivery
                  </button>
                  <button className={`p-3 border-b flex gap-4 items-center text-xl ${activeTab === "razorpay" ? "text-black font-semibold" : "text-gray-300 font-medium"}`}
                    onClick={() => setActiveTab("razorpay")}>
                    <SiRazorpay className='p-2 border rounded-full text-5xl' />
                    <div className="flex flex-col items-start text-left">
                      <span>Online Payment</span>
                      <span className="text-xs text-gray-400 font-normal">UPI, Cards, NetBanking</span>
                    </div>
                  </button>
                </div>
                <div className="w-full md:w-2/5 border rounded-lg p-4 relative">

                  <div className={`absolute left-1/2 transform -translate-x-1/2 ${themeBgColor} rounded-ss-lg rounded-se-lg top-0 w-full overflow-hidden`}>
                    <motion.div
                      key={currentMessage} // Re-renders motion.div for each new message
                      initial={{ opacity: 0, y: 10 }} // In from bottom
                      animate={{ opacity: 1, y: 0 }} // Visible
                      exit={{ opacity: 0, y: -50 }} // Out through top
                      transition={{ duration: 0.6 }}
                      className=" text-white px-4 py-1 justify-center flex items-center gap-2 text-center text-xs"
                    >
                      {messages[currentMessage].icon} <span>{messages[currentMessage].text}</span>
                    </motion.div>
                  </div>
                  {/* Payment Actions */}
                  {activeTab === "cod" ? (
                    <>
                      <p className='mb-4 font-medium mt-10'>
                        {isLoading ? 'Processsing' : 'Pay Cash on Delivery'}
                      </p>
                      <p className='text-sm mb-4'>
                        Additional cash collection charges of ₹ 20 is applicable on this order.
                      </p>
                      <button disabled={loading} onClick={handleSubmit} className={`${loading ? 'bg-gray-400 text-black' : `${themeBgColor} text-white`} px-4 py-2 rounded w-full`}>
                        {loading ? 'please wait...' : 'Place Order'}</button>
                    </>

                  ) : (
                    <>
                      <div className='mt-10 text-xs mb-4'>
                        ✅ Multiple payment modes including UPI, cards, and net banking. <br />
                        ✅ Seamless Checkout – Enjoy quick and easy transactions.<br />
                        ✅ Trusted & Reliable – Powered by Razorpay, ensuring 100% secure payments.<br />
                      </div>

                      <p className=' text-xs'>
                        Select your preferred payment method and complete your purchase with confidence!
                      </p>

                      <button disabled={loading} onClick={handleSubmit} className={`${loading ? 'bg-gray-400 text-black' : `${themeBgColor} text-white`} px-4 py-2 rounded w-full mt-4`}>
                        {loading ? 'Processing...' : `Pay with Razorpay ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(newSubtotal)}`}
                      </button>
                    </>

                  )}
                </div>
                {/* Main Checkout Section */}
                <div className="w-full md:w-2/5">
                  {/* Accordion for Address & Items */}
                  <div className={`mb-6 rounded-lg border ${(shippingValidate || shippingAddresses.length > 0) && 'border-blue-800'}`}>
                    <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => setIsAddressOpen(!isAddressOpen)}>
                      <h4 className="font-medium text-gray-900">Select Delivery Address</h4>
                      {isAddressOpen ? (
                        <IoChevronUpSharp />
                      ) : (
                        <IoChevronDownSharp />
                      )}
                    </div>
                    {isAddressOpen && (
                      <div className="mt-2 p-4">
                        {shippingAddresses.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {shippingAddresses.map((address) => (
                              <div
                                key={address.id}
                                className='p-4 border rounded-lg flex gap-1'
                              >
                                <span
                                  onClick={() => handleAddressSelect(address)}
                                  className={`w-5 h-5 rounded-full cursor-pointer block border
                          ${selectedAddress?.id === address.id ? `${themeBgColor} text-white` : "border-gray-300"}`}>
                                  {selectedAddress?.id === address.id ? (<><BiCheck /></>) : ""}
                                </span>
                                <div className='text-xs'>
                                  <div className='font-medium mb-2'>{address.full_name}</div>
                                  <div>{address.address_line_1}</div>
                                  <div>{address.city}, {address.state} - {address.zip_code}</div>
                                </div>

                                <Link
                                  to="/myaccount/addresses" state={{ status: "edit", address: address, slug: "checkout" }}
                                  className="text-black text-sm"
                                >
                                  ✏️
                                </Link>

                              </div>
                            ))}
                            <Link state={{ status: "add", slug: "checkout" }} className='px-2 py-1 text-blue-500 text-xs font-medium' to="/myaccount/addresses">Add</Link>
                          </div>
                        ) : (
                          <Link to="/myaccount/addresses" className='px-2 py-1 text-blue-500 text-xs font-medium' state={{ status: "add", slug: "checkout" }}>Add your shipping address</Link>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mb-6 border rounded-lg">
                    <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => setIsItemsOpen(!isItemsOpen)}>
                      <h4 className="font-medium text-gray-900">Order Items</h4>
                      {isItemsOpen ? (
                        <IoChevronUpSharp />
                      ) : (
                        <IoChevronDownSharp />
                      )}
                    </div>
                    {isItemsOpen && (
                      <div className="mt-2 p-4">
                        {cart.map((item, index) => (
                          <div key={index} className="flex items-center mb-4">
                            {(() => {
                              const customProduct = Array.isArray(item?.custom_products) ? item.custom_products[0] : null;
                              const customImage = customProduct?.front_img_url || customProduct?.back_img_url || null;
                              const productSlug = item?.slug || item?.product?.slug || "";
                              const productImage = item?.primary_img || item?.product?.primary_img || "";
                              const productName = item?.prod_name || item?.product?.prod_name || "";

                              if (!customImage) {
                                return (
                                  <Link to={`/product/${productSlug}`}>
                                    <img
                                      // src={compressImage(productImage, 400, 70, 'webp')}
                                      src={productImage}
                                      alt={productName}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  </Link>
                                );
                              }

                              return (
                                <img
                                  src={customImage}
                                  alt={productName}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              );
                            })()}
                            {/* <img src={item.primary_img} alt={item.prod_name} loading="lazy" className="w-12 h-12 object-cover rounded" /> */}
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-500">{item?.prod_name || item?.product?.prod_name || ''}</p>
                              <p className="text-sm font-medium text-gray-500">Items: <span className="text-green-600">{item.quantity}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="mb-6 p-4 border rounded-lg">
                    <h4 className='font-medium'>Order Summary</h4>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='text-gray-500 font-medium text-sm'>Total MRP :</span>
                      <span className='text-gray-900 text-sm'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalMRP)}</span>
                    </div>

                    <div className='flex justify-between items-center mb-2'>
                      <span className='text-gray-500 font-medium text-sm'>Price :</span>
                      <span className='text-base'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(subtotal)}</span>
                    </div>

                    {/* <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-500 font-medium text-sm'>Total MRP :</span>
                  <span className='text-base'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalMRP)}</span>
                </div> */}

                    <div className='flex justify-between items-center'>
                      <span className='text-gray-500 font-medium text-sm'>CGST ( 9% ) :</span>
                      <span className='text-gray-900 text-sm'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(CGST)}</span>
                    </div>

                    <div className='flex justify-between items-center'>
                      <span className='text-gray-500 font-medium text-sm'>SGST ( 9% ) :</span>
                      <span className='text-gray-900 text-sm'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(SGST)}</span>
                    </div>
                    <div className='text-gray-500 font-medium text-sm flex justify-between items-center my-3'>Bag Discount:
                      {Number.isFinite(savings) ?
                        <span className='text-green-600 text-sm'> -{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(savings)}</span>
                        : ''}
                    </div>
                    <div className='text-gray-500 font-medium text-sm flex justify-between items-center'>{activeTab === 'cod' ? 'COD Fee:' : 'Delivery Fee:'} <span className='text-green-600'>{activeTab === 'cod' ? '+20' : 'Free'}</span></div>
                    <hr className='my-3' />
                    {!discount ? (
                      <div className='text-gray-800 font-medium flex justify-between items-center'>Subtotal:
                        <span className='text-green-600'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(`${activeTab === 'cod' ? (newSubtotal + 20) : newSubtotal}`)}</span>
                      </div>
                    ) : (
                      <>
                        {discount && (
                          <div className='text-gray-500 font-medium text-sm flex justify-between items-center'>Price:
                            <span className='text-green-600'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(newSubtotal + discount)}</span>
                          </div>
                        )}
                        {discount && (
                          <div className='text-gray-500 font-medium text-sm flex justify-between items-center'>Coupon Code Discount:
                            <span className='text-green-600'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(discount)}</span>
                          </div>
                        )}

                        <div className='text-gray-500 font-medium text-sm flex justify-between items-center'>Discount Price:
                          <span className='text-green-600'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(newSubtotal)}</span>
                        </div>
                        {roundOff > 0 && (
                          <div className='text-gray-500 font-medium text-sm flex justify-between items-center'>Round OFF:
                            <span className='text-green-600'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(roundOff)}</span>
                          </div>
                        )}
                        <hr className='my-3' />
                        <div className='text-gray-800 font-medium flex justify-between items-center'>
                          Subtotal:
                          <span className='text-green-600'>
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                              Math.round(`${activeTab === 'cod' ? (newSubtotal + 20) : newSubtotal}`) // Ensure the final value is rounded
                            )}
                          </span>
                        </div>
                      </>
                    )
                    }

                  </div>
                  <img src='../images/icons.jpg' alt='icons' loading="lazy" />
                </div>
              </div>
            </div>

          )
        }
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
      </SimpleLayout>
    </ProtectedRoute>
  );
};

export default Checkout;


