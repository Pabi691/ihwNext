import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from '@/components/compat/router';
import axios from 'axios';
import { useGlobal } from '../../global/GlobalContext';
import SimpleLayout from '../../layout/SimpleLayout';
import { Icon } from '@iconify/react';
import Skeleton from 'react-loading-skeleton';
// import BankAccountForm from './BankAccountForm';
import BankDetails from './BankDetails';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { themeBgColor, themeTextColor } from '../../styles/typography';
import DownloadInvoiceButton from '../DownloadInvoiceButton';

const CANCELLABLE_STATUSES = ['New Order', 'Processing'];

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <svg
            viewBox="0 0 20 20"
            className={`w-6 h-6 transition-colors ${s <= (hovered || value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-100'}`}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState(null);
  const [courierName, setCourierName] = useState(null);
  const { token } = useGlobal();
  const navigate = useNavigate();
  const [showBreakup, setShowBreakup] = useState(false);
  const toggleBreakup = () => setShowBreakup(!showBreakup);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [showCancelWarning, setShowCancelWarning] = useState(false);

  // per-item review state: { [product_id]: { rating, text, status: idle|submitting|done|error } }
  const [reviews, setReviews] = useState({});

  const initReview = (productId) => {
    setReviews((prev) =>
      prev[productId] ? prev : { ...prev, [productId]: { rating: 5, text: '', status: 'idle' } }
    );
  };

  const setReviewField = (productId, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const submitReview = async (productId) => {
    const rv = reviews[productId];
    if (!rv || !rv.text.trim()) return;
    setReviewField(productId, 'status', 'submitting');
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/submit_product_review/${productId}`,
        { rating: rv.rating, review_text: rv.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviewField(productId, 'status', res.data?.status ? 'done' : 'error');
    } catch {
      setReviewField(productId, 'status', 'error');
    }
  };

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/${orderId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status) {
          console.log('order details:', response.data);
          setOrder(response.data.order);
          setTrackingId(response.data.order.allotment_vehicle[0]?.ref_no);
          setCourierName(response.data.order.allotment_vehicle[0]?.delivery_vehicle?.vehicle_name || null);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  const handleCancelOrder = async () => {
    setCancelling(true);
    setCancelError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/order_cancel_by_customer/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        window.location.reload();
      } else {
        setCancelError(response.data.message || 'Could not cancel order.');
      }
    } catch {
      setCancelError('Something went wrong. Please try again.');
    } finally {
      setCancelling(false);
      setShowCancelWarning(false);
    }
  };

  const formattedDate = new Date(order?.order_date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <SimpleLayout title='Indian Hair World' link={'/'}>
      <div className="py-12">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">

            {/* Sidebar Menu */}
            <div className="w-1/4 border h-fit rounded-lg p-6 hidden md:block sticky top-10">
              <ul className="space-y-8">
                {[
                  { label: 'Overview', path: '/myaccount', icon: 'mdi:view-dashboard' },
                  { label: 'My Orders', path: '/myaccount/orders', icon: 'mdi:shopping' },
                  { label: 'My Addresses', path: '/myaccount/addresses', icon: 'mdi:map-marker' },
                  { label: 'My Profile', path: '/myaccount/profile', icon: 'mdi:account' },
                  { label: 'Logout', path: '/logout', icon: 'mdi:logout', color: 'text-red-600' },
                ].map((menu) => (
                  <li
                    key={menu.label}
                    className={`p-2 border-b ${menu.color ?? menu.color} font-medium cursor-pointer hover:text-black text-gray-400`}
                    onClick={() => navigate(menu.path)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon={menu.icon} width={20} height={20} /> {menu.label}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {loading ? (
              <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <Skeleton width={150} height={25} />
                <Skeleton width={250} height={125} />
                <Skeleton width={350} height={225} />
              </div>
            ) : (
              <div className='w-full md:w-3/4'>
                <div className="max-w-7xl mx-auto px-6">

                  <div className="p-4 border rounded-lg border-gray-200 flex justify-between items-center">
                    <p className="text-gray-900 text-lg font-medium">Order Number <br /> <span className="font-semibold">{order.id}</span></p>
                    <p className="text-gray-900 text-lg font-medium">Placed On <br /> {formattedDate}</p>
                  </div>

                  {order.order_items.map((item) => (
                    <div key={item.id} className="p-4 bg-white rounded-lg border border-gray-300 my-3 flex gap-3 ">
                      <Link to={`/product/${item.product_details?.slug}`}>
                        <img alt='order-details' loading="lazy" className='h-48 w-auto rounded-lg' src={item.product_details?.primary_img} />
                      </Link>
                      <div>
                        <p className="text-gray-900 font-bold mb-2">{item.product_details.brand_details?.brand_name}</p>
                        <p className="text-gray-900 font-medium text-sm mb-2">{item.product_name}</p>
                        <p className="text-gray-900 font-medium text-sm mb-2">Quantity: {item.quantity}</p>
                        <p className="text-gray-900 font-medium text-sm mb-2">Price: ₹{item.price}</p>
                        <p className="text-gray-900 font-semibold text-sm mb-2">Total: ₹{item.total_price}</p>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 border rounded-lg border-gray-200">
                    <p className="text-gray-900">Status: <span className="text-black font-semibold">{order.shipping_status}</span></p>
                    {/* <p className="text-gray-900">Placed On <br /> {order.order_date}</p> */}
                  </div>

                  {order.shipping_info && (
                    <div className="border p-4 rounded-md bg-gray-50 mt-2">
                      <h3 className=" text-gray-800 font-semibold my-4">Shipping Address</h3>
                      <p className="text-gray-900 text-sm font-semibold">{order.shipping_info.full_name}</p>
                      <p className="text-gray-900 text-sm">{order.shipping_info.address_line_1}, {order.shipping_info.city}</p>
                      <p className="text-gray-900 text-sm">{order.shipping_info.state}, {order.shipping_info.zip_code}, {order.shipping_info.country}</p>
                      <p className="text-gray-900 text-sm">Phone: {order.shipping_info.mobile_number}</p>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-800 my-6">Tracking Details</h3>
                  {trackingId && (
                    <div className='flex justify-between items-center mb-4'>
                      <p className='font-medium text-xs'>Tracking no. <br /><span className='text-base font-semibold'>#{trackingId}</span></p>
                      {courierName?.toLowerCase() === 'shiprocket' ? (
                        <span className='bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-md tracking-wide'>Shiprocket</span>
                      ) : (
                        <img alt='delhivery-icon' className={`${themeBgColor} p-[2px] w-[100px] md:w-[150px]`} src='/images/Delhivery_logo.png' />
                      )}
                    </div>
                  )}

                  <div className="relative border-l-2 border-dashed ml-4">
                    {order.order_trackings.map((item, index) => {
                      const isLast = index === order.order_trackings.length - 1;

                      // Extract status after "=>"
                      let cleanStatus = item.full_details?.split('=>')[1]?.trim();

                      // Map raw statuses to user-friendly text
                      switch (cleanStatus) {
                        case 'New Order':
                          cleanStatus = 'Order Confirmed';
                          break;
                        case 'Processing':
                          cleanStatus = 'Seller has processed your order.';
                          break;
                        case 'Ready For Ship':
                          cleanStatus = 'Your item has been picked up by delivery partner.';
                          break;
                        case 'Shipped':
                          cleanStatus = 'Shipped.';
                          break;
                        case 'Out for Delivery':
                          cleanStatus = 'Out For Delivery.';
                          break;
                        case 'Delivered':
                          cleanStatus = 'Delivered.';
                          break;
                        case 'Return Requested':
                          cleanStatus = 'Return.';
                          break;
                        case 'Return Accepted':
                          cleanStatus = 'Return Approved.';
                          break;
                        case 'Return Collected':
                        case 'Return Received':
                          cleanStatus = cleanStatus.replace('Return', 'Return '); // leave as-is for now
                          break;
                        default:
                          cleanStatus = cleanStatus || 'Status Unknown';
                      }

                      // Format the date
                      const formatDate = (dateString) => {
                        const date = new Date(dateString);
                        const day = date.toLocaleString('en-US', { weekday: 'short' });
                        const dateNum = date.getDate();
                        const suffix =
                          dateNum % 10 === 1 && dateNum !== 11
                            ? 'st'
                            : dateNum % 10 === 2 && dateNum !== 12
                              ? 'nd'
                              : dateNum % 10 === 3 && dateNum !== 13
                                ? 'rd'
                                : 'th';
                        const month = date.toLocaleString('en-US', { month: 'short' });
                        const year = `'${String(date.getFullYear()).slice(-2)}`;
                        const time = date.toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        }).toLowerCase().replace(':', '.');

                        return `${day}, ${dateNum}${suffix} ${month} ${year} - ${time}`;
                      };

                      return (
                        <div key={item.id} className="pl-6 relative mb-6">
                          {/* Check icon */}
                          <CheckCircleIcon className="absolute left-[-11px] top-0 w-5 h-5 text-green-600 z-10 bg-white rounded-full" />

                          {/* Timeline content */}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-800">{cleanStatus}</span>
                            <span className="text-xs text-gray-500 mt-1">
                              {formatDate(item.created_at)}
                            </span>
                          </div>

                          {/* Optional dashed line */}
                          {!isLast && (
                            <div className="absolute left-[-2px] top-6 h-full border-l-2 border-green-400 "></div>
                          )}
                        </div>
                      );
                    })}

                  </div>

                  {/* <h3 className="text-lg font-semibold mt-6">Tracking details</h3>
                  {order.order_trackings.map((item) => (
                    <div key={item.id} className="p-4 me-2 bg-white rounded-md shadow-md border border-gray-300 mt-2 w-fit inline-block">
                      <p className="text-gray-800 font-medium">{item?.full_details}</p>
                      <p className="text-gray-900">{item?.html_email_body}</p>
                      <p className="text-gray-900">{item?.sms_body}</p>
                      <p className="text-gray-900 font-semibold">{item?.whatsapp_sms_body}</p>
                    </div>
                  ))} */}

                  {order?.shipping_status === "Return Accepted" && (
                    <BankDetails order={order} token={token} />
                  )}

                  {["pending", "completed", "cancelled", "failed"].includes(order.order_payments?.[0]?.payment_status) && (
                    <div className="text-sm text-gray-800 border rounded-lg border-gray-200 p-4 my-3 shadow-md space-y-4">
                      {/* Summary Section (Always Visible) */}
                      <div className="flex items-center justify-between">
                        <div>
                          {/* <p className="text-lg font-semibold">₹{order.pay_amt.toFixed(2)}</p> */}
                          <p className="text-xs text-gray-500">Total Price</p>
                          <p className="text-xs text-gray-500">
                            GST @ {order.gst_summary.gst_rate}%
                            (CGST {order.gst_summary.cgst} + SGST {order.gst_summary.sgst})
                          </p>
                          {parseFloat(order.discount_amt) > 0 && (
                            <p className="text-xs text-green-600 font-medium">
                              Coupon {order.coupon_code ? `(${order.coupon_code})` : ''} applied: − ₹{parseFloat(order.discount_amt).toFixed(2)}
                            </p>
                          )}
                          <div className="flex justify-between font-semibold">
                            <span>Total (incl. GST)</span>
                            <span>₹{parseFloat(order.pay_amt).toFixed(2)}</span>
                          </div>

                        </div>
                        <div className="text-right">
                          {(() => {
                            const paymentStatus = order.order_payments?.[0]?.payment_status;
                            const rawMethod = (order.order_payments?.[0]?.payment_method || '').toLowerCase();
                            const isOnline = rawMethod.includes('razor') || rawMethod.includes('online') || rawMethod.includes('upi') || rawMethod.includes('card');
                            const isCodMethod = rawMethod.includes('cod');
                            const methodLabel = isOnline ? 'Online (Razorpay)' : isCodMethod ? 'COD' : (order.payment_method?.method_name || rawMethod);

                            if (paymentStatus === 'completed') {
                              return <p className="text-green-600 font-medium">Paid via {methodLabel}</p>;
                            }
                            if (paymentStatus === 'failed') {
                              return (
                                <p className="text-red-600 font-medium flex gap-2 items-center justify-end">
                                  <span className="w-5 h-5 bg-red-100 text-red-700 flex justify-center items-center rounded-full text-xs font-bold">✕</span>
                                  Payment Failed — Order Cancelled
                                </p>
                              );
                            }
                            // COD delivered = cash was collected at door
                            if (isCodMethod && order.shipping_status === 'Delivered') {
                              return <p className="text-green-600 font-medium">Paid via COD</p>;
                            }
                            if (isCodMethod) {
                              return <p className="text-yellow-600 font-medium">To be paid by COD</p>;
                            }
                            return <p className="text-yellow-600 font-medium">{methodLabel}</p>;
                          })()}

                          <button
                            type="button"
                            onClick={toggleBreakup}
                            className={`${themeTextColor} text-xs underline mt-1`}
                          >
                            {showBreakup ? "Hide Breakup" : "View Breakup"}
                          </button>
                        </div>
                      </div>

                      {/* Detailed Breakup (Toggleable) */}
                      {showBreakup && (
                        <div className="space-y-2 transition-all duration-300">
                          <hr className="my-3" />
                          {/* orders items */}
                          {order.order_items.map((item) => (
                            <div key={item.id} className="p-4 rounded-lg border border-gray-300 my-3 flex justify-between">
                              <p className="text-gray-900 font-medium text-sm mb-2">{item.product_name}</p>
                              <p className="text-gray-900 font-medium text-sm mb-2">Price: ₹{item.price} × {item.quantity}</p>
                              <p className="text-gray-900 font-semibold text-sm mb-2">
                                Total: ₹{item.total_price}
                              </p>
                            </div>
                          ))}
                          <hr className="my-3" />
                          {parseFloat(order.discount_amt) > 0 && (
                            <>
                              <div className="flex justify-between">
                                <span>Items Total</span>
                                <span>₹{parseFloat(order.bill_amt).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-green-600 font-medium">
                                <span>Coupon Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                                <span>− ₹{parseFloat(order.discount_amt).toFixed(2)}</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between">
                            <span>Total Price</span>
                            <span>₹{order.net_amt.toFixed(2)}</span>
                          </div>

                          <div className="flex justify-between">
                            <span>CGST ( 9% ) :</span>
                            <span>₹{order.gst_summary.cgst}</span>
                          </div>

                          <div className="flex justify-between">
                            <span>SGST ( 9% ) :</span>
                            <span>₹{order.gst_summary.sgst}</span>
                          </div>

                          {parseFloat(order.shipping_total) > 0 && (
                            <div className="flex justify-between">
                              <span>COD Fee</span>
                              <span>₹{order.shipping_total.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span className="text-green-600 font-medium">FREE</span>
                          </div>
                          <hr className="my-3" />
                          <div className="flex justify-between font-semibold text-base">
                            <span>
                              {order.order_payments?.[0]?.payment_status === 'completed'
                                ? 'Total Paid'
                                : 'Total Amount'}
                            </span>
                            <span>₹{order.pay_amt.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Rate your purchase (shown after delivery) ── */}
                  {order.shipping_status === 'Delivered' && (
                    <div className="my-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Rate Your Purchase</h3>
                      <div className="space-y-4">
                        {order.order_items.map((item) => {
                          const pid = item.product_id;
                          const rv  = reviews[pid];

                          if (!rv) {
                            return (
                              <div key={item.id} className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.product_details?.primary_img}
                                    alt=""
                                    className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                                  />
                                  <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.product_name}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => initReview(pid)}
                                  className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#04A9FF] text-white hover:bg-[#0090e0] transition-colors flex-shrink-0 ml-3"
                                >
                                  Write a Review
                                </button>
                              </div>
                            );
                          }

                          if (rv.status === 'done') {
                            return (
                              <div key={item.id} className="flex items-center gap-3 border border-green-100 bg-green-50 rounded-xl p-4">
                                <svg viewBox="0 0 20 20" className="w-5 h-5 text-green-500 fill-green-500 flex-shrink-0">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                  <p className="text-sm font-semibold text-green-700">Review submitted for <span className="font-bold">{item.product_name}</span></p>
                                  <p className="text-xs text-green-600">Thank you! It will appear on the product page.</p>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div key={item.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.product_details?.primary_img}
                                  alt=""
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                                />
                                <p className="text-sm font-medium text-gray-800">{item.product_name}</p>
                              </div>

                              <StarPicker value={rv.rating} onChange={(v) => setReviewField(pid, 'rating', v)} />

                              <textarea
                                rows={3}
                                value={rv.text}
                                onChange={(e) => setReviewField(pid, 'text', e.target.value)}
                                placeholder="Share your experience with this product…"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#04A9FF] resize-none transition-colors"
                              />

                              {rv.status === 'error' && (
                                <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
                              )}

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => submitReview(pid)}
                                  disabled={rv.status === 'submitting' || !rv.text.trim()}
                                  className="px-5 py-2 bg-[#04A9FF] hover:bg-[#0090e0] text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
                                >
                                  {rv.status === 'submitting' ? 'Submitting…' : 'Submit Review'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setReviews((prev) => { const n = { ...prev }; delete n[pid]; return n; })}
                                  className="px-4 py-2 border border-gray-200 text-sm text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Cancel Order — only within 24 hours */}
                  {CANCELLABLE_STATUSES.includes(order.shipping_status) && (() => {
                    const hoursPassed = (new Date() - new Date(order.order_date)) / (1000 * 60 * 60);
                    return hoursPassed <= 24;
                  })() && (
                    <div className="my-4">
                      <p className="text-xs text-gray-500 mb-2">
                        The cancel option is available for 24 hours from order placement. Make sure to cancel within that timeframe if needed.
                      </p>
                      {cancelError && (
                        <p className="text-red-600 text-sm mb-2">{cancelError}</p>
                      )}
                      <button
                        onClick={() => setShowCancelWarning(true)}
                        disabled={cancelling}
                        className="border border-red-500 text-red-600 px-6 py-2 rounded-md font-medium hover:bg-red-50 transition disabled:opacity-60"
                      >
                        {cancelling ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    </div>
                  )}

                  {/* Invoice — only after payment, and only for orders after #1090 */}
                  {parseInt(order.id) > 1090 &&
                    (order.order_payments?.[0]?.payment_status === 'completed' ||
                      (order.payment_method?.method_name === 'COD' && order.shipping_status === 'Delivered')) && (
                    <DownloadInvoiceButton order={order} />
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      {showCancelWarning && (
        <div className={`fixed inset-0 ${themeBgColor} bg-opacity-50 flex items-center justify-center z-50`}>
          <div className="bg-white p-6 rounded-lg shadow-lg mx-4 md:mx-0 max-w-sm w-full">
            <p className="text-xs text-gray-900">
              It's important to keep in mind that too many cancellations can lead to an account ban,
              so let's try to avoid that! <br /> If you ever have any questions or concerns about cancellations,
              feel free to reach out to us for assistance through WhatsApp. <br />Your understanding and cooperation are
              truly appreciated!
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button onClick={() => setShowCancelWarning(false)} className="px-4 py-2 bg-gray-300 rounded text-xs">No</button>
              <button onClick={handleCancelOrder} className={`px-4 py-2 ${themeBgColor} text-white rounded text-xs`} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </SimpleLayout>
  );
};

export default OrderDetails;



