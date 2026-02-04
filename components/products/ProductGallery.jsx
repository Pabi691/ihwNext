import React from 'react';
import Slider from 'react-slick';
import Zoom from 'react-medium-image-zoom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import compressImage from '../../utils/compressImage';

function ProductGallery({ product, selectedImage, setSelectedImage }) {
  const mobileSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const images = product
    ? [
        product.primary_img,
        product.secondary_img,
        ...(product.product_image_list || []).map((img) => img.prod_img_url),
      ]
    : [];

  return (
    <>
      {/* Desktop Thumbnails */}
      <div className="md:flex sm:flex-col gap-4 sm:w-1/12 hidden h-[700px] overflow-scroll scrollbar-none">
        {images.map((img, index) => (
          <LazyLoadImage
            key={index}
            src={compressImage(img, 200, 50, 'webp')}
            alt={`thumb-${index}`}
            className={`w-24 h-28 object-cover cursor-pointer ${
              selectedImage === img ? 'scale-110' : 'hover:scale-105'
            }`}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>

      {/* Desktop Main Image */}
      <div className="w-full sm:w-1/2 hidden md:block h-[700px]">
        <Zoom>
          <img
            src={selectedImage}
            alt={product.prod_name}
            className="h-[700px] object-cover cursor-zoom-in"
          />
        </Zoom>
      </div>

      {/* Mobile Slider */}
      <div className="block sm:hidden w-full">
        <Slider {...mobileSettings}>
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`mobile-${index}`}
              className="w-full h-[500px] object-cover"
            />
          ))}
        </Slider>
      </div>
    </>
  );
}

export default ProductGallery;
