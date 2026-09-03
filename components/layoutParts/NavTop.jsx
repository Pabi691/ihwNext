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
import Chatbot from '../Chatbot';

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
          <div className="md:hidden fixed top-2 left-0 w-full z-[999] px-3 animate-slideDown">
            <div className="flex gap-2">
              {/* Call Button */}
              <a
                href={`tel:${branchDetails.phones[0]}`}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl
        bg-sky-900 text-sky-200 font-semibold text-xs
        shadow-md 
        transition-all duration-300 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.516 2.064a2 2 0 01-.45 1.94l-1.27 1.27a16.001 16.001 0 006.586 6.586l1.27-1.27a2 2 0 011.94-.45l2.064.516A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Free Consultation</span>
              </a>
              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${branchDetails.phones[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl
        bg-[#10251E] text-[#0AA97A] font-semibold text-xs
        shadow-md 
        transition-all duration-300 active:scale-95 relative"
              >

                {/* Badge */}
                {/* <span className="absolute -top-2 right-2 bg-yellow-400 text-black text-[9px] px-2 py-0.5 rounded-full font-bold shadow">
                  2 min reply
                </span> */}

                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  className="w-5 h-5 fill-current"
                >
                  <path d="M19.11 17.39c-.27-.14-1.61-.79-1.86-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.33-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.42.12-.56.13-.13.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.99 2.67 1.13 2.86.14.18 1.95 2.98 4.73 4.18.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.61-.66 1.84-1.29.23-.63.23-1.17.16-1.29-.07-.11-.25-.18-.52-.32z" />
                  <path d="M16.001 3C8.821 3 3 8.822 3 16.002c0 2.82.922 5.44 2.48 7.56L4 29l5.59-1.45A12.94 12.94 0 0016 29c7.18 0 13.001-5.822 13.001-12.998C29.001 8.822 23.18 3 16 3zm0 23.3c-2.26 0-4.37-.66-6.15-1.79l-.44-.26-3.32.86.89-3.23-.29-.47a10.27 10.27 0 01-1.6-5.45c0-5.68 4.62-10.3 10.31-10.3 5.68 0 10.3 4.62 10.3 10.3 0 5.69-4.62 10.31-10.3 10.31z" />
                </svg>

                <span>WhatsApp</span>

                {/* <span className="ml-1 text-[10px] px-2 py-0.5 
        bg-white/20 text-[#0AA97A] 
        rounded-full backdrop-blur-sm relative z-10">
                  Fast⚡
                </span> */}
              </a>
            </div>
          </div>
        )}
        <div className={`max-w-7xl mx-auto px-4 ${branchDetails ? 'pt-[50px]' : 'pt-3'} md:pt-3 pb-3 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center bg-black md:bg-white`}>
          {/* Mobile Menu Button */}
          <div className='md:hidden px-2 flex gap-3'>
            <button className="text-white text-lg" onClick={() => setShowMenu(!showMenu)}>
              <svg className='text-[var(--site-accent)]' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="var(--site-accent)" viewBox="0 0 20 20" stroke="none" style={{ height: '20px', width: '20px' }}><g stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" clipPath="url(#icon_hamburger_svg__a)"><path d="M2.917 10.046h10.231M2.917 3.75h14.166M2.917 16.343h14.166"></path></g><defs><clipPath id="icon_hamburger_svg__a"><path fill="#fff" d="M0 0h20v20H0z"></path></clipPath></defs></svg>
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

          {/* Men / Women Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/men"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl
        bg-sky-900 text-sky-200 font-semibold text-xs
        shadow-md"
            >
              <span>Men</span>
            </Link>
            <Link
              to="/women"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl
        bg-[#10251E] text-[#0AA97A] font-semibold text-xs
        shadow-md relative"
            >
              <span>Women</span>
            </Link>
            <Link
              to="/shop?tryon=1"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl
        bg-[#062033] text-[var(--site-primary)] font-semibold text-xs
        shadow-md"
            >
              <span>✂️</span>
              <span className="whitespace-nowrap">Try It On</span>
            </Link>
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
          <div className={`bg-[rgb(var(--site-primary-rgb)_/_0.6)] absolute top-0 left-0 z-[100] w-full h-screen`}>
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
                        <p className='md:hidden text-gray-900'>Hey There!</p>
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
                <Link className='text-xs font-medium' onClick={() => setShowMenu(false)} to={'/shop'}>- All Products</Link>
                <Link className='text-xs font-medium text-[var(--site-primary)]' onClick={() => setShowMenu(false)} to={'/shop?tryon=1'}>- ✂️ Virtual Hair Try-On</Link>
                <NavMenus />
                {userToken && (
                  <div>
                    <p className='text-gray-900 text-[11px] my-1 font-medium'>MY PROFILE</p>
                    <div className='flex gap-2 flex-wrap'>
                      <Link className='flex gap-2 items-center flex-col' to={'/myaccount'}>
                        <User2Icon className='border rounded-md p-4 w-16 h-16 text-gray-800' />
                        <span className='text-xs text-gray-900 font-medium'>My Account</span>
                      </Link>

                      <Link className='flex gap-2 items-center flex-col' to={'/myaccount/orders'}>
                        <FaTruckFast className='border rounded-md p-4 w-16 h-16 text-gray-800' />
                        <span className='text-xs text-gray-900 font-medium'>My Order</span>
                      </Link>

                      <Link className='flex gap-2 items-center flex-col' to={'/wishlist'}>
                        <Heart className='border rounded-md p-4 w-16 h-16 text-gray-800' />
                        <span className='text-xs text-gray-900 font-medium'>My Wishlist</span>
                      </Link>
                    </div>

                  </div>
                )}
                <p className='text-gray-900 text-[11px] mt-1 font-medium'>CONTACT US</p>
                <Link className='text-xs font-medium' to={'/contact-us'}>Help & Support</Link>
                <p className='text-gray-900 text-[11px] mt-1 font-medium'>ABOUT US</p>
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
      {/* <Chatbot phone="7980221032" /> */}
    </>
  );
};

export default NavTop;


