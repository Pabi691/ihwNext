import React from 'react';
import dynamic from 'next/dynamic';
import {
  SliderSkeleton,
  CollectionSkeleton,
  WelcomeSkeleton,
  ServiceSkeleton,
  NonSurgicalSkeleton,
  AchievementsSkeleton,
  BlogSkeleton,
  WhoWeAreSkeleton,
  OurWorksSkeleton,
} from './HomeSkeleton';

/* ── Above the fold — loaded eagerly ─────────────────────────────── */
import PopularReels from './PopularReels';
import BranchAppointmentBanner from '../branches/BranchAppointmentBanner';
import ShopOnlineBanner from '../ShopOnlineBanner';

/* ── Below the fold — code-split, lazy loaded ────────────────────── */
const SingleSlider = dynamic(() => import('../SingleSlider'), {
  ssr: false,
  loading: () => <SliderSkeleton />,
});

const OurCollections = dynamic(() => import('../OurCollections'), {
  ssr: false,
  loading: () => <CollectionSkeleton />,
});

const WelcomeSection = dynamic(() => import('./WelcomeSection'), {
  ssr: false,
  loading: () => <WelcomeSkeleton />,
});

const ProductCategory = dynamic(() => import('./ProductCategory'), {
  ssr: false,
  loading: () => (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse h-7 w-64 bg-gray-200 rounded mx-auto mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-2xl aspect-[3/4]" />
          ))}
        </div>
      </div>
    </section>
  ),
});

const ServiceSlider = dynamic(() => import('../services/ServiceSlider'), {
  ssr: false,
  loading: () => <ServiceSkeleton />,
});

const NonSurgicalHairReplacement = dynamic(
  () => import('./NonSurgicalHairReplacement'),
  { ssr: false, loading: () => <NonSurgicalSkeleton /> }
);

const AchievementsSlider = dynamic(() => import('./AchievementsSlider'), {
  ssr: false,
  loading: () => <AchievementsSkeleton />,
});

const OurWorks = dynamic(() => import('./OurWorks'), {
  ssr: false,
  loading: () => <OurWorksSkeleton />,
});

const BlogSection = dynamic(() => import('./BlogSection'), {
  ssr: false,
  loading: () => <BlogSkeleton />,
});

const WhoWeAre = dynamic(() => import('./WhoWeAre'), {
  ssr: false,
  loading: () => <WhoWeAreSkeleton />,
});

const HomeBody = () => {
  return (
    <>
      {/* ── Above fold (eager) ── */}
      <PopularReels />
      <BranchAppointmentBanner />
      <ShopOnlineBanner />

      {/* ── Below fold (lazy + skeleton) ── */}
      <SingleSlider slug_name="get_slug_data/men-products" title="MEN'S HAIR PRODUCTS" />
      <SingleSlider slug_name="get_slug_data/women-products" title="WOMEN'S HAIR PRODUCTS" />
      <OurCollections title="Womens Collections" limit={2} viewMoreHref="/women" />
      <WelcomeSection />
      <ProductCategory
        title={
          <>
            SHOP FROM <span className="text-[#04A9FF]">OUR COLLECTION</span>
          </>
        }
      />
      <ServiceSlider />
      <NonSurgicalHairReplacement />
      <AchievementsSlider />
      <OurWorks />
      <BlogSection />
      <WhoWeAre />
    </>
  );
};

export default HomeBody;
