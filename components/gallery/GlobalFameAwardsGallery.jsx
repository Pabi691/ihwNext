import React from 'react';

const images = [
  {
    src: '/images/ga-img1.jpg',
    alt: 'World Global Fame Awards 2024 Image 1',
  },
  {
    src: '/images/ga-img2.jpg',
    alt: 'World Global Fame Awards 2024 Image 2',
  },
  {
    src: '/images/ga-img7.jpg',
    alt: 'World Global Fame Awards 2024 Image 3',
  },
];

const GlobalFameAwardsGallery = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      
      {/* Heading */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <span className="w-10 h-[1px] bg-black"></span>
        <h2 className="text-3xl font-semibold text-center">
          World Global Fame Awards 2024
        </h2>
        <span className="w-10 h-[1px] bg-black"></span>
      </div>

      {/* Masonry Gallery */}
      <div className="columns-2 md:columns-3 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="block mb-4 overflow-hidden rounded-md"
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GlobalFameAwardsGallery;
