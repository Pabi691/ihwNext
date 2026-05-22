import React from 'react';
import SingleSlider from '../SingleSlider';
import ProductCategory from './ProductCategory';
import ShopOnlineBanner from '../ShopOnlineBanner';
import BranchAppointmentBanner from '../branches/BranchAppointmentBanner';
import WelcomeSection from './WelcomeSection';
import WhoWeAre from './WhoWeAre';
import ServiceSlider from '../services/ServiceSlider';
import NonSurgicalHairReplacement from './NonSurgicalHairReplacement';
import AchievementsSlider from './AchievementsSlider';
import OurWorks from './OurWorks';
import PopularReels from './PopularReels';
import OurCollections from '../OurCollections';
import BlogSection from './BlogSection';

const HomeBody = () => {
  return (
    <>
      <PopularReels />
      <BranchAppointmentBanner />
      <ShopOnlineBanner />
      <SingleSlider slug_name="get_slug_data/men-products" title="MEN'S HAIR PRODUCTS" />
      <SingleSlider slug_name="get_slug_data/women-products" title="WOMEN'S HAIR PRODUCTS" />
      <OurCollections title="Womens Collections" />
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
