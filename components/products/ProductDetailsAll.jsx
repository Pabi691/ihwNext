import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { Link, useNavigate, useParams } from '@/components/compat/router';
import { FaCartPlus } from 'react-icons/fa';
import Breadcrumb from '../Breadcrumb';
import { useGlobal } from '../../global/GlobalContext';
import ProductDetailsAccordian from '../ProductDetailsAccordian';
import YouAlsoLike from '../YouAlsoLike';
import Slider from 'react-slick';
import DeliveryEstimate from '../DeliveryEstimate';
import Zoom from "react-medium-image-zoom";
import Skeleton from 'react-loading-skeleton';
import { LazyLoadImage } from "react-lazy-load-image-component";
import ReviewRatingComments from '../ReviewRatingComments';
import GmbReviewsSection from '../GmbReviewsSection';
import axios from 'axios';
import RecentlyViewed from '../RecentlyViewed';
import { FaBolt } from 'react-icons/fa6';
import WishlistButton from '../WishlistButton';
import confetti from 'canvas-confetti';
// import compressImage from '../../utils/compressImage';
import { hoverScale, themeBgColor, themeBgDark, themeBgGray, themeTextColor } from '../../styles/typography';
import { useGuestCheck } from '../../global/GuestCheckContext';
import HairPatchTryOnSection from '../ai/HairPatchTryOnSection';

const RECENTLY_VIEWED_KEY = 'recentlyViewedProducts:v3';

