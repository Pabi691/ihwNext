import React from 'react';
// import ProductSliderHome from '../ProductSliderHome';
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

const HomeBody = () => {
  return (
    <>
      <BranchAppointmentBanner />
      <ShopOnlineBanner />
      <WelcomeSection />
      <ProductCategory
        title={
          <>
            SHOP FROM <span className="text-red-500">OUR COLLECTION</span>
          </>
        }
      />

      <SingleSlider slug_name="get_slug_data/men" title="MEN’S HAIR PRODUCTS" />
      <SingleSlider slug_name="get_slug_data/women" title="WOMEN’S HAIR PRODUCTS" />
      {/* <SingleSlider slug_name="get_active_products" discountPercentage="2" title="deals minimum 2% off" /> */}

      {/* <SingleSlider slug_name="get_active_products" discountPercentage="5" title="Steal Now: 5% and Above" /> */}
      {/* <SingleSlider slug_name="get_slug_data/bucket" price_filter="999" title="bucket under rs 999" /> */}
      {/* <TargetAudience /> */}
      {/* <SingleSlider slug_name="get_slug_data/hanging-planter" price_filter="699" title="HANGING PLANTER Under Rs 699" /> */}

      {/* <SingleSlider slug_name="get_active_products" discountPercentage="10" title="under 10% off" /> */}
      <ServiceSlider />
      <NonSurgicalHairReplacement />
      <AchievementsSlider />
      <OurWorks />
      <WhoWeAre />

    </>
  );
};

export default HomeBody;
