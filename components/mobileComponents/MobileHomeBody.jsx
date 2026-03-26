import React from 'react';
import AllCatMobile from '@/components/mobileComponents/AllCatMobile';
import BranchAppointmentBanner from '@/components/branches/BranchAppointmentBanner';
import ShopOnlineBanner from '@/components/ShopOnlineBanner';
import WelcomeSection from '@/components/home/WelcomeSection';
import ProductCategory from '@/components/home/ProductCategory';
import AchievementsSlider from '@/components/home/AchievementsSlider';
import NonSurgicalHairReplacement from '@/components/home/NonSurgicalHairReplacement';
import ServiceSlider from '@/components/services/ServiceSlider';
import WhoWeAre from '@/components/home/WhoWeAre';
import SingleSlider from '@/components/SingleSlider';
import PopularReels from '../home/PopularReels';
import OurCollections from '../OurCollections';
import OurWorks from '../home/OurWorks';

const MobileHomeBody = () => {

  return (
    <div>
      <PopularReels />
      <BranchAppointmentBanner />
      <ShopOnlineBanner />
      <OurCollections title="Womens Collections" />
      <WelcomeSection />
      <ProductCategory
        title={
          <>
            SHOP FROM <span className="text-red-500">OUR COLLECTION</span>
          </>
        }
      />

      <SingleSlider slug_name="get_slug_data/men-products" title="MEN’S HAIR PRODUCTS" />
      <SingleSlider slug_name="get_slug_data/women-products" title="WOMEN’S HAIR PRODUCTS" />

      <AchievementsSlider />
      <NonSurgicalHairReplacement />
      <OurWorks />
      <ServiceSlider />
      <WhoWeAre />

      <div className='ms-2 remove_nav'><AllCatMobile slug="men-products" /></div>
      <div className='ms-2 remove_nav'><AllCatMobile slug="women-products" /></div>
    </div>
  )
}

export default MobileHomeBody
