import React, { useEffect, useState, useRef } from 'react';
import { useGlobal } from '../../global/GlobalContext';
// import API_BASE_URL from '../../global/apiConfig';
import axios from 'axios';
import { Link, useNavigate } from '@/components/compat/router';
import { Package, MapPin, User, HelpCircle, SignalHigh } from "lucide-react";
import Skeleton from 'react-loading-skeleton';
import { Icon } from '@iconify/react/dist/iconify.js';
import { themeBgColor } from '../../styles/typography';

const OverView = () => {
  const { token } = useGlobal();
  // const [orders, setOrders] = useState([]);
  const [limitOrders, setLimitOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const navigate = useNavigate();
  const profileFetchedRef = useRef(false);
  const ordersFetchedRef = useRef(false);
  const profileInFlightRef = useRef(false);
  const ordersInFlightRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const userToken = localStorage.getItem("userToken");
    if (!userToken) return;
    if (profileFetchedRef.current || profileInFlightRef.current) return;

    const fetchProfile = async () => {
      profileInFlightRef.current = true;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_customer_details`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const data = await response.json();
        // console.log('data', data);
        setCustomers(data.customer_data);
        setLoading(false);
      } catch (error) {
        // setError(error);
        setLoading(false);
      } finally {
        profileInFlightRef.current = false;
        profileFetchedRef.current = true;
      }
    };
    fetchProfile();
  }, [token]);



  useEffect(() => {
    if (typeof window === "undefined") return;
    const userToken = localStorage.getItem("userToken");
    if (!userToken) return;
    if (ordersFetchedRef.current || ordersInFlightRef.current) return;

    const fetchOrders = async () => {
      ordersInFlightRef.current = true;
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_my_orders`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const data = res.data;
        if (data.status) {
          // setOrders(data);
          setLimitOrders(data.orders.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        ordersInFlightRef.current = false;
        ordersFetchedRef.current = true;
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto md:block">
        {/* Profile Header */}
        <div className='flex flex-col md:flex-row justify-between'>
          {
            loading ? (
              <Skeleton
                height={45}
                width={45} />
            ) : (
              <div className="flex items-center gap-5 bg-white py-0 px-6 md:p-6 rounded-xl md:border mb-6 w-full md:w-100% md:bg-transparent border border-gray-300">
                <div className={`text-xl md:text-4xl font-extrabold w-12 h-12 rounded-full ${themeBgColor} text-white uppercase flex justify-center items-center`}>
                  {customers?.first_name?.charAt(0)}
                </div>

                <div>
                  <h1 className="md:text-xl text-base font-bold text-gray-800">{customers?.first_name}</h1>
                  <p className="text-gray-600 text-sm">{customers?.email}</p>
                  {customers?.mobile_number && (
                    <p className="text-gray-600 text-sm">{customers?.mobile_number}</p>
                  )}

                </div>
              </div>
            )
          }


          {/* <div className="hidden md:flex flex-col gap-5 bg-white p-6 rounded-xl border mb-6 w-full md:w-[49%] md:bg-gradient-to-br from-gray-400 to-transparent">
            <h2 className="text-xl font-bold text-gray-800">Cloo+ Membership</h2>
            <p className="text-gray-600">Upgrade to the premium experience now</p>
            {customers?.mobile_number && (
              <p className="text-gray-600">{customers?.mobile_number}</p>
            )}

            <div className="flex flex-col items-start md:items-center gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-gray-800" /> <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-800" /> <span>Early Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-gray-800" /> <span>VIP Support</span>
              </div>
            </div>
            <Link to={'/clo-membership'} className='text-white bg-[#203466] rounded-md py-2 text-center'>
              GET MEMBERSHIP
            </Link>

          </div> */}

        </div>


        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-6">
          <Link
            to="/myaccount/orders"
            className="bg-white p-6 rounded-xl border-none md:border text-center flex flex-col items-center gap-3"
          >
            <Package className="w-8 h-8 text-gray-700" />
            <h2 className="text-xs md:text-lg">Orders</h2>
            <p className="text-sm text-gray-600 hidden md:block">View, modify, and track orders</p>
          </Link>

          <Link
            to="/myaccount/addresses"
            className="bg-white p-6 rounded-xl border-none md:border text-center flex flex-col items-center gap-3"
          >
            <MapPin className="w-8 h-8 text-gray-700" />
            <h2 className="text-xs md:text-lg">Addresses</h2>
            <p className="text-sm text-gray-600 hidden md:block">Manage your delivery locations</p>
          </Link>

          <Link
            to="/myaccount/profile"
            className="bg-white p-6 rounded-xl border-none md:border text-center flex flex-col items-center gap-3"
          >
            <User className="w-8 h-8 text-gray-700" />
            <h2 className="text-xs md:text-lg">Profile</h2>
            <p className="text-sm text-gray-600 hidden md:block">Edit your personal information</p>
          </Link>

          <Link
            to="../contact-us"
            className="bg-white p-6 rounded-xl border-none md:border text-center flex flex-col items-center gap-3"
          >
            <HelpCircle className="w-8 h-8 text-gray-700" />
            <h2 className="text-xs md:text-lg">Help & Support</h2>
            <p className="text-sm text-gray-600 hidden md:block">Get assistance with your queries</p>
          </Link>

          <Link
            to="../about"
            className="bg-white p-6 rounded-xl border-none md:border text-center flex flex-col items-center gap-3"
          >
            <SignalHigh className="w-8 h-8 text-gray-700" />
            <h2 className="text-xs md:text-lg">Our Story</h2>
            <p className="text-sm text-gray-600 hidden md:block">Learn more about our journey</p>
          </Link>
        </div>


                            <div className="flex items-center gap-2 text-red-600 cursor-pointer md:hidden mx-6 py-1 px-2 rounded bg-red-200 border-red-400" 
                            onClick={() => navigate('/logout') }>
                                <Icon icon='mdi:logout' width={20} height={20} /> Logout
                            </div>

        {/* Recent Activity */}
        {limitOrders && (
<div className="mt-8 hidden">
          <h3 className="text-base font-semibold text-gray-800 mb-4 ml-4 md:ml-0">Recent Activity</h3>
          <ul className="bg-white p-6 rounded-lg shadow-lg">
            {limitOrders.map((activity) => (
              <li
                key={activity.id}
                className="flex flex-col py-4 border-b border-gray-200 last:border-0"
              >
                {activity.order_items && activity.order_items.length > 0 ? (
                  activity.order_items.map((item, index) => (
                    <div key={index} className="mb-2">
                      <span className="text-gray-600">{item.product_name || 'N/A'}</span>
                      <br />
                      <span className="text-gray-400 text-sm">
                        {item.updated_at
                          ? new Date(item.updated_at).toLocaleString()
                          : 'No update info'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No items found</p>
                )}

              </li>
            ))}
          </ul>
        </div>
        )}
        
      </div>
    </div>
  );
};

export default OverView;


