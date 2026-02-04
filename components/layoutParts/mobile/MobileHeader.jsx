import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/components/compat/router';
import { FaRegHeart, FaBagShopping, FaUser } from 'react-icons/fa6';
import { useAuth } from '../../user/AuthContext';
import { useGlobal } from '../../../global/GlobalContext';
import { BiChevronLeft } from 'react-icons/bi';
import { themeBgColor } from '../../../styles/typography';

const MobileHeader = ({ title, ProductsCount, link }) => {
  const { userToken, logout } = useAuth();
  const { cart, wishlist } = useGlobal();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  return (
    <>
      {/* Navbar */}
      <header className="bg-white z-50 w-full sticky top-0 lg:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center">
          {/* mobile start */}
          <div className='flex gap-2 items-center'>
            <button className='text-xl z-40' onClick={() => navigate(-1)}>
              <BiChevronLeft />
            </button>
            <div className='text-xs font-medium flex flex-col gap-1 title_top'>

              {link ? (
                <Link to={link}>
                  {typeof title === 'object' ? title?.title : title}
                </Link>
              ) : (
                typeof title === 'object' ? title?.title : title
              )}
              {ProductsCount && (
                <span className='text-[10px] font-light'>{ProductsCount}</span>
              )}

            </div>
          </div>

          {/* mobile end */}

          <div className="flex items-center gap-5">
            <div className="hidden md:flex">
              {userToken ? (
                <div className="items-center gap-3">
                  <div className="relative font-bold text-gray-800 group">
                    <Link to={'/myaccount'}>
                      <FaUser />
                    </Link>

                    <span className="hidden group-hover:block top-full left-0 border bg-white absolute p-2">
                      <Link className="text-black text-sm font-light text-nowrap" to={'/myaccount'}>My Account</Link>
                      <button
                        onClick={logout}
                        className="text-black text-sm font-light"
                      >
                        Logout
                      </button>
                    </span>
                  </div>
                </div>
              ) : (
                <Link to="/login">LOGIN / SIGNUP</Link>
              )}
            </div>

            <Link to="/wishlist" className="relative">
              <FaRegHeart className='text-black' />
              {wishlistCount > 0 && (
                <span className={`absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-xs text-white ${themeBgColor} rounded-full w-4 h-4 flex items-center justify-center`}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <FaBagShopping className='text-black' />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-xs text-black border bg-white rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

        </div>
      </header>
    </>
  );
};

export default MobileHeader;


