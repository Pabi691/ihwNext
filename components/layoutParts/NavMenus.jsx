import React from 'react';
import { Link } from '@/components/compat/router';

function NavMenus() {

  return (
    <>
      <nav className="md:ml-10 ml-0 hidden md:flex items-center space-x-8">
        <div className='group'>
          <Link to="/men" className="text-gray-900 hover:text-black pb-[25px] uppercase">
            Men
          </Link>
        </div>
        <div className='group'>
          <Link to="/women" className="text-gray-900 hover:text-gray-700 pb-[25px] uppercase">
            Women
          </Link>
        </div>       
      </nav>
      <nav className='md:hidden block'>
      <div className='flex flex-col md:hidden'>
            <Link to="/men" className="text-gray-900 hover:text-black mb-1 text-xs capitalize">
              - Men
            </Link>
            <Link to="/women" className="text-gray-900 hover:text-black text-xs capitalize">
              - Women
            </Link>
        </div>
      </nav>
    </>
  )
}

export default NavMenus

