import React from 'react';
import { BiSolidHomeSmile } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa6';
import { Link, useLocation } from '@/components/compat/router';
import { themeTextColor } from '../../styles/typography';
import { ShoppingBagIcon } from '@heroicons/react/20/solid';
import { GoHeartFill } from 'react-icons/go';
import { ShoppingBasketIcon } from 'lucide-react';

const BottomFixedNav = () => {
  const location = useLocation();

  // Define active route styles
  const activeStyle = themeTextColor;
  const defaultStyle = 'text-gray-400';

  return (
    <div className='block md:hidden'>
      <div className='fixed bottom-0 z-50 w-full p-2 bg-white shadow-lg'>
        <div className='flex justify-between items-baseline'>
          <Link className='flex items-center flex-col gap-1 text-gray-500' to={'/'}>
            <BiSolidHomeSmile className={`text-xl ${location.pathname === '/' ? activeStyle : defaultStyle}`} />
            <span className={`text-[10px] font-semibold ${location.pathname === '/' ? themeTextColor : 'text-gray-500'}`}>
              Home
            </span>
          </Link>

          <Link className='flex items-center flex-col gap-1 text-gray-500' to={'/shop'}>
            <ShoppingBasketIcon className={`text-xl ${location.pathname === '/shop' ? activeStyle : defaultStyle}`} />
            <span className={`text-[10px] font-semibold ${location.pathname === '/shop' ? themeTextColor : 'text-gray-500'}`}>
              Shop
            </span>
          </Link>

          <Link className='flex items-center flex-col gap-1 text-gray-500' to={'/cart'}>
            <ShoppingBagIcon className={`text-xl ${location.pathname === '/cart' ? activeStyle : defaultStyle}`} />
            <span className={`text-[10px] font-semibold ${location.pathname === '/cart' ? themeTextColor : 'text-gray-500'}`}>
              cart
            </span>
          </Link>

          <Link className='flex items-center flex-col gap-1 text-gray-500' to={'/myaccount'}>
            <FaUser className={`rounded-full text-xl ${location.pathname === '/myaccount' ? activeStyle : defaultStyle}`} />
            <span className={`text-[10px] font-semibold ${location.pathname === '/myaccount' ? themeTextColor : 'text-gray-500'}`}>
              Profile
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomFixedNav;

