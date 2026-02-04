import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { strokedHeading } from '../../styles/typography';


const achievements = [
    {
        title: 'Times Brand Icons 2024',
        designation: 'Leading Hair Replacement Center of West Bengal 2024',
        description:
            'Indian Hair World (IHW) is thrilled to be recognized as the "Leading Hair Replacement Center of West Bengal 2024" by the prestigious Times Brand Icons!',
    },
    {
        title: 'IEA 2024',
        designation:
            'International Excellence Award 2024 For Best Hair Replacement Center In East Zone',
        description:
            'Indian Hair World has been recognized with the prestigious International Excellence Award 2024 for its exceptional services as the Best Hair Replacement Center in the East Zone.',
    },
    {
        title: 'GFA 2024',
        designation:
            'Global Fame Award 2024 For Best Hair Replacement Center In Kolkata',
        description:
            'Indian Hair World has been honoured with the Global Fame Award 2024 for being the Best Hair Replacement Center in Kolkata, West Bengal.',
    },
    {
        title: 'NPA 2022',
        designation:
            'Nation Pride Award 2022 For Best Hair Replacement Center of West Bengal',
        description:
            'Indian Hair World received the prestigious Nation Pride Award 2022 for being the Best Hair Replacement Center in West Bengal.',
    },
    {
        title: 'BPA 2021',
        designation:
            'Bengal Pride Award 2021 For Best Hair Replacement Center of Kolkata',
        description:
            'Indian Hair World was awarded the prestigious Bengal Pride Award 2021 for its top-notch professional services in Kolkata.',
    },
];

const AchievementsSlider = () => {
    return (
        <section className="bg-gray-200">
            <div className='max-w-7xl mx-auto px-4 py-14'>

                {/* Heading */}
                <h2
                    className={strokedHeading}
                >
                    INDIAN HAIR WORLD ACHIEVEMENTS
                </h2>

                {/* Slider */}
                <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={30}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {achievements.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="group h-full border rounded-sm overflow-hidden transition-all duration-300">
                                <div className="p-6 bg-white group-hover:bg-black transition-colors duration-300 h-full flex flex-col">
                                    <div className="text-sm text-gray-600 group-hover:text-gray-300 mb-2">
                                        {item.designation}
                                    </div>

                                    <h3 className="text-lg font-semibold mb-3 group-hover:text-white">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-gray-700 group-hover:text-gray-300 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default AchievementsSlider;
