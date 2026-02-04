import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from '@/components/compat/router';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import confetti from 'canvas-confetti';

import Breadcrumb from '../Breadcrumb';
import RecentlyViewed from '../RecentlyViewed';
import YouAlsoLike from '../YouAlsoLike';
import DeliveryEstimate from '../DeliveryEstimate';
import ProductDetailsAccordian from '../ProductDetailsAccordian';
import ReviewRatingComments from '../ReviewRatingComments';
import { useGlobal } from '../../global/GlobalContext';

import {
  ProductGallery,
  ProductInfo,
  ProductVariants,
  AddToCartActions,
  ProductHighlights,
  ProductMeta,
  SizeChartModal,
  NotifySizeModal
} from './';

function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { wishlist, setWishlist, addToCart, token } = useGlobal();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [sizeChart, setSizeChart] = useState(false);
  const [openSizeChart, setOpenSizeChart] = useState(false);

  const [unAvailableSize, setUnAvailableSize] = useState(false);
  const [selectedUnAvailableSize, setSelectedUnAvailableSize] = useState(null);

  const [productVariations, setProductVariations] = useState([]);
  const [colorVariations, setColorVariations] = useState([]);
  const [productReviews, setProductReviews] = useState([]);
  const [keyHighlights, setKeyHighlights] = useState([]);
  const [likedProductsTag, setLikedProductsTag] = useState(null);

  const [addSuccess, setAddSuccess] = useState(false);
  const [addedProductName, setAddedProductName] = useState('');

  const fetchProductDetails = useCallback(async () => {
    if (!token) return;

    const viewed = JSON.parse(sessionStorage.getItem('recentlyViewedProducts')) || [];
    const cached = viewed.find(p => p.slug === slug);

    if (cached) {
      setProduct(cached);
      setSelectedImage(cached.primary_img);
      setKeyHighlights(cached.product_key_highlights || []);
      setColorVariations(cached.color_details || []);
      setProductVariations(cached.product_variations || []);
      setProductReviews(cached.product_ratings || []);
      setLikedProductsTag(cached.product_tag);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_slug_data/${slug}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status) {
        const p = res.data.product_details;
        setProduct(p);
        setSelectedImage(p.primary_img);
        setKeyHighlights(p.product_key_highlights || []);
        setColorVariations(p.color_details || []);
        setProductVariations(p.product_variations || []);
        setProductReviews(p.product_ratings || []);
        setLikedProductsTag(p.product_tag);

        sessionStorage.setItem(
          'recentlyViewedProducts',
          JSON.stringify([...viewed, p])
        );
      }
    } finally {
      setLoading(false);
    }
  }, [slug, token]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

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

  const handleAddToCart = (product) =>
    new Promise((resolve) => {
      if ((!selectedSize || selectedSize === 'null') && productVariations.length) {
        setOpenSizeChart(true);
        resolve(false);
        return;
      }

      addToCart(product, selectedSize);
      setAddedProductName(`${product.prod_name} added to your cart!`);
      setAddSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      resolve(true);
    });

  if (loading) return <Skeleton height={700} />;

  return (
    <>
      <ProductMeta product={product} />

      <Breadcrumb category="shop" productName={product.prod_name} />

      <SizeChartModal
        open={sizeChart}
        onClose={() => setSizeChart(false)}
        image={product?.size_chart_details?.chart_image}
      />

      <div className="single-product-page max-w-7xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row gap-6">
          <ProductGallery
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          <div className="flex-1 overflow-y-scroll">
            <ProductInfo product={product} reviews={productReviews} />

            <ProductVariants
              product={product}
              productVariations={productVariations}
              colorVariations={colorVariations}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              openSizeChart={openSizeChart}
              setOpenSizeChart={setOpenSizeChart}
              setSizeChart={setSizeChart}
            />

            <NotifySizeModal
              open={unAvailableSize}
              setOpen={setUnAvailableSize}
              variations={productVariations}
              selected={selectedUnAvailableSize}
              setSelected={setSelectedUnAvailableSize}
            />

            <AddToCartActions
              product={product}
              addSuccess={addSuccess}
              addedProductName={addedProductName}
              onAdd={() => handleAddToCart(product)}
              onBuy={async () => {
                const ok = await handleAddToCart(product);
                if (ok) navigate('/checkout');
              }}
              wishlist={wishlist}
              setWishlist={setWishlist}
            />

            <DeliveryEstimate />

            <ProductHighlights highlights={keyHighlights} />

            <ProductDetailsAccordian productdetails={product.prod_desc} />

            <ReviewRatingComments
                  reviews={productReviews}
                  ratingBreakdown={ratingBreakdown}
                  totalRatings={productReviews.length}
                  overallRating={overallRating}
                />
          </div>
        </div>

        {likedProductsTag && <YouAlsoLike likedProductsTag={likedProductsTag} />}
        {!loading && <RecentlyViewed />}
      </div>
    </>
  );
}

export default ProductDetailsPage;


