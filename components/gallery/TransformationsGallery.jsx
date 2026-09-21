import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { fetchPublicSettings } from '@/utils/publicSettings';

import 'swiper/css';

// The original four photos, shown while the CRM list (admin → Transformations)
// is empty. Keep in sync with DEFAULT_TRANSFORMATIONS in
// admin/pages/transformations.jsx.
const DEFAULT_IMAGES = [
  { url: '/images/our-work-img4.jpg', alt: 'Hair Weaving Services in Kolkata' },
  { url: '/images/our-work-img2.jpg', alt: 'Best Hair Replacement Service Kolkata' },
  { url: '/images/our-work-img1.jpg', alt: 'Hair Weaving Services in Salt Lake' },
  { url: '/images/our-work-img3.jpg', alt: 'Best Hair Patch Service in Kolkata' },
];

const MOBILE_TEASER_COUNT = 4;  // homepage + branch pages, mobile: 2×2 grid
const DESKTOP_TEASER_COUNT = 8; // homepage + branch pages, tablet and up: slider

function parseImages(raw) {
  try {
    const list = typeof raw === 'string' ? JSON.parse(raw || '[]') : raw;
    return Array.isArray(list)
      ? list.filter((img) => img && typeof img.url === 'string' && img.url.trim())
      : [];
  } catch {
    return [];
  }
}

const Tile = ({ img }) => (
  <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
    <img
      src={img.url}
      alt={img.alt || 'Hair transformation before and after'}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
    />
  </div>
);

const placeholders = (n) =>
  Array.from({ length: n }, (_, i) => (
    <div key={i} className="aspect-square rounded-md bg-gray-100 animate-pulse" />
  ));

// variant="teaser" (homepage, branch pages): the latest few + a link to the gallery.
// variant="full" (gallery page): every photo, in a grid.
const TransformationsGallery = ({ variant = 'teaser' }) => {
  const [images, setImages] = useState(null); // null until the CRM list loads

  useEffect(() => {
    let cancelled = false;
    fetchPublicSettings()
      .then((settings) => {
        if (!cancelled) setImages(parseImages(settings?.transformation_gallery));
      })
      .catch(() => {
        if (!cancelled) setImages([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loading = images === null;
  const list = images && images.length ? images : DEFAULT_IMAGES;

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">

      {/* Heading */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <span className="w-10 h-[1px] bg-black"></span>
        <h2 className="text-3xl font-semibold text-center">
          Transformations
        </h2>
        <span className="w-10 h-[1px] bg-black"></span>
      </div>

      {variant === 'full' ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-[30px]">
          {loading ? placeholders(8) : list.map((img, i) => <Tile key={i} img={img} />)}
        </div>
      ) : (
        <>
          {/* Mobile: the latest four in a 2×2 grid */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {loading
              ? placeholders(MOBILE_TEASER_COUNT)
              : list.slice(0, MOBILE_TEASER_COUNT).map((img, i) => <Tile key={i} img={img} />)}
          </div>

          {/* Tablet and up: slider */}
          <div className="hidden md:block">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-[30px]">{placeholders(4)}</div>
            ) : (
              <Swiper
                modules={[Autoplay]}
                spaceBetween={30}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{
                  0: { slidesPerView: 2 },
                  1024: { slidesPerView: 4 },
                }}
              >
                {list.slice(0, DESKTOP_TEASER_COUNT).map((img, i) => (
                  <SwiperSlide key={i}>
                    <Tile img={img} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/our-gallery"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--site-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--site-primary-hover)]"
            >
              View all transformations
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default TransformationsGallery;
