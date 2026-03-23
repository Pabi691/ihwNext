import React, { useEffect, useState } from 'react';
import { Link } from '@/components/compat/router';
import { FaRegHeart, FaBagShopping, FaUser, FaTruckFast } from 'react-icons/fa6';
import NavMenus from './NavMenus';
import { useAuth } from '../user/AuthContext';
import { useGlobal } from '../../global/GlobalContext';
import HeaderSearchBar from '../HeaderSearchBar';
import { Heart, User2Icon, UserRound } from 'lucide-react';
import { BiExit } from 'react-icons/bi';
import { GoPackageDependents } from "react-icons/go";
import MetaData from '../../layout/MetaData';
import { themeBgColor } from '../../styles/typography';
import { branchData } from '@/content/branchData';
import { useParams } from 'next/navigation';

const NavTop = () => {
  const { userToken, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { wishlist, cartLength } = useGlobal();
  const params = useParams();
  const branch = params?.branch;
  const branchDetails = branch ? branchData[branch] : null;

  // const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showMenu]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* <MetaData /> */}
      <header className="z-50 w-full sticky top-0">
        {branchDetails && (
          <div className="flex md:hidden justify-between items-center bg-gray-700">

            {/* Call Button */}
            <a
              href={`tel:${branchDetails.phones[0]}`}
              className="text-[10px] flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold bg-gray-700 transition-all duration-300"
            >
              📞 GET FREE CONSULTATION
            </a>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${branchDetails.phones[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold bg-green-600 animate-pulse transition-all duration-300"
            >
              {/* <span className="text-xs bg-white text-green-700 px-2 py-0.5 rounded-full">
  Recommended
</span> */}
              {/* WhatsApp Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-5 h-5 fill-white"
              >
                <path d="M16.001 3C8.821 3 3 8.822 3 16.002c0 2.82.922 5.44 2.48 7.56L4 29l5.59-1.45A12.94 12.94 0 0016 29c7.18 0 13.001-5.822 13.001-12.998C29.001 8.822 23.18 3 16 3zm0 23.5c-2.22 0-4.28-.64-6.02-1.74l-.43-.27-3.32.86.89-3.24-.28-.44A10.46 10.46 0 015.5 16c0-5.79 4.71-10.5 10.5-10.5S26.5 10.21 26.5 16 21.79 26.5 16 26.5zm5.74-7.84c-.31-.16-1.83-.9-2.11-1.01-.28-.1-.49-.16-.7.16s-.8 1.01-.98 1.22c-.18.21-.36.24-.67.08-.31-.16-1.3-.48-2.47-1.54-.91-.81-1.52-1.81-1.7-2.12-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.02-.55-.08-.16-.7-1.69-.96-2.31-.25-.61-.5-.53-.7-.54l-.6-.01c-.21 0-.55.08-.83.39-.28.31-1.1 1.07-1.1 2.61 0 1.54 1.13 3.03 1.29 3.24.16.21 2.22 3.39 5.38 4.75.75.32 1.34.51 1.8.65.76.24 1.45.21 2 .13.61-.09 1.83-.75 2.09-1.48.26-.73.26-1.36.18-1.48-.08-.11-.28-.18-.59-.34z" />
              </svg>

              CHAT ON WHATSAPP
            </a>

          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center bg-black md:bg-white">
          {/* Mobile Menu Button */}
          <div className='md:hidden px-2 flex gap-3'>
            <button className="text-white text-lg" onClick={() => setShowMenu(!showMenu)}>
              <svg className='text-[#ef7f1a]' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="#ef7f1a" viewBox="0 0 20 20" stroke="none" style={{ height: '20px', width: '20px' }}><g stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" clipPath="url(#icon_hamburger_svg__a)"><path d="M2.917 10.046h10.231M2.917 3.75h14.166M2.917 16.343h14.166"></path></g><defs><clipPath id="icon_hamburger_svg__a"><path fill="#fff" d="M0 0h20v20H0z"></path></clipPath></defs></svg>
            </button>
            <span
              className="text-gray-300 ml-0 md:ml-4 text-lg w-[100px] md:w-[165px] md:h-[25px] overflow-hidden"
              onClick={() => { window.location.href = '/'; }}
            >
              <img
                src={`${"" || ''}/logo-white.png`}
                alt="Logo"
                className="w-full object-cover"
              />
            </span>
          </div>
          {/* Desktop Navbar */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                onClick={() => { window.location.href = '/'; }}
                className="h-16 cursor-pointer hidden md:block"
                src={`${"" || ''}/logo.png`}
                alt="Logo"
              />
            </div>
            {/* <div className="hidden md:block">
              <NavMenus />
            </div> */}
          </div>

          {/* Search Bar */}
          <HeaderSearchBar />

          <div className="flex gap-3 uppercase mr-4 text-white md:text-black">
            <Link to={'/myaccount/orders'} className="text-sm font-semibold">
              <GoPackageDependents />
            </Link>
          </div>

          {/* Icons for User, Wishlist, Cart */}
          <div className="flex items-center gap-5">
            <div className="hidden md:flex">
              {(userToken && (localStorage.getItem('uservarified') && localStorage.getItem('uservarified') !== "null")) ? (
                <div className="items-center gap-3">
                  <div className="relative font-bold text-gray-800 group">
                    <Link to={'/myaccount'}>
                      <FaUser />
                    </Link>
                    <span className="hidden group-hover:block top-full left-0 border bg-white absolute p-2">
                      <Link className="text-black text-sm font-light text-nowrap" to={'/myaccount'}>My Account</Link>
                      <button onClick={logout} className="text-black text-sm font-light">Logout</button>
                    </span>
                  </div>
                </div>
              ) : (
                <Link className='text-sm font-semibold' to="/login">LOGIN / SIGNUP</Link>
              )}
            </div>

            <Link to="/wishlist" className="relative">
              <FaRegHeart className='text-white md:text-black text-lg md:text-base' />
              {wishlistCount > 0 && (
                <span className={`absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-xs text-white ${themeBgColor} rounded-full w-4 h-4 flex items-center justify-center`}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <FaBagShopping className='text-white md:text-black text-lg md:text-base' />
              {cartLength > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-xs text-black border bg-white rounded-full w-4 h-4 flex items-center justify-center">
                  {cartLength}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
      {/* Mobile Menu Items */}
      <div className="mobile_menu md:hidden">
        {showMenu && (
          <div className={`${themeBgColor}/60 absolute top-0 left-0 z-[100] w-full h-screen`}>
            <div className="menu_items relative overflow-y-scroll scrollbar-none">
              <button onClick={() => setShowMenu(false)} className='absolute right-2 top-3'>✕</button>
              <div className="flex gap-3 flex-col">
                {userToken ? (
                  <div className="flex gap-3 flex-col">
                    <div className='flex items-center gap-3'>
                      {localStorage.getItem('username') && (
                        <span className={`text-xl font-semibold w-8 h-8 rounded-full ${themeBgColor} text-[#c7c7c7] uppercase flex justify-center items-center`}>
                          {localStorage.getItem('username')?.charAt(0)}
                        </span>
                      )}

                      <span className="font-medium text-gray-800">
                        Hey <Link to={'/myaccount'}>{localStorage.getItem('username') ? localStorage.getItem('username') : 'User'}</Link>
                      </span>
                    </div>

                  </div>
                ) : (
                  <>
                    <div className='flex items-center gap-2'>
                      <UserRound className='rounded-full border-black border-2' />
                      <Link className='text-sm' to="/login" >
                        <p className='md:hidden text-gray-600'>Hey There!</p>
                        <p className='text-black font-bold'>LOGIN / SIGNUP</p>
                      </Link>
                    </div>
                  </>
                )}
                <p className='font-semibold'>Our Services</p>
                <Link className='text-xs font-medium' to={'/services'}>- Services</Link>
                <p className='font-semibold'>Our Work</p>
                <Link className='text-xs font-medium' to={'/our-gallery'}>- Gallery</Link>
                <Link className='text-xs font-medium' to={'/celebrity'}>- Celebrity</Link>
                <p className='font-semibold'>Branches</p>
                <Link onClick={() => setShowMenu(false)} className='text-xs font-medium' to={'/branch/kolkata'}>- Lake Gardens, Kolkata</Link>
                <Link onClick={() => setShowMenu(false)} className='text-xs font-medium' to={'/branch/salt-lake'}>- Salt Lake, Kolkata</Link>
                <Link onClick={() => setShowMenu(false)} className='text-xs font-medium' to={'/branch/durgapur'}>- Durgapur</Link>
                <Link onClick={() => setShowMenu(false)} className='text-xs font-medium' to={'/branch/siliguri'}>- Siliguri</Link>
                <p className='font-semibold'>Shop In</p>
                <NavMenus />
                {userToken && (
                  <div>
                    <p className='text-gray-600 text-[11px] my-1 font-medium'>MY PROFILE</p>
                    <div className='flex gap-2 flex-wrap'>
                      <Link className='flex gap-2 items-center flex-col' to={'/myaccount'}>
                        <User2Icon className='border rounded-md p-4 w-16 h-16 text-gray-800' />
                        <span className='text-xs text-gray-600 font-medium'>My Account</span>
                      </Link>

                      <Link className='flex gap-2 items-center flex-col' to={'/myaccount/orders'}>
                        <FaTruckFast className='border rounded-md p-4 w-16 h-16 text-gray-800' />
                        <span className='text-xs text-gray-600 font-medium'>My Order</span>
                      </Link>

                      <Link className='flex gap-2 items-center flex-col' to={'/wishlist'}>
                        <Heart className='border rounded-md p-4 w-16 h-16 text-gray-800' />
                        <span className='text-xs text-gray-600 font-medium'>My Wishlist</span>
                      </Link>
                    </div>

                  </div>
                )}
                <p className='text-gray-600 text-[11px] mt-1 font-medium'>CONTACT US</p>
                <Link className='text-xs font-medium' to={'/contact-us'}>Help & Support</Link>
                <p className='text-gray-600 text-[11px] mt-1 font-medium'>ABOUT US</p>
                <Link className='text-xs font-medium' to={'/about'}>Our Story</Link>
                {userToken && (
                  <button
                    onClick={logout}
                    className="text-red-600 font-semibold text-xs bg-red-100 p-2 rounded-md flex items-center justify-start gap-3"
                  >
                    <BiExit />  Logout
                  </button>
                )}
              </div>
            </div>
          </div>

        )}
      </div>
    </>
  );
};

export default NavTop;


