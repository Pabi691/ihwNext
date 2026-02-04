import React from 'react';

const SkincareBanner = () => {
  return (
    <div className=''>
      <div className="item px-1 md:p-0">
        <div className="flex flex-col justify-end relative h-[330px] md:h-auto rounded-lg">
          <img
            className="w-full absolute h-full md:h-[300px] object-cover top-0 left-0 rounded-lg md:hidden"
            src={`${""}/images/mobile/skincareBanner.png`}
            alt='skincare'
          />
          <img
            className="hidden md:block h-[400px] object-cover object-center rounded-lg"
            src={`${""}/images/skincareBannerpc.png`}
            alt='skincare'
          />
          
        </div>
      </div>
    </div>
  );
};

export default SkincareBanner;

