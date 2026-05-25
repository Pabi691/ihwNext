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
} from '@/components/home/HomeSkeleton';

/* ── Above the fold — eager ──────────────────────────────────────── */
import PopularReels from '@/components/home/PopularReels';
import BranchAppointmentBanner from '@/components/branches/BranchAppointmentBanner';
import ShopOnlineBanner from '@/components/ShopOnlineBanner';

/* ── Below the fold — code-split ─────────────────────────────────── */
const SingleSlider = dynamic(() => import('@/components/SingleSlider'), {
  ssr: false,
  loading: () => <SliderSkeleton />,
});

const OurCollections = dynamic(() => import('@/components/OurCollections'), {
  ssr: false,
  loading: () => <CollectionSkeleton />,
});

const WelcomeSection = dynamic(() => import('@/components/home/WelcomeSection'), {
  ssr: false,
  loading: () => <WelcomeSkeleton />,
});

const ProductCategory = dynamic(() => import('@/components/home/ProductCategory'), {
  ssr: false,
  loading: () => (
    <section className="py-16 bg-gray-50">
      <div className="px-4 space-y-4">
        <div className="animate-pulse h-7 w-64 bg-gray-200 rounded mx-auto mb-8" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-2xl aspect-[3/4]" />
          ))}
        </div>
      </div>
    </section>
  ),
});

const AchievementsSlider = dynamic(() => import('@/components/home/AchievementsSlider'), {
  ssr: false,
  loading: () => <AchievementsSkeleton />,
});

const NonSurgicalHairReplacement = dynamic(
  () => import('@/components/home/NonSurgicalHairReplacement'),
  { ssr: false, loading: () => <NonSurgicalSkeleton /> }
);

const OurWorks = dynamic(() => import('@/components/home/OurWorks'), {
  ssr: false,
  loading: () => <OurWorksSkeleton />,
});

const ServiceSlider = dynamic(() => import('@/components/services/ServiceSlider'), {
  ssr: false,
  loading: () => <ServiceSkeleton />,
});

const BlogSection = dynamic(() => import('@/components/home/BlogSection'), {
  ssr: false,
  loading: () => <BlogSkeleton />,
});

const WhoWeAre = dynamic(() => import('@/components/home/WhoWeAre'), {
  ssr: false,
  loading: () => <WhoWeAreSkeleton />,
});

const AllCatMobile = dynamic(() => import('@/components/mobileComponents/AllCatMobile'), {
  ssr: false,
  loading: () => null,
});

const MobileHomeBody = () => {
  return (
    <div>
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
      <AchievementsSlider />
      <NonSurgicalHairReplacement />
      <OurWorks />
      <ServiceSlider />
      <BlogSection />
      <WhoWeAre />

      <div className="ms-2 remove_nav">
        <AllCatMobile slug="men-products" />
      </div>
      <div className="ms-2 remove_nav">
        <AllCatMobile slug="women-products" />
      </div>
    </div>
  );
};

export default MobileHomeBody;
