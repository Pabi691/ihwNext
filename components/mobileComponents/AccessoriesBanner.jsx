import React from 'react';

const BannerCards = [
  {
    title: "mobileBanner1",
    imgSrc: `${""}/images/mobile/accessoriesBanner.png`,
    slug: "#",
  }
]

const AccessoriesBanner = () => {

  return (
        <div className=''>
           <div className="item px-1">
              <div className="flex flex-col justify-end relative h-[180px] rounded-lg">
                  <img
                  className="w-full absolute h-full object-cover top-0 left-0 rounded-lg"
                  src={`${""}/images/mobile/accessoriesBanner.png`}
                  alt={BannerCards.title} loading="lazy"
                  />
              </div>
            </div>
        </div>
  );
};

export default AccessoriesBanner;

