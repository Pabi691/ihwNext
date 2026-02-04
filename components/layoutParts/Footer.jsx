import React from 'react';
import { FaFacebook, FaInstagram, FaPinterest } from 'react-icons/fa';
import { FaLinkedinIn, FaThreads, FaYoutube } from 'react-icons/fa6';
import { Link } from '@/components/compat/router';
import { branchData } from '../../content/branchData';
import useGlobalContent from '../../hooks/useGlobalContent';

const Footer = () => {
  const { globalContentData } = useGlobalContent();

  const links = [
    { labelCompany: 'About Us', pathCompany: '/about', labelService: 'Contact Us', pathService: '/contact-us' },
    { labelService: 'Track Order', pathService: '/myaccount/orders' },
    { labelCompany: 'Terms & Conditions', pathCompany: '/terms-conditions', labelService: 'Return Order', pathService: '/myaccount/orders' },
    { labelCompany: 'Privacy Policy', pathCompany: '/privacy-policy', labelService: 'Cancel Order', pathService: '/myaccount/orders' },
    { labelCompany: 'Return & Exchange Policy', pathCompany: '/return-exchange-policy' },
    { labelCompany: 'Shipping & Delivery', pathCompany: '/shipping-and-delivery' },
  ];


  return (
    <footer className="bg-[#2d2d2d] py-5 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 py-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Branches Section */}
        <div className='lg:col-span-2'>
          <h5 className="text-[#04A9FF] font-bold mb-4 text-base uppercase">
            Branches
          </h5>

          {/* Grid for better balance on desktop */}
          <div className="grid gap-2 md:grid-cols-2 text-sm text-gray-200">
            {Object.entries(branchData).map(([slug, branch]) => (
              <div key={slug} className="space-y-1">
                <h5 className="font-semibold mb-1 text-lg">{branch.name}</h5>
                <p className="font-medium mb-1 text-gray-300">Address: {branch.address}</p>
                {/* Address */}
                {/* {branch.address.split(",").map((line, idx) => (
                  <p key={idx}>{idx === 0 ? "Address: " : ""}{line.trim()}</p>
                ))} */}
                {/* Phones */}
                <div className="mt-1">
                  <p>Phone:</p>
                  {branch.phones.map((phone) => (
                  <p key={phone}>
                    <a
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="hover:underline"
                    >
                      {phone}
                    </a>
                  </p>
                ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Company Section */}
        <div className=''>
          <h5 className="text-[#04A9FF] font-bold mb-3 text-base uppercase">Company</h5>
          <ul className='flex flex-wrap gap-2 md:block'>
            {links.map((item, index) => (
              <li key={index} className="mb-2">
                <Link to={item.pathCompany} className="border-r-2 md:border-none pr-1 md:pr-0 hover:text-gray-400 font-medium">
                  {item.labelCompany}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Customer Service Section */}
        <div>
          <h5 className="text-[#04A9FF] font-bold mb-3 text-base uppercase">Customer Service</h5>
          <ul className='flex flex-wrap gap-2 md:block'>
            {links.map(
              (item, index) => (
                item.labelService && (
                  <li key={index} className="mb-2">
                    <Link to={item.pathService} className="border-r-2 md:border-none pr-1 md:pr-0 hover:text-gray-400 font-medium">
                      {item.labelService}
                    </Link>
                  </li>
                )

              )
            )}
          </ul>
        </div>

        {/* Social Media Section */}
        <div className='ml-0 md:ml-[-25px]'>
          <h5 className="text-[#04A9FF] font-bold mb-3 text-base uppercase">Connect With Us</h5>
          <ul className="flex space-x-6 items-center">
            <li className="flex items-center space-x-2">
              <Link
                to={"https://www.facebook.com/Indianhairworld.services/"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-gray-400"
              >
                <FaFacebook size={24} />
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <Link
                to={"https://www.instagram.com/indianhairworld.service/"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-gray-400"
              >
                <FaInstagram size={24} />
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <Link
                to={"https://www.linkedin.com/in/indian-hair-world-saltlake-627704301/"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-gray-400"
              >
                <FaLinkedinIn size={24} />
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <Link
                to={"https://www.threads.com/@indianhairworld.service"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-gray-400"
              >
                <FaThreads size={24} />
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <Link className="text-sm hover:text-gray-400" rel="noopener noreferrer" target="_blank" to={'https://www.pinterest.com/indianhairworldsaltlake/'}>
                <FaPinterest size={24} />
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <Link className="text-sm hover:text-gray-400" rel="noopener noreferrer" target="_blank" to={'https://www.youtube.com/channel/UC5zfRMVUFshI1PxoxJxW51w'}>
                <FaYoutube size={24} />
              </Link>
            </li>
          </ul>
          <h5 className="text-[#04A9FF] font-bold mb-3 text-base uppercase mt-4">Opening Hours</h5>
          <p className='text-sm'>Monday to Sunday: 11Am - 7Pm</p>
        </div>

      </div>

      <div className="footer_down max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">       
        <hr className='my-3' />

        <div className='flex-col flex justify-center text-sm md:justify-between items-center md:flex-row'>
          <div>
            Copyright © {new Date().getFullYear()} <span className='text-[#04A9FF]'>Indian Hair World</span>
          </div>
          <div>
            Designed & developed by <Link className='text-[#04A9FF]' target='_blank' to='https://kyleinfotech.co.in/'>Kyle Infotech</Link>
          </div>
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{
            __html: globalContentData?.footer || "",
        }}
        />
       
    </footer>
  );
};

export default Footer;