function ProductDetailsAll() {
  const { slug } = useParams();
  const apiBase = `${process.env.NEXT_PUBLIC_API_URL || "https://server.indianhairworld.com"}/api`;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sizeChart, setSizeChart] = useState(false);
  const [keyHighlights, setKeyHighlights] = useState([]);
  const { wishlist, setWishlist, addToCart, token } = useGlobal();
  const [relatedCategoryId, setRelatedCategoryId] = useState(null);
  const [openSizeChart, setOpenSizeChart] = useState(false);
  // const [unAvailableSize, setUnAvailableSize] = useState(false);
  // const [selectedUnAvailableSize, setSelectedUnAvailableSize] = useState(null);

  const [productVariations, setProductVariations] = useState([]);
  const [colorVariations, setColorVariations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [gmbReviews, setGmbReviews] = useState([]);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");

  const navigate = useNavigate();
  const { requireGuestInfo } = useGuestCheck();

  const fetchProductDetails = useCallback(async () => {
    if (!token) {
      console.warn("Token missing. Aborting fetch.");
      return;
    }

    // Get the array of previously viewed products
    const viewedProducts = JSON.parse(sessionStorage.getItem(RECENTLY_VIEWED_KEY)) || [];

    // Check if the product is already in the list
    const existingProduct = viewedProducts.find((item) => item.slug === slug);

    // console.log('existingProduct', existingProduct);

    if (existingProduct) {
      setProduct(existingProduct);
      setSelectedImage(existingProduct.primary_img);
      setKeyHighlights(existingProduct.product_key_highlights || []);
      setColorVariations(existingProduct.color_details || []);
      setProductVariations(existingProduct.product_variations || []);
      setProductReviews(existingProduct.product_ratings || []);
      setRelatedCategoryId(existingProduct.product_categories?.[0]?.id ?? null);
      return;
    }
    // If not in sessionStorage, fetch from API
    setLoading(true);
    try {
      const response = await axios.get(`${apiBase}/v1/get_slug_data/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      if (data.status) {
        const selectedProduct = data.product_details;
        const variations = selectedProduct?.product_variations || [];
        const variationsColor = selectedProduct?.color_details || [];

        setColorVariations(variationsColor);
        setProductVariations(variations);
        setProductReviews(selectedProduct?.product_ratings);
        setRelatedCategoryId(selectedProduct.product_categories?.[0]?.id ?? null);
        setKeyHighlights(selectedProduct.product_key_highlights);
        setProduct(selectedProduct);
        setSelectedImage(selectedProduct.primary_img);

        // Add to sessionStorage list
        const newViewedProducts = [...viewedProducts, selectedProduct];
        sessionStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(newViewedProducts));
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  }, [slug, token, apiBase]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  useEffect(() => {
    axios.get(`${apiBase}/v1/get_gmb_reviews`)
      .then((res) => setGmbReviews(Array.isArray(res.data?.reviews) ? res.data.reviews : []))
      .catch(() => setGmbReviews([]));
  }, [apiBase]);

  const calculateRatingBreakdown = (reviews) => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const totalReviews = reviews.length;
    if (totalReviews === 0) return breakdown;
    // Count occurrences of each rating
    reviews.forEach(({ rating }) => {
      breakdown[rating] = (breakdown[rating] || 0) + 1;
    });
    // Convert to percentage
    // Object.keys(breakdown).forEach((key) => {
    //   breakdown[key] = (breakdown[key] / totalReviews) * 100;
    // });
    return breakdown;
  };

  const ratingBreakdown = calculateRatingBreakdown(productReviews);

  const overallRating = productReviews.length > 0
    ? (productReviews.reduce((sum, item) => sum + item.rating, 0) / productReviews.length).toFixed(1)
    : 0;

  const handleAddToCart = async (product) => {
    const hasSize = productVariations.some(v => v.size_id !== null);
    if (hasSize && !selectedSize) {
      setOpenSizeChart(true);
      return false;
    }

    const added = await addToCart(product, selectedSize);
    if (!added) return false;

    setAddedProductName(`${product.prod_name} added to your cart!`);
    setAddSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    return true;
  };

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
      ...(product.product_image_list || []).map((imgObj) => imgObj.prod_img_url),
    ]
    : [];

  return (
    <>
      {(!product) ? (
        <>
          <Skeleton
            height={20}
            width={50}
          />
        </>
      ) : (
        <>
          <Breadcrumb
            category="shop"
            productName={product.prod_name}
          />
        </>
      )}

      {sizeChart && (
        <div className={`fixed inset-0 ${themeBgColor} bg-opacity-50 flex items-center justify-center ml-[-30%] z-50`}>
          <div className="bg-white p-2 shadow-lg">
            <div className="flex justify-end gap-4 mr-2 text-lg">
              <button onClick={() => setSizeChart(false)} className="font-semibold">✕</button>
            </div>
            <img alt='chart-img' loading="lazy" className='w-60 md:w-[450px]' src={product.size_chart_details?.chart_image} />
          </div>
        </div>
      )}

      <div className="single-product-page max-w-7xl mx-auto px-0 md:px-8 lg:px-0 pb-12">
        <div className="flex flex-col sm:flex-row items-start gap-6 animate-fadeIn h-auto md:h-[700px]">
          {(!product) ? (
            <Skeleton height={700} width={200} />
          ) : (
            <div className="md:flex sm:flex-col gap-4 sm:w-1/12 w-full hidden h-[700px] overflow-scroll scrollbar-none">
              {images.map((img, index) => (
                <LazyLoadImage
                  key={index}
                  // src={compressImage(img, 200, 50, 'webp')}
                  src={img}
                  alt={`${product.prod_name} thumbnail ${index + 1}`}
                  effect="blur"
                  className={`w-24 h-28 object-cover cursor-pointer transition-transform transform ${selectedImage === img ? "scale-110" : "hover:scale-105"
                    }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}

          {/* single */}
          {(!product) ? (
            <div className="w-full sm:w-1/2 md:block hidden p-4 h-[700px]">
              <Skeleton height="100%" width="100%" />
            </div>
          ) : (
            <div className="w-full sm:w-1/2 md:block hidden h-[700px] overflow-hidden">
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {/* Main Image */}
                <div>
                  <Zoom>
                    <img
                      src={selectedImage}
                      alt={product.prod_name}
                      style={{
                        cursor: "zoom-in",
                        height: '700px',
                        objectFit: 'cover'
                      }}
                    />
                  </Zoom>
                </div>
              </div>
            </div>
          )}

          {/* single */}
          {/* Mobile Slider */}
          <div className="block sm:hidden w-full">
            <Slider {...mobileSettings}>
              {images.map((img, index) => (
                <div key={index}>
                  <img
                    src={img}
                    alt={`${product.prod_name} thumbnail ${index + 1}`}
                    className="w-full h-[500px] object-cover object-top"
                  />
                </div>
              ))}
            </Slider>
          </div>
          {/* Product Information */}
          {
            (!product) ? (
              <Skeleton height={30} width={200} />
            ) : (
              <div className="w-full sm:w-1/2 flex flex-col h-auto md:h-[750px] md:overflow-y-scroll overflow-scroll scrollbar-none px-4 md:px-0">
                <div className='flex items-center justify-between'>
                  <div>
                    <h2 className=" text-black font-semibold text-sm md:text-lg uppercase">{product.prod_name}</h2>
                    <p className=" text-gray-500 text-sm font-normal">©{product.brand_details?.brand_name}</p>
                  </div>
                  {productReviews && (
                    <p className={`${themeTextColor} font-semibold text-sm md:text-base`}><span>{overallRating}</span> | {productReviews.length} Reviews</p>
                  )}
                </div>

                {!selectedSize ? (
                  <div className="flex items-center space-x-4 mt-3">
                    <p className="font-semibold text-lg text-gray-800">
                      ₹ {product.sale_price || product.regular_price}
                    </p>
                    {product.sale_price && (
                      <p className="text-base text-gray-500 line-through">₹ {product.regular_price}</p>
                    )}
                    <p className='text-green-600 font-medium'>
                      {(100 - (product.sale_price / product.regular_price) * 100).toFixed(2)} % OFF
                    </p>
                  </div>
                ) : (
                  <>
                    {Array.isArray(productVariations) && productVariations.length > 0 ? (
                      productVariations
                        .filter((size) => size.id === selectedSize)
                        .map((size) => (
                          <div key={size.size_id} className="flex items-center space-x-4 mt-3">
                            <p className="font-semibold text-lg text-gray-800">
                              ₹ {size.sale_price || size.regular_price}
                            </p>
                            {size.sale_price && (
                              <p className="text-base text-gray-500 line-through">₹ {size.regular_price}</p>
                            )}
                            <p className='text-green-600 font-medium'>
                              {(100 - (size.sale_price / size.regular_price) * 100).toFixed(2)} % OFF
                            </p>
                          </div>
                        ))
                    ) : null}
                  </>
                )}

                <p className='text-gray-500'>Inclusive of all taxes</p>
                <div className='flex gap-2 mt-3'>
                  {(product.product_tag && product.product_tag !== 'null') && (
                    <span className='border px-2 py-1 bg-green-400 text-white font-medium uppercase text-[10px] md:text-xs'>
                      {product.product_tag}
                    </span>
                  )}
                  {(product.product_quality && product.product_quality !== 'null') && (
                    <span className='border px-2 py-1 bg-gray-400 text-white font-medium uppercase text-[10px] md:text-xs'>
                      {product.product_quality}
                    </span>
                  )}
                </div>
                {/* sizes */}
                <div className="product-size-guide bg-white rounded-lg">
                  {/* Color Selection */}
                  {colorVariations.id ? (
                    <div key={colorVariations.id}>
                      <p className="font-medium text-lg text-gray-800 flex gap-2 my-4">
                        Color: {colorVariations.color_name}
                      </p>
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            border: `2px solid ${colorVariations.color_code}`,
                          }}
                          className="p-1 rounded-full inline-block"
                        >
                          <div
                            className="w-8 h-8 rounded-full border-2"
                            style={{ backgroundColor: colorVariations.color_code }}
                          ></div>
                        </div>

                        {productVariations
                          .filter(
                            (variation) =>
                              variation.color !== null && variation.color_page_link !== "null"
                          )
                          .map((variation) => (
                            <React.Fragment key={variation.color_id}>
                              <button
                                className="w-8 h-8 rounded-full border border-[#b7b5b5] inline-block"
                                onClick={() => (window.location.href = variation.color_page_link)}
                                style={{ backgroundColor: variation.color }}
                              ></button>
                            </React.Fragment>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {productVariations.some((variation) => variation.color) && (
                        <p className="my-3">Select Color:</p>
                      )}

                      <div className="flex items-center gap-3">
                        {productVariations
                          .filter(
                            (variation) =>
                              variation.color !== null && variation.color_page_link !== "null"
                          )
                          .map((variation) => (
                            <React.Fragment key={variation.color_id}>
                              <Link
                                className="w-8 h-8 rounded-full border border-[#b7b5b5] inline-block"
                                to={variation.color_page_link}
                                style={{ backgroundColor: variation.color }}
                              ></Link>
                            </React.Fragment>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {productVariations.some((variation) => variation.size_id !== null) ? (
                    <div className={`mt-4 ${openSizeChart && !selectedSize ? 'openPopup' : ''}`}>
                      {openSizeChart && (
                        <button className='block ml-auto' onClick={() => setOpenSizeChart(false)}>
                          ✕
                        </button>
                      )}
                      <div className='flex justify-between items-center mt-10'>
                        <p className="font-medium text-lg text-gray-800 flex gap-2">
                          Select Size
                        </p>
                        {product.size_chart_details && (
                          <button onClick={() => setSizeChart(true)} className={`rounded-md ${themeTextColor} text-sm font-semibold`}>
                            SIZE GUIDE
                          </button>
                        )}
                      </div>
                      <div className="mt-2 flex gap-2">
                        {Array.isArray(productVariations) && productVariations.length > 0 ? (
                          productVariations
                            .filter((size) => size.size !== null)
                            .map((size) => (
                              <div key={size.size_id}>
                                <label
                                  className={`relative border-1 rounded-lg flex items-center justify-center border
                               transition-all duration-200 ease-in-out ${selectedSize === size.id
                                      ? `${themeBgColor} text-white`
                                      : 'border-gray-300'
                                    } ${size.stock_qty === 0 ?
                                      'text-gray-200 border-gray-200 cursor-default' :
                                      size.stock_qty < 5 ?
                                        'text-red-500 border-red-500 cursor-pointer' :
                                        'border-gray-300 cursor-pointer'}`}
                                >
                                  <input
                                    type="radio"
                                    name="size"
                                    value={size.size}
                                    checked={selectedSize === size.id}
                                    onChange={() => {
                                      setSelectedSize(size.id);
                                    }}
                                    className='absolute opacity-0 -z-10'
                                    disabled={size.stock_qty === 0}
                                  />
                                  <div className="flex items-center justify-center text-lg
                                 text-center px-3 py-1 font-medium">
                                    {size.size}
                                  </div>
                                </label>
                                {(size.stock_qty < 5 && size.stock_qty !== 0) && (
                                  <p className='text-red-500'>{size.stock_qty} Left</p>
                                )}
                              </div>
                            ))
                        ) : null}
                      </div>
                    </div>
                  ) : ""}
                </div>

                {/* Add to Cart and Wishlist Button */}
                {(() => {
                  const sizeVars = productVariations.filter(v => v.size_id);
                  const productOutOfStock = sizeVars.length > 0
                    ? sizeVars.every(v => (v.stock_qty ?? 0) <= 0)
                    : (product.stock_qty ?? 0) <= 0;
                  return (
                    <>
                      {productOutOfStock && (
                        <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                          <span className="text-red-500 font-bold text-sm">✕ Out of Stock</span>
                          <span className="text-red-400 text-xs">This product is currently unavailable.</span>
                        </div>
                      )}
                      <div className="flex items-center flex-wrap mt-4">
                        <button
                          disabled={productOutOfStock}
                          onClick={async () => {
                            const canProceed = await requireGuestInfo();
                            if (!canProceed) return;
                            if (addSuccess) {
                              navigate('/cart');
                            } else {
                              handleAddToCart(product);
                            }
                          }}
                          className={`text-white px-6 gap-2 py-3 m-2
        rounded-lg flex items-center text-sm font-semibold ${productOutOfStock ? 'bg-gray-300 cursor-not-allowed opacity-60' : addSuccess ? 'bg-[#2CA003] flex-col w-full' : `${themeBgGray} hover:${themeBgDark} ${hoverScale}`}`}
                        >
                          {addSuccess && addedProductName}
                          {addSuccess && (<hr className='h-1 text-white w-full' />)}
                          {!addSuccess && (<FaCartPlus />)}
                          <div className='flex gap-2 items-center'>
                            <span className={`hidden md:block ${addSuccess && 'text-black'}`}>{addSuccess ? 'Go to Bag' : 'Add to Cart'}</span>
                            {addSuccess && (
                              <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                                <path d="M9.5 3L14.5 8M14.5 8L9.5 13M14.5 8H2.5" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        </button>

                        <button
                          disabled={productOutOfStock}
                          onClick={async () => {
                            const canProceed = await requireGuestInfo();
                            if (!canProceed) return;
                            const success = await handleAddToCart(product);
                            if (success) {
                              setTimeout(() => {
                                navigate('/checkout');
                              }, 800);
                            }
                          }}
                          className={`text-white px-6 gap-2 py-3 m-2 rounded-lg flex items-center text-sm font-semibold ${productOutOfStock ? 'bg-gray-300 cursor-not-allowed opacity-60' : `${themeBgColor} ${hoverScale}`}`}
                        >
                          <FaBolt className="text-yellow-500" />
                          <span>BUY NOW</span>
                        </button>
                        <WishlistButton
                          product={product}
                          wishlist={wishlist}
                          setWishlist={setWishlist}
                          token={token}
                          content
                        />
                      </div>
                    </>
                  );
                })()}

                <div>
                  <DeliveryEstimate />
                </div>

                {/* Trust badges — returnable & COD */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {(product.is_returnable == 1 || product.is_returnable === "1" || product.is_returnable === true) ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs font-semibold">
                      ↩ 15-Day Easy Returns
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-300 bg-red-50 text-red-700 text-xs font-semibold">
                      ⚠ Non-Returnable Item
                    </span>
                  )}
                  {(product.is_cod == 1 || product.is_cod === "1" || product.is_cod === true) && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold">
                      💵 Cash on Delivery Available
                    </span>
                  )}
                  {(product.is_sale == 1 || product.is_sale === "1" || product.is_sale === true) && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs font-bold animate-pulse">
                      🔥 On Sale
                    </span>
                  )}
                </div>

                <a
                  href={`https://wa.me/918910097668?text=Hi%2C%20I%20want%20to%20book%20a%20video%20call`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 px-6 py-3 mt-4 text-white font-semibold rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  📹 Get Perfect Fit – Book Video Call
                </a>
                {/* Product Highlights */}
                {keyHighlights.length > 0 ? (
                  <div className="mt-6">
                    <h2 className="font-medium text-lg mb-2">Key Highlights</h2>
                    <div className='flex gap-2 flex-wrap'>
                      {keyHighlights.map((highlight, index) => (
                        <div key={highlight.id || index} className="flex flex-col gap-1 mb-4 w-[47%]">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-400 text-xs font-medium mb-2">{highlight.label}</p>
                          </div>
                          <p className="text-gray-800 font-medium">{highlight.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                <HairPatchTryOnSection
                  productImage={selectedImage || product.primary_img}
                  productImages={[selectedImage || product.primary_img, ...images].filter(Boolean)}
                  productName={product.prod_name}
                  productTag={product.product_tag}
                  productDescription={product.prod_desc}
                />
                <ProductDetailsAccordian productdetails={product.prod_desc} />
                <img src='../images/icons.jpg' alt='icons' loading="lazy" />
                <GmbReviewsSection reviews={gmbReviews} />
                <ReviewRatingComments
                  reviews={productReviews}
                  ratingBreakdown={ratingBreakdown}
                  totalRatings={productReviews.length}
                  overallRating={overallRating}
                />
              </div>
            )}
        </div>
        <div className='my-4 remove_nav ms-2 md:ms-0'>
          {relatedCategoryId && <YouAlsoLike categoryId={relatedCategoryId} currentProductId={product?.id} />}
        </div>

        <div className='my-4 remove_nav ms-2 md:ms-0'>
          {!loading && (
            <RecentlyViewed />
          )}
        </div>
      </div>
    </>
  );
}

export default ProductDetailsAll;


