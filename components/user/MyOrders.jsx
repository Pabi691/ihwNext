import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../global/GlobalContext';
import axios from 'axios';
import { BiChevronRight, BiLogoWhatsapp } from 'react-icons/bi';
import { Link, useNavigate } from '@/components/compat/router';
import { MdPending } from 'react-icons/md';
import { themeBgColor } from '../../styles/typography';

const MyOrders = () => {
  const { token } = useGlobal();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchOrders = async () => {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_my_orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(response.data.status){
          setLoading(false);
          console.log('orders',response.data);
          setOrders(response.data.orders);
        } else {
          setLoading(false);
          // console.log('orders status not success');
        }
      };
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const cancelOrderHandler = async () => {
    if (!orderToCancel) return;
    setLoading(true);
    try {
      // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/order_cancel_by_customer/${orderToCancel}`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderToCancel ? { ...order, shipping_status: 'Order Cancelled ' } : order
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setShowWarning(false);
    }
  };

  return (
    <>
      {orders.length > 0 && (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">

              <button onClick={() => navigate(`/myaccount/order/${order.id}`)} className='border-b flex items-center justify-between w-full py-4'>
                <div className="flex items-center justify-start gap-4">
                  {order.shipping_status === 'Order Cancelled ' ||  order.shipping_status === "Payment Failed"? (
                    <span className='w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center font-medium'>
                      ✕
                    </span>
                  ) : order.shipping_status === "Pending"? (
                    <span className='w-10 h-10 bg-yellow-600 text-white rounded-full flex items-center justify-center font-medium'>
                      <MdPending />
                    </span>
                  ) : (
                    <span className='w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center font-medium'>
                      ✓
                    </span>
                  )}
                  <div>
                    <p className="text-gray-600 font-medium text-start">{order.shipping_status}</p>
                    <p className="text-sm text-gray-600 text-start">Order Placed On {order.order_date}</p>
                  </div>
                </div>
                <BiChevronRight className={`text-5xl text-gray-300 transform`} />
              </button>

              <>
                <div className="order-items mt-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Order Items:</h4>
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-gray-50 rounded-md shadow-sm mb-2 border border-gray-300"
                    >
                      <p className="text-sm text-gray-700">
                        {item.product_name}
                      </p>
                      <p className="text-sm text-gray-700">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-700">
                        Price: ₹{item.price}
                      </p>
                      <p className="text-sm text-gray-700">
                        Total: ₹{item.total_price}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Net Amount: ₹{order.net_amt}
                </p>

                {/* {order.shipping_status !== "Order Cancelled " && (
                  <button onClick={() => { setShowWarning(true); setOrderToCancel(order.id); }} className='border font-medium p-2 text-sm my-2'>✕ Cancel Order</button>
                )} */}
              </>

              {
                order.shipping_status === 'Delivered' ? (
                  <>
                    <button onClick={() => navigate(`/myaccount/return/${order.id}`)} className='border-green-500 border text-green-500 text-xs p-1 rounded-sm mt-2 font-medium'>
                      Return
                    </button>
                    {/* <button className='bg-[#203466] ml-3 text-white text-xs p-1 rounded-sm mt-2 font-medium'>
                      Exchange
                    </button> */}
                  </>
                ) :
                  (
                    <>
                      {(order.shipping_status !== 'Order Cancelled '
                        && order.shipping_status !== 'Delivered'
                        && order.shipping_status !== 'Refund Received'
                        && (() => {
                          const orderDate = new Date(order.order_date);
                          const now = new Date();
                          const timeDifference = now - orderDate;
                          const hoursPassed = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours
                          return hoursPassed <= 24; // Show button only if within 24 hours
                        })()
                      ) && (
                          <>
                            <p className='text-xs my-2'>
                              Hey there! Just a heads up, the order cancel button will only be available for 24 hours, so if you need to cancel, make sure to do so within that timeframe.
                            </p>
                            <div className='flex justify-between items-center'>
                              <button
                                onClick={() => { setShowWarning(true); setOrderToCancel(order.id); }}
                                className='border font-medium p-2 text-sm my-2'
                              >
                                ✕ Cancel Order
                              </button>
                              <Link to={'https://wa.me/+918240561627?text=Hello%20Indian%20Hair%20World%2C%20I%20need%20assistance%20regarding%20my%20order%20with%20order%20ID%20' + order.id} target="_blank" rel="noopener noreferrer" className='flex items-center gap-2 text-xs text-gray-600'>
                                <BiLogoWhatsapp className='text-green-400 text-3xl' />
                              </Link>
                            </div>

                          </>
                        )}
                    </>
                  )
              }
            </div>
          ))}
        </div>
      )}
      {showWarning && (
        <div className={`fixed inset-0 ${themeBgColor} bg-opacity-50 flex items-center justify-center`}>
          <div className="bg-white p-6 rounded-lg shadow-lg mx-4 md:mx-0">
            <p className="text-xs text-gray-700">
              It's important to keep in mind that too many cancellations can lead to an account ban,
              so let's try to avoid that! <br /> If you ever have any questions or concerns about cancellations,
              feel free to reach out to us for assistance through whatsapp. <br />Your understanding and cooperation are
              truly appreciated!
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button onClick={() => setShowWarning(false)} className="px-4 py-2 bg-gray-300 rounded text-xs">No</button>
              <button onClick={cancelOrderHandler} className={`px-4 py-2 ${themeBgColor} text-white rounded text-xs`} disabled={loading}>
                {loading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;

