import React, { useEffect, useState, lazy, Suspense } from 'react';
// import Footer from '../components/layoutParts/Footer';
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { Link } from '@/components/compat/router';
import MobileHeader from '../components/layoutParts/mobile/MobileHeader';
import { useGlobal } from '../global/GlobalContext';
import { themeBgColor } from '../styles/typography';

const SimpleLayout = ({ children, title, ProductsCount, link }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { accessoriesCat, menCat, womenCat, loadingCategories } = useGlobal();
  const Footer = lazy(() => import('../components/layoutParts/Footer'));
  const token = localStorage.getItem('userToken');
  const username = localStorage.getItem('username');
  // const useremail = localStorage.getItem('useremail');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <div>
      {/*  */}
      <div className="md:hidden block">
        <MobileHeader ProductsCount={ProductsCount} title={title} link={link} />
      </div>
      <div className="hidden md:flex items-center max-w-7xl mx-auto p-4 justify-between">
        <div className="flex-shrink-0">
          <img
            onClick={() => { window.location.href = '/'; }}
            className="h-16 cursor-pointer md:block"
            src={`${"" || ''}/logo.png`}
            alt="Logo"
          />
        </div>
        <div>
          {token && localStorage.getItem('uservarified') !== 'null' ? (
            <>
              <span className='text-xs font-medium text-gray-600'>Signed In as</span> <br />
              <span className="text-gray-900 font-medium">{username}</span>
            </>
          ) : (
            <>
              <Link to={'/login'}>SIGNIN / SIGNUP</Link>
            </>
          )}
        </div>
      </div>
      <hr />
      <div>
        {children}
      </div>

      <div className="block md:hidden mb-12">
        <div className={`${themeBgColor} p-4 text-white font-medium border-b flex justify-between text-base`} onClick={() => setShowMenu(!showMenu)}>
          <span>More About Indian Hair World</span>
          <span className="text-2xl">
            {showMenu ? <BiChevronUp /> : <BiChevronDown />}
          </span>
        </div>
        <div>
          {showMenu && (
            <Suspense fallback={null}>
              <Footer
                accessoriesCat={accessoriesCat}
                menCat={menCat}
                womenCat={womenCat}
                loading={loadingCategories}
              />
            </Suspense>

          )}
        </div>
      </div>

      <div className="hidden md:block">
        <Suspense fallback={null}>
          <Footer
            accessoriesCat={accessoriesCat}
            menCat={menCat}
            womenCat={womenCat}
            loading={loadingCategories}
          />
        </Suspense>

      </div>
      {/*  */}

    </div>
  )
}

export default SimpleLayout


