import React, { useState } from 'react';
import { BiNotepad } from 'react-icons/bi';
import { FaExchangeAlt } from 'react-icons/fa';

const ProductDetailsAccordian = ({ productdetails }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="">
      {/* Section 1 */}
      <div className="border-b">
        <div
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200"
          onClick={() => toggleAccordion(0)}
        >
          <h3 className="font-medium text-gray-800 flex gap-2 items-center">
          <BiNotepad />
            <span className='text-xs font-bold'>Product Description</span></h3>
            <p className='text-xs text-gray-400'>Manufacture, Care and Fit</p>
          <span className="text-gray-500 text-xl">{activeIndex === 0 ? '-' : '+'}</span>
        </div>
        {activeIndex === 0 && (
          <div className="p-4 text-gray-600">
            <p className='text-[10px] font-medium'>{productdetails}</p>
          </div>
        )}
      </div>

      {/* Section 2 */}
      <div className="border-b">
        <div
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200"
          onClick={() => toggleAccordion(1)} // Use 1 as the index for this section
        >
          <h3 className="font-medium text-gray-800 flex gap-2 items-center">
            <FaExchangeAlt />
            <span className='text-xs font-bold'>15 Days Returns & Exchange</span></h3>
            <p className='text-xs text-gray-400'>Know about return & exchange policy</p>
          <span className="text-gray-500 text-xl">{activeIndex === 1 ? '-' : '+'}</span>
        </div>
        {activeIndex === 1 && (
          <div className="p-4 text-gray-600">
            <p className='text-[10px]'>
              Easy returns up to 15 days of delivery. Exchange available on selected pincodes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsAccordian;
