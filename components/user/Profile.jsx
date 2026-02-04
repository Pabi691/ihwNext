import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from '@/components/compat/router';
import MainLayOut from '../../layout/MainLayOut';
import { useAuth } from './AuthContext';
import ShippingAddress from './ShippingAddress';
import Myorders from './MyOrders';
import OrderDetails from './OrderDetails';
import MyProfile from './MyProfile';
import OverView from './OverView';
import BottomFixedNav from '../mobileComponents/BottomFixedNav';
import { Icon } from '@iconify/react';

/**
 * @param {{ orderId?: any, section?: string | null }} props
 */
const Profile = ({ orderId = null, section = null }) => {
  const { logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const navigate = useNavigate();
  const location = useLocation();

  // Use useMemo to store the object and prevent recreation on every render
  const pathToMenu = useMemo(() => ({
    '/myaccount': 'Overview',
    '/myaccount/orders': 'My Orders',
    '/myaccount/order': 'Order Details',
    '/myaccount/payments': 'My Payments',
    '/myaccount/wallet': 'My Wallet',
    '/myaccount/addresses': 'My Addresses',
    '/myaccount/profile': 'My Profile',
    '/logout': 'Logout',
  }), []);

  useEffect(() => {
    if (section) {
      setActiveMenu(section);
      return;
    }
    const menu = pathToMenu[location.pathname];
    if (menu) {
      setActiveMenu(menu);
    }
  }, [location.pathname, pathToMenu, section]); // Now, pathToMenu is stable

  const renderContent = () => {
    switch (activeMenu) {
      case 'Overview':
        return <OverView />;
      case 'My Orders':
        return <Myorders />;
      case 'Order Details':
        return <OrderDetails orderId={orderId} />;        
      case 'My Addresses':
        return <ShippingAddress />;
      case 'My Profile':
        return <MyProfile />;
      case 'Logout':
        logout();
        break;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <MainLayOut>
      <div className='md:py-12 py-8'>
        <div className='max-w-screen-2xl mx-auto px-0 sm:px-6 lg:px-8'>
          <div className="flex gap-4">
            {/* Sidebar */}
            <div className="w-1/4 border h-fit rounded-lg p-6 hidden md:block">
              {/* <h2 className="text-2xl font-semibold mb-4">My Account</h2> */}
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
                    className={`p-2 border-b ${menu.color ?? menu.color}  font-medium cursor-pointer hover:text-black ${
                      activeMenu === menu.label ? 'text-black' : 'text-gray-400'
                    }`}
                    onClick={() => {
                      setActiveMenu(menu.label);
                      navigate(menu.path);
                    }}
                  >
                    <div className="flex items-center gap-2">
                        <Icon icon={menu.icon} width={20} height={20} /> {menu.label}
                    </div>
                   
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* <h3 className="text-sm md:text-base mb-4">{activeMenu}</h3> */}
              <div className="rounded-lg">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fixed navigation */}
      <BottomFixedNav />
    </MainLayOut>
  );
};

export default Profile;

