import React from 'react';
import AllCatMobile from '@/components/mobileComponents/AllCatMobile';
import BottomFixedNav from '@/components/mobileComponents/BottomFixedNav';
import BranchAppointmentBanner from '@/components/branches/BranchAppointmentBanner';
import ShopOnlineBanner from '@/components/ShopOnlineBanner';
import WelcomeSection from '@/components/home/WelcomeSection';
import ProductCategory from '@/components/home/ProductCategory';
import AchievementsSlider from '@/components/home/AchievementsSlider';
import NonSurgicalHairReplacement from '@/components/home/NonSurgicalHairReplacement';
import ServiceSlider from '@/components/services/ServiceSlider';
import WhoWeAre from '@/components/home/WhoWeAre';
import SingleSlider from '@/components/SingleSlider';

const MobileHomeBody = () => {
  
  return (
    <div>

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

      <AchievementsSlider />
      <NonSurgicalHairReplacement />
      <ServiceSlider />
      <WhoWeAre />

      <div className='ms-2 remove_nav'><AllCatMobile slug="men" /></div>
      <div className='ms-2 remove_nav'><AllCatMobile slug="women" /></div>

      
      <div>
        <BottomFixedNav />
      </div>

    </div>
  )
}

export default MobileHomeBody
