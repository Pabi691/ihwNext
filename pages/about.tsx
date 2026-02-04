import React from 'react';
import MainLayOut from '../layout/MainLayOut';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { DesktopNav } from '../components/Navigation';
import { themeBgColor } from '../styles/typography';
import ServiceSlider from '../components/services/ServiceSlider';

const About = () => {
  return (
    <MainLayOut>
      <DesktopNav />
      <div>
        {/* OUR STORY */}
        <div className='py-16 md:py-24 text-base md:text-lg px-4 md:px-8 lg:px-12 xl:px-20'>
          {/* <h1 className='font-semibold text-3xl md:text-4xl text-gray-800 mb-8'>
            Let's start with <span className='border-b-4 border-black'>Our Story</span>
          </h1> */}

          <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 items-center'>
            <LazyLoadImage alt="our-story" className='w-full rounded-md' src="/images/about1.jpg" />
            <div>
              <p className='text-xl font-semibold mb-2'>what we do</p>
              {/* <h2 className='uppercase font-bold text-lg mb-4'>Welcome to Indian Hair World</h2> */}
              <h1 className='font-semibold text-3xl md:text-4xl text-gray-800 mb-8'>
                Welcome to <span className='border-b-4 border-black'>Indian Hair World</span>
              </h1>
              <p className='leading-relaxed'>
                Indian Hair World was established in 2015 with a vision to help people suffering from baldness in Kolkata. Our founder and main consultant, Soham Chakraborty, along with his brother Sayak, suffered from baldness that caused depression. However, they found a simple solution in hair patch replacement that helped them regain their confidence. Motivated to help others, they opened the first branch of Indian Hair World in Kolkata with their friend and now partner, Sudipto Ghosh.
              </p>
              <p>
                We specialize in providing the best non-surgical hair replacement solutions such as natural wigs, hair wigs, male hair wigs, female hair wigs, etc. under one roof. Our products offer a cost-effective and convenient solution to hair loss. Hair wigs are easy to use and require less time to wear. Our technology enables us to create wigs that look more natural and come in a range of sizes and styles to perfectly fit the personal style of both men and women. At Indian Hair World, we offer the best hair patch price in Kolkata and have hair patch centers all over Kolkata. We also offer hair weaving in Kolkata, the best non-surgical hair transplant, and the best hair weaving cost in Kolkata.
              </p>
            </div>
          </div>
        </div>

        {/* QUOTE SECTION */}
        {/* <div className={`${themeBgColor} text-white text-center px-4 py-24 md:py-32 text-3xl md:text-4xl font-semibold leading-snug`}>
          Restoring Confidence Through <br />
          <strong>Natural-Looking, Non-Surgical Hair Solutions</strong>
        </div> */}

        {/* why us */}
        <div className='py-16 md:py-24 text-base md:text-lg px-4 md:px-8 lg:px-12 xl:px-20'>

          <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 items-center'>
            <div>
              <h2 className='uppercase font-bold text-lg mb-4'>why us</h2>
              <p className='leading-relaxed'>
                Our non-surgical hair replacement solutions are ideal for individuals who are always on the go. We have a massive customer base spread all over West Bengal and offer the best hair patch Kolkata services. If you’re looking for a hair patch center or hair replacement center near you, look no further than Indian Hair World. Our wig shop in Kolkata and hair wig shop in Kolkata offer human hair wigs in Kolkata and the best hair patch in Kolkata. We also provide non-surgical hair transplant near me services and the best non-surgical hair transplant in Kolkata. Our products such as surgical hair and men’s non-surgical hair replacement help restore youthful looks and boost a person’s confidence.
              </p>
              <p>
                Choose Indian Hair World for the best non-surgical hair replacement solutions and non-surgical hair restoration. We are committed to providing our customers with the best hair wigs and non-surgical hair replacement services in Kolkata and beyond.
              </p>
            </div>
            <LazyLoadImage alt="our-story" className='w-full rounded-md' src="/images/about2.jpg" />
          </div>
        </div>

        <ServiceSlider />

        {/* BANNER */}
        {/* <img
          alt='about-banner'
          loading="lazy"
          className='w-full h-[300px] md:h-[450px] object-cover'
          src='images/about1.jpg'
        /> */}

        {/* ABOUT DETAILS */}
        {/* <div className='max-w-screen-xl mx-auto py-20 text-lg md:text-xl px-4 md:px-0 space-y-6'>
          <p>
            We specialize in non-surgical hair replacement solutions including natural wigs, hair patches, male hair wigs, female hair wigs, and hair weaving. Our products are designed to look completely natural, feel comfortable, and fit perfectly according to individual needs.
          </p>
          <p>
            With advanced techniques and premium quality human hair, we ensure long-lasting results that enhance appearance and self-confidence. Our experienced consultants guide each client through a personalized hair restoration journey.
          </p>
        </div> */}

        {/* FOUNDATION MESSAGE */}
        {/* <div className='px-4 md:px-0 max-w-screen-xl mx-auto py-20 text-lg md:text-xl'>
          <p>
            Indian Hair World™ was founded in 2015 with a simple belief — everyone deserves to feel confident about their appearance.<br /><br />
            <span className='text-3xl md:text-4xl font-medium'>
              With the vision of <br />
              <span className='font-bold'>Confidence, Comfort, and Natural Results.</span>
            </span><br /><br />
            That’s what <span className='font-bold'>Indian Hair World™</span> stands for.
            <br /><br />
            <div className='text-4xl md:text-5xl mb-6'>
              Transforming Lives Through <span className='font-semibold'>Non-Surgical Hair Restoration</span>
            </div>
          </p>
        </div> */}

        {/* STATS */}
        {/* <div className='grid md:grid-cols-3 text-center text-3xl md:text-5xl font-medium mb-20 gap-8'>
          <div>
            <span>9+ Years</span><br />
            <span className='text-lg md:text-xl font-normal'>Experience in Hair Replacement</span>
          </div>
          <div>
            <span>10,000+</span><br />
            <span className='text-lg md:text-xl font-normal'>Successful Hair Restorations</span>
          </div>
          <div>
            <span>Multiple</span><br />
            <span className='text-lg md:text-xl font-normal'>Branches Across West Bengal</span>
          </div>
        </div> */}

        {/* UNIQUE SECTION */}
        {/* <div className={`${themeBgColor} text-white px-4 md:px-8 py-16 md:py-24`}>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-10'>Why Choose Indian Hair World?</h2>
          <Swiper
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            className="w-full h-52"
          >
            <SwiperSlide>
              <div className="text-center text-base md:text-lg px-6">
                We provide 100% non-surgical hair replacement solutions with natural appearance.
              </div>
              <div className="text-center font-semibold mt-4">No Surgery, No Pain</div>
              <div className="text-center mt-2">
                Safe, quick, and hassle-free hair restoration without medical procedures.
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="text-center text-base md:text-lg px-6">
                Premium human hair wigs and patches customized to match your style.
              </div>
              <div className="text-center mt-2">
                Affordable pricing with long-lasting results.
              </div>
              <div className="text-center mt-2">
                Trusted by thousands of happy clients across Kolkata and beyond.
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="text-center text-lg p-6">
                Regain your confidence and transform your look with Indian Hair World ✨
              </div>
            </SwiperSlide>
          </Swiper>
        </div> */}
      </div>
    </MainLayOut>
  );
};

export default About;
