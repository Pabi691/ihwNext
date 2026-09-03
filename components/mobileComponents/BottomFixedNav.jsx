import React from 'react';
import { BiSolidHomeSmile } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa6';
import { Link, useLocation } from '@/components/compat/router';
import { ShoppingBagIcon } from '@heroicons/react/20/solid';
import { ShoppingBasketIcon } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', Icon: BiSolidHomeSmile },
  { to: '/shop', label: 'Shop', Icon: ShoppingBasketIcon },
  { to: '/cart', label: 'Cart', Icon: ShoppingBagIcon },
  { to: '/myaccount', label: 'Profile', Icon: FaUser },
];

const BottomFixedNav = () => {
  const location = useLocation();

  return (
    <>
      <div className='block md:hidden'>
        <div className='fixed bottom-0 z-50 w-full bg-[#111827] shadow-[0_-4px_24px_rgba(0,0,0,0.40)]'>
          <div className='flex justify-around items-center px-3 pt-2 pb-4'>
            {navItems.map(({ to, label, Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className='flex flex-col items-center gap-[3px] flex-1 transition-all duration-200'
                >
                  <div
                    className={`relative flex items-center justify-center w-12 h-10 rounded-2xl transition-all duration-200 ${
                      isActive
                        ? 'bg-[#04A9FF] shadow-[0_4px_16px_rgba(4,169,255,0.50)] scale-110'
                        : 'bg-white/5'
                    }`}
                  >
                    <Icon
                      className={`transition-all duration-200 ${
                        isActive
                          ? 'text-white w-[22px] h-[22px] text-[22px]'
                          : 'text-gray-300 w-[20px] h-[20px] text-[20px]'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold tracking-wide transition-all duration-200 ${
                      isActive ? 'text-[#04A9FF]' : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {/* Spacer so page content doesn't hide behind the fixed nav */}
      <div className='block md:hidden h-[82px]' />
    </>
  );
};

export default BottomFixedNav;
