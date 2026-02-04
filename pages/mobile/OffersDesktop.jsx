import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useMediaQuery } from 'react-responsive';
import { Autoplay, Navigation } from 'swiper/modules';

const reels = [
  "/videos/vd_1.mp4",
  "/videos/vd_2.mp4",
  "/videos/vd_3.mp4",
];

const OffersDesktop = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const videoRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isMobile) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, idx) => {
            const video = videoRefs.current[idx];
            if (entry.isIntersecting) {
              setActiveIndex(idx);
              video?.play();
            } else {
              video?.pause();
            }
          });
        },
        { threshold: 0.75 }
      );

      videoRefs.current.forEach((el) => {
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, [isMobile]);

  const handleMuteToggle = (index) => {
    videoRefs.current.forEach((video, idx) => {
      if (video) video.muted = idx !== index;
    });
  };

  return (
      <div className="w-full">
        {isMobile ? (
          <div className="flex flex-col items-center gap-4">
            {reels.map((url, idx) => (
              <video
                key={idx}
                ref={(el) => (videoRefs.current[idx] = el)}
                src={url}
                className="w-full h-[500px] rounded-md"
                muted={activeIndex !== idx}
                controls
                onPlay={() => handleMuteToggle(idx)}
                playsInline
              />
            ))}
          </div>
        ) : (
          <Swiper
            navigation
            spaceBetween={10}
            breakpoints={{
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            onSlideChange={(swiper) => handleMuteToggle(swiper.activeIndex)}
            modules={[Navigation, Autoplay]}
          >
            {reels.map((url, idx) => (
              <SwiperSlide key={idx}>
                <video
                  ref={(el) => (videoRefs.current[idx] = el)}
                  src={url}
                  className="w-full h-[500px] rounded-md"
                  muted={idx !== activeIndex}
                  controls
                  onPlay={() => handleMuteToggle(idx)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
  );
};

export default OffersDesktop;
