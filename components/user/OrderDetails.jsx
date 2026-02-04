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

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState(null);
  const { token } = useGlobal();
  const navigate = useNavigate();
  const [showBreakup, setShowBreakup] = useState(false);
  const toggleBreakup = () => setShowBreakup(!showBreakup);

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
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

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
                    <p className="text-gray-700 text-lg font-medium">Order Number <br /> <span className="font-semibold">{order.id}</span></p>
                    <p className="text-gray-700 text-lg font-medium">Placed On <br /> {formattedDate}</p>
                  </div>

                  {order.order_items.map((item) => (
                    <div key={item.id} className="p-4 bg-white rounded-lg border border-gray-300 my-3 flex gap-3 ">
                      <Link to={`/product/${item.product_details?.slug}`}>
                        <img alt='order-details' loading="lazy" className='h-48 w-auto rounded-lg' src={item.product_details?.primary_img} />
                      </Link>
                      <div>
                        <p className="text-gray-900 font-bold mb-2">{item.product_details.brand_details?.brand_name}</p>
                        <p className="text-gray-700 font-medium text-sm mb-2">{item.product_name}</p>
                        <p className="text-gray-700 font-medium text-sm mb-2">Quantity: {item.quantity}</p>
                        <p className="text-gray-700 font-medium text-sm mb-2">Price: ₹{item.price}</p>
                        <p className="text-gray-700 font-semibold text-sm mb-2">Total: ₹{item.total_price}</p>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 border rounded-lg border-gray-200">
                    <p className="text-gray-700">Status: <span className="text-black font-semibold">{order.shipping_status}</span></p>
                    {/* <p className="text-gray-700">Placed On <br /> {order.order_date}</p> */}
                  </div>

                  {order.shipping_info && (
                    <div className="border p-4 rounded-md bg-gray-50 mt-2">
                      <h3 className=" text-gray-800 font-semibold my-4">Shipping Address</h3>
                      <p className="text-gray-700 text-sm font-semibold">{order.shipping_info.full_name}</p>
                      <p className="text-gray-700 text-sm">{order.shipping_info.address_line_1}, {order.shipping_info.city}</p>
                      <p className="text-gray-700 text-sm">{order.shipping_info.state}, {order.shipping_info.zip_code}, {order.shipping_info.country}</p>
                      <p className="text-gray-700 text-sm">Phone: {order.shipping_info.mobile_number}</p>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-800 my-6">Tracking Details</h3>
                  {trackingId && (
                    <div className='flex justify-between items-center mb-4'>
                      <p className='font-medium text-xs'>Tracking no. <br /><span className='text-base font-semibold'>#{trackingId}</span></p>
                      <img alt='delhivery-icon' className={`${themeBgColor} p-[2px] w-[100px] md:w-[150px]`} src={`${"" || ''}/images/Delhivery_logo.png`} />
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
                      <p className="text-gray-700">{item?.html_email_body}</p>
                      <p className="text-gray-700">{item?.sms_body}</p>
                      <p className="text-gray-700 font-semibold">{item?.whatsapp_sms_body}</p>
                    </div>
                  ))} */}

                  {order?.shipping_status === "Return Accepted" && (
                    <BankDetails order={order} token={token} />
                  )}

                  {["pending", "completed", "cancelled"].includes(order.order_payments?.[0]?.payment_status) && (
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

                          <div className="flex justify-between font-semibold">
                            <span>Total (incl. GST)</span>
                            <span>₹{order.shipping_total ? (order.gst_summary.total_with_gst + order.shipping_total) : order.gst_summary.total_with_gst}</span>
                          </div>

                        </div>
                        <div className="text-right">
                          {order.order_payments?.[0]?.payment_status === "completed" ? (
                            <p className="text-green-600 font-medium">Paid via {order.payment_method?.method_name}</p>
                          ) : order.payment_method?.method_name === "COD" ? (
                            <p className="text-green-600 font-medium">To be paid by {order.payment_method?.method_name}</p>
                          ) : order.payment_method?.method_name === "Razorpay" ? (
                            <p className="text-gray-500 font-medium flex gap-3 items-center">
                              <span className="w-6 h-6 bg-gray-300 text-gray-800 flex justify-center items-center rounded-full text-sm">✕</span>
                              Payment failed
                            </p>
                          ) : (
                            <p className="text-yellow-600 font-medium">{order.payment_method?.method_name}</p>
                          )}

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
                              <p className="text-gray-700 font-medium text-sm mb-2">{item.product_name}</p>
                              <p className="text-gray-700 font-medium text-sm mb-2">Price: ₹{item.price} × {item.quantity}</p>
                              <p className="text-gray-700 font-semibold text-sm mb-2">
                                Total: ₹{item.total_price}
                              </p>
                            </div>
                          ))}
                          <hr className="my-3" />
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
                          
                          <div className="flex justify-between">
                            <span>COD Fee</span>
                            <span>₹{order.shipping_total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span className="text-green-600 font-medium">FREE</span>
                          </div>
                          <hr className="my-3" />
                          <div className="flex justify-between font-semibold text-base">
                            <span>Total to be paid</span>
                            <span>₹{order.payable_amount.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <DownloadInvoiceButton order={order} />

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default OrderDetails;



