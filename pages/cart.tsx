// @ts-nocheck
import React, { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import { Link, useNavigate } from '@/components/compat/router';
import { useGlobal } from '../global/GlobalContext';
import { FaTruck } from 'react-icons/fa6';
import SimpleLayout from '../layout/SimpleLayout';
import Skeleton from 'react-loading-skeleton';
import compressImage from '../utils/compressImage';
import { themeBgColor } from '../styles/typography';

const Cart = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [loading, setLoading] = useState(true);
  const { cart, setCart, token, cartLength, totalMRP, subtotal, savings, CGST, SGST, totalGST, grandTotal } = useGlobal();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const WishlistSlider = lazy(() => import('../components/WishlistSlider'));
  const [couponCode, setCouponCode] = useState("");
  const [status, setStatus] = useState(null);
  const [couponData, setCouponData] = useState<any>(null);
  const [defaultCoupon, setDefaultCoupon] = useState<any[]>([]);

  useEffect(() => {
    if (cartLength > 0) {
      setLoading(false);
    }
  }, [cartLength]);

  const getFinalAmount = () => {
    let discount = 0;
    if (couponData && grandTotal >= couponData.minimum_order_value) {
      discount = couponData.discount_type === "Percentage"
        ? (grandTotal * couponData.discount_value) / 100
        : couponData.discount_value;
      discount = Math.min(discount, couponData.maximum_discount || discount); // Avoid NaN
    }
    return {
      finalAmount: grandTotal - discount,
      discount
    };
  }

  const { finalAmount, discount } = getFinalAmount();

  const selectQuantity = async (itemId: any, variationId: any, quantity: any, price: any) => {
    setLoading(true);
    // console.log(`Setting quantity: product_id: ${itemId}, quantity: ${quantity}`);
    // console.log(`Setting quantity: product_id: ${variationId}, quantity: ${price}`);
    try {
      // Send the selected quantity to the backend to update the cart
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/update_to_cart`,
        {
          product_id: itemId,
          prod_variation_id: variationId,
          quantity,
          price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (localStorage.getItem('localCart')) {

        let localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
        // Update the local cart with the new quantity
        localCart = localCart.map((item) =>
          item.id === itemId && item.prod_variation_id === variationId
            ? { ...item, quantity }
            : item
        );
        // Save the updated cart back to localStorage
        localStorage.setItem('localCart', JSON.stringify(localCart));
        // console.log('selectedQuantity', selectedQuantity);

      }
      // setIsPopupOpen(false);
      setSelectedQuantity(null);
    } catch (error) {
      console.error('Error updating quantity:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (cartId: any) => {
    const userToken = localStorage.getItem('userToken');
    setLoading(true);
    try {
      // If user is logged in, make API call to remove from backend cart
      if (userToken) {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/delete_cart_item/${cartId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (res.data.status) {
          setCart(prevCart => prevCart.filter(item => item.id !== cartId));
        }
      } else {
        let localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
        localCart = localCart.filter(item => item.id !== cartId);
        localStorage.setItem('localCart', JSON.stringify(localCart));

        // 👇 Correctly update cart
        setCart(localCart);
      }

    } catch (error) {
      console.error('Error removing item from cart:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        // console.log('suggestion token', token);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_suggestion_coupons`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })

        if (response.data.status) {
          setDefaultCoupon(response.data.coupons);
        }
        // console.log('response', response.data.coupons);

      } catch (error45) {
        console.error(error45);
      }
    }
    fetchCoupon();
  }, [token])


  const handleApplyCoupon = async (e: any) => {
    if (!couponCode) return;
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // console.log('validate_coupon token', token);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/validate_coupon`, {
        'coupon_code': couponCode,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
      );
      // console.log('couponCode', couponCode);
      // console.log('validate_coupon', response);
      const data = response.data;
      // console.log('subtotal', subtotal);
      // console.log('response.data.minimum_order_value', response.data.data?.minimum_order_value);
      if (data.status) {
        if (subtotal >= response.data.data?.minimum_order_value) {
          setCouponData(data.data);
          setOpenCoupon(false);
        } else {
          setStatus({ type: "error", message: `Your cart must be required ₹${response.data.data?.minimum_order_value} amount to apply this coupon` });
        }
      } else {
        setStatus({ type: "error", message: `${response.data.message}` });
      }
    } catch (error) {
      setStatus({ type: "error", message: "This is not a valid Coupon code!" });
    } finally {
      setLoading(false);
    }
  };

  const proceedHandler = () => {
    if (localStorage.getItem('userToken') && finalAmount > 0) {
      const params = new URLSearchParams();
      if (Number.isFinite(finalAmount)) {
        params.set('finalAmount', String(finalAmount));
      }
      if (Number.isFinite(discount)) {
        params.set('discount', String(discount));
      }
      if (couponCode) {
        params.set('couponCode', couponCode);
      }
      const query = params.toString();
      navigate(query ? `/checkout?${query}` : '/checkout');
    } else {
      navigate('/login', { state: { slug: '/cart' } });
    }
  }

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isPopupOpen]);


  return (
    <SimpleLayout title={`My Bag (${cartLength} ${cartLength > 1 ? 'Items' : 'Item'})`}>
      <div className="cart-page p-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <>
          {cartLength > 0 ? (
            <>
              <h2 className="text-lg font-semibold hidden md:block">
                My Bag ({cartLength} Item{cartLength > 1 ? 's' : ''})
              </h2>
              <div className="flex md:flex-row flex-col my-4 gap-4">
                <div className="cart-items md:w-2/3 w-full">
                  {loading ? (
                    <Skeleton
                      height={20}
                      width={50}
                    />
                  ) : (
                    <>
                      {Number.isFinite(savings) ?

                        <p className="border mb-3 p-3 rounded-lg flex gap-3 items-center font-medium">
                          <img className='w-6' alt='percentage-image' loading="lazy" src='images/percentage.gif' />
                          You are saving ₹{savings.toFixed(2)} on this order
                        </p> : ''}
                    </>
                  )}
                  {cart.map((item) => (
                    item ? (
                      <div
                        key={item.id}
                        className="cart-item flex items-start border pb-14 md:pb-3 p-3 mb-4 relative rounded-lg"
                      >
                        {loading ? (
                          <Skeleton
                            height={20}
                            width={50} />
                        ) : (
                          <div className="w-1/4 h-24 md:h-48 mr-4">
                            <Link to={`/product/${item.slug ? item.slug : item.product.slug}`}>
                              <img
                                src={compressImage(item.primary_img, 400, 70, 'webp')}
                                alt={item.prod_name}
                                className="w-full h-full object-cover object-top rounded-lg"
                              />
                            </Link>
                          </div>
                        )}
                        {loading ? (
                          <Skeleton
                            height={20}
                            width={50} />
                        ) : (
                          <div className="flex-1">
                            {localStorage.getItem('userToken') ?
                              (<h2 className="font-medium text-sm md:text-base">{item.product.brand_details.brand_name}</h2>)
                              :
                              (
                                <h2 className="font-medium text-sm md:text-base">{item.brand_details.brand_name}</h2>
                              )
                            }

                            <h3 className="text-xs text-gray-600 font-medium my-1 md:my-3">{item.prod_name}</h3>
                            <p className="text-gray-600 text-xs flex gap-2"> <FaTruck className='text-green-600' /> Ships in 2-3 days</p>
                            {/* {item.variation_name && (
                              <p className="text-gray-600 text-sm">Size: {item.variation_name}</p>
                            )}
                            {item.variation_name && (
                              <p className="text-gray-600 text-sm">Size: {item.variation_name}</p>
                            )} */}

                            <div className='absolute bottom-14 md:bottom-4 right-4 text-xs'>
                              <div className="flex items-center gap-2 text-sm mb-1 md:my-2">
                                {item.product_variation?.sale_price && item.product_variation?.regular_price ? (
                                  <>
                                    <p className="text-black font-bold">₹{item.product_variation.sale_price * item.quantity}</p>
                                    <p className="text-gray-500 line-through">
                                      ₹{item.product_variation.regular_price * item.quantity}
                                    </p>
                                    {item.product_variation.regular_price > item.product_variation.sale_price && (
                                      <p className="text-green-800 font-medium text-xs">
                                        You saved ₹{(item.product_variation.regular_price - item.product_variation.sale_price) * item.quantity}
                                      </p>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <p className="text-black font-bold">₹{item.sale_price * item.quantity}</p>
                                    <p className="text-gray-500 line-through">
                                      ₹{item.regular_price * item.quantity}
                                    </p>
                                    {item.regular_price > item.sale_price && (
                                      <p className="text-green-800 font-medium">
                                        You saved ₹{(item.regular_price - item.sale_price) * item.quantity}
                                      </p>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            {/* start size and qty */}
                            <div className='flex gap-3 items-center absolute left-4 bottom-0 md:left-0 md:relative'>
                              {item.product_variation?.size ? (
                                <div className="flex items-center">
                                  <button
                                    className="my-4 px-2 py-[2px] bg-gray-200 text-black text-[10px]"
                                  >
                                    Size: {item.product_variation?.size}
                                  </button>
                                </div>
                              ) : item.product_variations?.find((size) => size.id === item.prod_variation_id) ? (
                                <div className="flex items-center">
                                  <button
                                    className="my-4 px-2 py-[2px] bg-gray-200 text-black text-[10px]"
                                  >
                                    Size: {item.product_variations?.find((size) => size.id === item.prod_variation_id)?.size}
                                  </button>
                                </div>
                              ) : ''}

                              <div className="flex items-center">
                                <span>{item.name}</span>
                                <button
                                  onClick={() => {
                                    setCurrentItem(item);
                                    setIsPopupOpen(true);
                                  }}
                                  className="my-4 px-2 py-[2px] bg-gray-200 text-black text-[10px]"
                                >
                                  Qty: {item.quantity}
                                </button>
                              </div>
                            </div>

                            {/* end size and qty */}
                            <button
                              onClick={() => (removeFromCart(item.id))}
                              className="text-black text-sm absolute top-4 right-4"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div key={item.id} className="cart-item">
                        <p>Product details not available</p>
                      </div>
                    )
                  ))}
                </div>

                {isPopupOpen && (
                  <div className={`fixed inset-0 flex items-center justify-center ${themeBgColor} bg-opacity-50 z-50`}>
                    <div className="bg-white p-6 rounded shadow-lg w-80">
                      <h2 className="text-xl font-bold mb-4">Select Quantity</h2>

                      {/* Quantity Buttons */}
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((qty) => (
                          <button
                            type="button"
                            key={qty}
                            onClick={() => setSelectedQuantity(qty)}
                            className={`w-full h-10 flex items-center justify-center rounded transition-none duration-0 border
                                          ${selectedQuantity === qty ? `${themeBgColor} text-white border-black` : 'bg-gray-200 text-gray-700 border-gray-300'}`}
                          >
                            {qty}
                          </button>

                        ))}
                      </div>

                      {/* Submit and Close Buttons */}
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setIsPopupOpen(false);
                            setSelectedQuantity(null);
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            if (currentItem) {
                              setIsLoading(true);
                              // console.log('currentItem', currentItem);
                              try {
                                // Call selectQuantity function and wait for it to complete
                                await selectQuantity(
                                  currentItem.product_id,
                                  currentItem.prod_variation_id,
                                  selectedQuantity,
                                  currentItem.sale_price
                                );

                                // ✅ Manually update cart state with new quantity
                                setCart((prevCart) =>
                                  prevCart.map((item) =>
                                    item.id === currentItem.id &&
                                      item.prod_variation_id === currentItem.prod_variation_id
                                      ? { ...item, quantity: selectedQuantity }
                                      : item
                                  )
                                );

                                setIsPopupOpen(false); // Optional: move here too
                                setSelectedQuantity(null);
                              } catch (error) {
                                console.error("Error while selecting quantity:", error);
                              } finally {
                                // Always reset the loading state to false after operation
                                setIsLoading(false);
                              }
                            }
                          }}
                          className={`px-4 py-2 rounded text-white ${isLoading ? "bg-gray-400 cursor-not-allowed" : `${themeBgColor} hover:bg-gray-700`
                            }`}
                          disabled={isLoading} // Disable button when loading
                        >
                          {isLoading ? "Loading..." : "Submit"}
                        </button>

                      </div>
                    </div>
                  </div>
                )}
                {loading ? (
                  <div className="price-summary md:w-1/3 w-full">
                    <Skeleton
                      height={100}
                    />
                  </div>
                ) : (
                  <div className="price-summary md:w-1/3 w-full">
                    <div className='p-3 rounded-lg border'>
                      <h4 className='font-medium'>Coupons & Offers</h4>
                      <div className='flex justify-between items-center text-sm'>
                        <div className='flex items-center gap-3 mt-3'>
                          <img className='w-6' alt='percentage' src='images/percentage.png' loading="lazy" />
                          <div className='text-sm'>
                            <p className='font-semibold'>Apply Coupon / Gift Card</p>
                            <p className='text-gray-500 font-medium'>Crazy deals and other amazing offers</p>
                          </div>
                        </div>
                        <Link onClick={() => setOpenCoupon(true)} className='text-blue-600 font-semibold'>View</Link>
                      </div>
                    </div>
                    {discount > 0 && (
                      <div className="rounded-md my-4 border flex justify-between items-center relative border-green-200 bg-gradient-to-b from-green-200 to-transparent p-3">
                        <span className='absolute top-[-12px] left-[30%] rounded-full px-2 py-1 font-semibold text-[10px] bg-[#ef7f1a]'>Best offer applied</span>
                        <div className='flex items-center gap-3'>
                          <img className='w-6' alt='percentage-icon' src='images/percentage.png' loading="lazy" />
                          <p>
                            <span className='text-sm font-semibold mb-2'>{couponData.coupon_code}</span> | <span className='text-sm'>{couponData.coupon_code}</span>
                            <span className='block text-xs text-gray-400'> (-₹ {discount.toFixed(2)}) discount has been applied.</span>
                          </p>
                        </div>
                        <button onClick={() => setCouponData([])} className='bg-green-500 rounded-full text-white text-xs py-1 px-2'>remove</button>
                      </div>
                    )}
                    <div className='p-3 rounded-lg border mt-3'>
                      <h3 className="text-sm font-semibold mb-4">PRICE SUMMARY</h3>
                      <p className="text-gray-600 text-sm mb-3 flex justify-between font-medium">
                        Total MRP : <span>₹ {totalMRP.toFixed(2)}</span>
                      </p>
                      <div className='flex justify-between items-center mb-2'>
                        <span className='text-gray-500 font-medium text-sm'>Price :</span>
                        <span className='text-base'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(subtotal)}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 flex justify-between font-medium">
                        CGST ( 9% ): <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(CGST)}</span>
                      </p>
                      <p className="text-gray-600 text-sm mb-3 flex justify-between font-medium">
                        SGST ( 9% ): <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(SGST)}</span>
                      </p>
                      {/* <p className="text-gray-600 text-sm mb-3 flex justify-between font-medium">
                        Total GST ( 18% ): <span>₹ {totalGST}</span>
                      </p> */}
                      <p className="text-gray-600 text-sm mb-3 flex justify-between font-medium">Bag Discount: <span className='text-green-400'>{Number.isFinite(savings) ? `-₹ ${savings.toFixed(2)}` : ''}</span></p>
                      <p className="text-gray-600 text-sm mb-3 flex justify-between font-medium">Delivery Fee: <span className='text-green-400'>Free</span></p>
                      <p className="font-medium border-dotted border-t text-black text-lg mt-2 flex justify-between my-3">Subtotal:
                        {discount > 0 ? (
                          <div className="text-green-400 text-right">
                            <span className='text-gray-500 text-[11px] line-through sm:text-sm'>₹ {grandTotal.toFixed(2)}</span> ₹ {(finalAmount).toFixed(2)}
                            {/* <span className='block text-xs text-gray-400'>Your coupon is applied (-₹ {discount.toFixed(2)})</span> */}
                          </div>
                        ) : (
                          <span>₹ {grandTotal}</span>
                        )}
                      </p>
                      <p className="mt-1 text-xs font-medium text-center">
                        Yayy! You get <span className='text-green-600 font-semibold'>FREE</span> delivery on this order
                      </p>
                      <button
                        onClick={() => proceedHandler()}
                        className={`mt-4 w-full ${themeBgColor} text-white p-2 rounded`}
                      >
                        PROCEED
                      </button>
                    </div>
                    <img src='../images/icons.jpg' alt='icons' loading="lazy" />
                  </div>
                )}
              </div>

              {openCoupon && (
                <div className={`${themeBgColor} bg-opacity-50 fixed inset-0 flex justify-center items-center z-50`}>
                  <div className="bg-white p-5 rounded-2xl shadow-lg w-[75%] h-[95%] overflow-scroll scrollbar-none">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-sm md:text-xl font-semibold">Coupons & Offers</h2>
                      <button
                        onClick={() => setOpenCoupon(false)}
                        className="text-gray-500 hover:text-red-500 text-xl"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleApplyCoupon} className="flex flex-col gap-3">
                      <div className="flex gap-2 relative">
                        <input
                          name="coupon-code"
                          type="text"
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 border rounded-sm focus:outline-none focus:border focus:border-black"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button
                          type="submit"
                          className={`${themeBgColor} text-xs text-white px-4 py-2 rounded-sm absolute right-0 bottom-0 h-full`}
                          disabled={loading}
                        >
                          {loading ? "Applying..." : "APPLY"}
                        </button>
                      </div>
                    </form>

                    {status && (
                      <p
                        className={`mt-3 text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"
                          }`}
                      >
                        {status.message}
                      </p>
                    )}

                    {/* Default Coupons List */}
                    <div className="mt-4">
                      <h4 className="text-base font-medium mb-2">Available Coupons</h4>
                      <div className="grid gap-3">
                        {defaultCoupon.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setCouponCode(item.coupon_code);
                              handleApplyCoupon({ preventDefault: () => { } });
                            }}
                            className="cursor-pointer border border-gray-300 hover:border-black transition rounded-md p-3 flex justify-between items-center group"
                          >
                            <div>
                              <div className="text-sm font-semibold text-gray-800 group-hover:text-black">
                                {item.coupon_code}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.description || "Tap to apply this coupon"}
                              </div>
                            </div>
                            <div className={`bg-gray-100 text-xs px-2 py-1 rounded group-hover:${themeBgColor} group-hover:text-white`}>
                              Select
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center my-8">
              <img alt='cart-png' loading="lazy" className='w-[350px] m-auto' src='images/bag.png' />
              <p className="text-xl font-semibold my-3">Hey, your bag feels a bit empty!</p>
              <p className="text-gray-600 mt-2">
                Let’s add some awesome items to it!
              </p>

              <button
                onClick={() => navigate('/shop')}
                className={`my-4 ${themeBgColor} text-white px-6 py-2 rounded`}
              >
                Continue Shopping
              </button>
            </div>
          )
          }
        </>

      </div>
      {localStorage.getItem('userToken') && (
        loading ? (
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        ) :
          <Suspense fallback={<div>Loading...</div>}>
            <WishlistSlider />
          </Suspense>

      )}

    </SimpleLayout>
  );
};

export default Cart;


