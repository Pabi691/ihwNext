// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from '@/components/compat/router';
import axios from 'axios';
import Swal from 'sweetalert2';
import SimpleLayout from '../layout/SimpleLayout';
import { BiCheck, BiCycling, BiRupee } from 'react-icons/bi';
import { SiRazorpay } from "react-icons/si";
import { motion } from "framer-motion";
import { MdSwapHoriz, MdSecurity } from "react-icons/md";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import compressImage from '../utils/compressImage';
import { themeBgColor } from '../styles/typography';
import { useGlobal } from '../global/GlobalContext';

const messages = [
  { icon: <BiCycling />, text: "Yayy! You got free delivery" },
  { icon: <MdSwapHoriz />, text: "15 days easy return & exchange" },
  { icon: <MdSecurity />, text: "100% Secure Payments" }
];

const Checkout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [shippingValidate, setShippingValidate] = useState(false);
  // const [cartItems, setCartItems] = useState([]);
  const { cart, token, CGST, SGST, grandTotal, totalGST } = useGlobal();
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
    const uservarified = localStorage.getItem('uservarified');
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
    if (!token) {
      navigate('/login');
    } else {
      // fetchCart();
      fetchShippingAddresses();
    }
  }, [token, navigate, fetchShippingAddresses]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShippingDetails(address);
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setShippingDetails((prev) => ({ ...prev, [name]: value }));
  // };

  const calculateSummary = () => {
    const totalMRP = cart.reduce(
      (acc, item) => acc + item.regular_price * item.quantity,
      0
    );
    const subtotal = cart.reduce(
      (acc, item) => acc + item.sale_price * item.quantity,
      0
    );
    const finalAmountNumber = finalAmount ? Number(finalAmount) : null;
    const newSubtotal = finalAmountNumber ? finalAmountNumber : grandTotal;
    return { totalMRP, subtotal, newSubtotal, savings: (newSubtotal < totalMRP ?  (totalMRP - grandTotal) : 'N/A') };
  };

  const { totalMRP, savings, subtotal, newSubtotal } = calculateSummary();
  useEffect(() => {
    if(!token) return;
    const payment = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_payment_mothods`, {
        headers: {
          'Authorization': `Bearer ${token}`
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
  }, [token]);

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


  const handleSubmit = async () => {
    setIsLoading(true);
    setLoading(true);
    const shippingId = shippingDetails.id;
    const isCOD = activeTab !== "razorpay";

    // send total without gst
    const NoGstPrice = newSubtotal - totalGST

    const safePaymentMethods = Array.isArray(paymentMethods) ? paymentMethods : [];
    const orderPayload = {
      order_items: cart.map((item) => ({
        product_id: item.product_id,
        prod_variation_id: item.prod_variation_id,
        product_name: item.prod_name,
        quantity: item.quantity,
        price: item.sale_price,
        regular_price: item.regular_price,
        total_price: item.sale_price * item.quantity,
      })),
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

    try {
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
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('orderPayload', orderPayload);

      console.log('orderResponse', orderResponse);
      // 376d684856fe7b99af6f0e2cb10c3710c690b3aa
      if (!shippingId) {
        setShippingValidate(true);
        setIsAddressOpen(true);
        return;
      }

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
        initiateRazorpayPayment(orderResponse.data.order_id, newSubtotal);
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
            headers: { Authorization: `Bearer ${token}` },
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

  const initiateRazorpayPayment = (orderId, amount) => {
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
              headers: { Authorization: `Bearer ${token}` },
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

  return (
    <SimpleLayout title='Checkout'>

      {varify ? (
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
          <h4 className='font-semibold text-gray-600 text-lg md:text-2xl mt-2 mb-6'>Choose Your Payment Method</h4>
          <div className="md:flex-row gap-6 flex-col flex">
            {/* Payment Method Tabs */}
            <div className="w-full md:w-1/5 flex flex-col border rounded-lg">
              <button className={`p-3 border-b flex gap-4 items-center text-md md:text-xl ${activeTab === "cod" ? "text-black font-semibold" : "text-gray-300 font-medium"}`}
                onClick={() => setActiveTab("cod")}>
                <BiRupee className='p-2 border rounded-full text-5xl' />  Cash on Delivery
              </button>
              <button className={`p-3 border-b flex gap-4 items-center text-xl ${activeTab === "razorpay" ? "text-black font-semibold" : "text-gray-300 font-medium"}`}
                onClick={() => setActiveTab("razorpay")}>
                <SiRazorpay className='p-2 border rounded-full text-5xl' />  Razorpay
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

                  <button onClick={handleSubmit} className={`${themeBgColor} text-white px-4 py-2 rounded w-full mt-4`}>
                    Pay {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(newSubtotal)}
                  </button>
                </>

              )}
            </div>
            {/* Main Checkout Section */}
            <div className="w-full md:w-2/5">
              {/* Accordion for Address & Items */}
              <div className={`mb-6 rounded-lg border ${(shippingValidate || shippingAddresses.length > 0) && 'border-blue-800'}`}>
                <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => setIsAddressOpen(!isAddressOpen)}>
                  <h4 className="font-medium text-gray-600">Select Delivery Address</h4>
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
                  <h4 className="font-medium text-gray-600">Order Items</h4>
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
                        {(item.custom_products[0].front_img_url && item.custom_products[0].back_img_url) === null ? (
                          <Link to={`/product/${item.slug ? item.slug : item.product.slug}`}>
                            <img
                              src={compressImage(item.primary_img, 400, 70, 'webp')}
                              alt={item.prod_name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </Link>
                        ) : (
                          <img
                            src={item.custom_products[0].front_img_url ? item.custom_products[0].front_img_url : item.product.back_img_url}
                            alt={item.prod_name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        {/* <img src={item.primary_img} alt={item.prod_name} loading="lazy" className="w-12 h-12 object-cover rounded" /> */}
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">{item.prod_name}</p>
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
                  <span className='text-gray-600 text-sm'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalMRP)}</span>
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
                  <span className='text-gray-600 text-sm'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(CGST)}</span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-gray-500 font-medium text-sm'>SGST ( 9% ) :</span>
                  <span className='text-gray-600 text-sm'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(SGST)}</span>
                </div>
                <div className='text-gray-500 font-medium text-sm flex justify-between items-center my-3'>Bag Discount: 
                  {Number.isFinite(savings) ?
                  <span className='text-green-600 text-sm'> -{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(savings)}</span>
                  : '' }
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

      )}
    </SimpleLayout>
  );
};

export default Checkout;


