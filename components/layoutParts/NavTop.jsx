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

const NavTop = () => {
  const { userToken, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { wishlist, cartLength } = useGlobal();

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
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center bg-black md:bg-white">
          {/* Mobile Menu Button */}
          <div className='md:hidden px-2 flex gap-3'>
            <button className="text-white text-lg" onClick={() => setShowMenu(!showMenu)}>
                <svg className='text-[#ef7f1a]' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="#ef7f1a" viewBox="0 0 20 20" stroke="none" style={{height: '20px', width: '20px'}}><g stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" clipPath="url(#icon_hamburger_svg__a)"><path d="M2.917 10.046h10.231M2.917 3.75h14.166M2.917 16.343h14.166"></path></g><defs><clipPath id="icon_hamburger_svg__a"><path fill="#fff" d="M0 0h20v20H0z"></path></clipPath></defs></svg>
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
                  <button onClick={()=> setShowMenu(false)} className='absolute right-2 top-3'>✕</button>
                <div className="flex gap-3 flex-col">
                  {userToken ? (
                    <div className="flex gap-3 flex-col">
                      <div className='flex items-center gap-3'>
                        {localStorage.getItem('username') && (
                          <span className={`text-xl font-semibold w-8 h-8 rounded-full ${themeBgColor} text-[#c7c7c7] uppercase flex justify-center items-center`}>
                            {localStorage.getItem('username')?.charAt(0) }
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
                <p className='font-semibold'>Branches</p>
                <Link onClick={()=> setShowMenu(false)} className='text-xs font-medium' to={'/branch/kolkata'}>- Lake Gardens, Kolkata</Link>
                <Link onClick={()=> setShowMenu(false)} className='text-xs font-medium' to={'/branch/salt-lake'}>- Salt lake, Kolkata</Link>
                <Link onClick={()=> setShowMenu(false)} className='text-xs font-medium' to={'/branch/durgapur'}>- Durgapur, Kolkata</Link>
                <Link onClick={()=> setShowMenu(false)} className='text-xs font-medium' to={'/branch/siliguri'}>- Siliguri, Kolkata</Link>
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


