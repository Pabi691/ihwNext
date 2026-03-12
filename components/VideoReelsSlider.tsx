'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Mousewheel, Virtual } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

export interface ReelItem {
    reelId: string;
    videoUrl: string;
    productUrl: string;
    thumbnail: string;
    productName: string;
    price: number;
    salePrice: number;
    videoFile?: string;     // .mp4 URL — when provided, enables autoplay+sound
}

interface Props {
    reels: ReelItem[];
    viewMoreLink: string;
    sectionTitle?: string;
    sectionTitleHighlight?: string;
}

export default function VideoReelsSlider({
    reels,
    viewMoreLink,
    sectionTitle = 'POPULAR',
    sectionTitleHighlight = 'PRODUCTS',
}: Props) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const swiperRef = useRef<SwiperType | null>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const modalSwiperRef = useRef<SwiperType | null>(null);
    const modalVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    // ── Modal controls ──
    const openModal = (index: number) => {
        setActiveIndex(index);
        setIsMuted(false);
        setIsPaused(false);
        videoRefs.current.forEach(v => v?.pause());
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalVideoRefs.current.forEach(v => v?.pause());
        setActiveIndex(null);
        document.body.style.overflow = '';
        videoRefs.current.forEach(v => {
            if (v) { v.muted = true; v.play().catch(() => { }); }
        });
    };

    const navigateReel = (dir: 'prev' | 'next') => {
        if (!modalSwiperRef.current) return;
        if (dir === 'next') modalSwiperRef.current.slideNext();
        else modalSwiperRef.current.slidePrev();
    };

    // ── Keyboard ──
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (activeIndex === null) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowDown') navigateReel('next');
            if (e.key === 'ArrowUp') navigateReel('prev');
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [activeIndex]);

    // ── Autoplay visible carousel videos ──
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target as HTMLVideoElement;
                    if (entry.isIntersecting && activeIndex === null) {
                        video.play().catch(() => { });
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.3 }
        );
        videoRefs.current.forEach(v => { if (v) observer.observe(v); });
        return () => observer.disconnect();
    }, [activeIndex]);

    const toggleMute = () => {
        setIsMuted(prev => {
            const next = !prev;
            if (activeIndex !== null) {
                const activeVideo = modalVideoRefs.current[activeIndex];
                if (activeVideo) activeVideo.muted = next;
            }
            return next;
        });
    };

    const togglePlay = () => {
        if (activeIndex === null) return;
        const activeVideo = modalVideoRefs.current[activeIndex];
        if (!activeVideo) return;
        if (activeVideo.paused) {
            activeVideo.play().catch(() => { });
            setIsPaused(false);
        } else {
            activeVideo.pause();
            setIsPaused(true);
        }
    };

    const getDiscount = (p: number, s: number) => Math.round(((p - s) / p) * 100);
    const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
    const active = activeIndex !== null ? reels[activeIndex] : null;

    useEffect(() => {
  if (activeIndex === null) return;

  const timer = setTimeout(() => {
    modalVideoRefs.current.forEach((video, idx) => {
      if (!video) return;

      if (idx === activeIndex) {
        video.currentTime = 0;
        video.muted = isMuted;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });

    setIsPaused(false);
  }, 120); // wait for DOM mount

  return () => clearTimeout(timer);

}, [activeIndex, isMuted]);

    // useEffect(() => {
    //     if (activeIndex === null) return;
    //     setIsPaused(false);
    //     modalVideoRefs.current.forEach((v, idx) => {
    //         if (!v) return;
    //         if (idx === activeIndex) {
    //             v.muted = isMuted;
    //             v.play().catch(() => { });
    //         } else {
    //             v.pause();
    //         }
    //     });
    // }, [activeIndex, isMuted]);

    return (
        <>
            {/* ── Header ── */}
            <section className="w-full bg-gradient-to-b from-white to-gray-100 py-4 md:py-8 lg:py-16 overflow-hidden">
                <div className="w-[98%] mx-auto">
                    <div className="flex justify-between items-start flex-wrap gap-4 w-[98%]">
                        <div className="text-start mb-2 relative">
                            <h3 className="text-xl mx-6 sm:text-4xl font-bold text-gray-900 inline-block">
                                {sectionTitle}{' '}
                                <span className="outline-text font-semibold">{sectionTitleHighlight}</span>
                            </h3>
                        </div>
                        <p className="text-gray-600 hidden md:block max-w-md text-sm sm:text-base font-montserrat">
                            <Link href={viewMoreLink} className="inline-flex items-center text-black group transition-all duration-300">
                                <span className="relative text-base overflow-hidden">
                                    <span className="relative z-10">View More</span>
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#04a9ff] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Carousel ── */}
            <section className="w-full pb-10 md:pb-16 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
                <div className="relative w-[96%] max-w-[1400px] mx-auto">
                    <Swiper
                        virtual
                        watchSlidesProgress
                        modules={[Navigation, FreeMode, Virtual]}
                        onSwiper={(s) => (swiperRef.current = s)}
                        slidesPerView={2.2}
                        spaceBetween={12}
                        freeMode={{ enabled: true, momentum: true }}
                        breakpoints={{
                            480: { slidesPerView: 2.5, spaceBetween: 14 },
                            640: { slidesPerView: 3.2, spaceBetween: 16 },
                            768: { slidesPerView: 3.5, spaceBetween: 16 },
                            1024: { slidesPerView: 4.5, spaceBetween: 18 },
                            1280: { slidesPerView: 5.2, spaceBetween: 20 },
                        }}
                        className="!pb-2"
                    >
                        {reels.map((reel, index) => (
                            <SwiperSlide key={reel.reelId} virtualIndex={index}>
                                <div className="cursor-pointer group" onClick={() => openModal(index)}>
                                    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900 shadow-md hover:shadow-xl transition-shadow duration-300">

                                        {/* Video (autoplay muted) or Thumbnail fallback */}
                                        {reel.videoFile ? (
                                            // <video
                                            //     ref={el => { videoRefs.current[index] = el; }}
                                            //     src={reel.videoFile}
                                            //     poster={reel.thumbnail}
                                            //     autoPlay muted loop playsInline
                                            //     className="w-full h-full object-cover"
                                            // />
                                            <video
                                                ref={el => { videoRefs.current[index] = el; }}
                                                src={reel.videoFile}
                                                poster={reel.thumbnail}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                preload="metadata"
                                                className="w-full h-full object-cover"
                                                />
                                        ) : (
                                            <img
                                                src={reel.thumbnail}
                                                alt={reel.productName}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        )}

                                        {/* Bottom Gradient */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                                    </div>

                                    {/* Product Info */}
                                    <div className="mt-2.5 px-0.5">
                                        <p className="text-sm text-gray-800 font-medium truncate leading-tight">{reel.productName}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-sm font-bold text-gray-900">{fmt(reel.salePrice)}</span>
                                            {reel.price !== reel.salePrice && (
                                                <>
                                                    <span className="text-xs text-gray-400 line-through">{fmt(reel.price)}</span>
                                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                                        {getDiscount(reel.price, reel.salePrice)}% off
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Nav */}
                    <button onClick={() => swiperRef.current?.slidePrev()} className="absolute top-[35%] -translate-y-1/2 -left-1 md:left-0 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all" aria-label="Previous">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => swiperRef.current?.slideNext()} className="absolute top-[35%] -translate-y-1/2 -right-1 md:right-0 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all" aria-label="Next">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </section>

            {/* ── Modal ── */}
            <AnimatePresence>
                {active && activeIndex !== null && (
                    <motion.div
                        className="fixed inset-0 z-[9999] flex items-center justify-center"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="absolute inset-0 bg-black/90" onClick={closeModal} />

                        <button onClick={closeModal} className="absolute top-3 right-3 md:top-5 md:right-5 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition" aria-label="Close">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <motion.div
                            className="relative z-10 w-full max-w-[380px] mx-4"
                            key="modal-reels"
                            initial={{ scale: 0.92, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        >
                            <Swiper
                                direction="vertical"
                                slidesPerView={1}
                                spaceBetween={0}
                                mousewheel={{ forceToAxis: true, sensitivity: 0.7 }}
                                modules={[Mousewheel]}
                                initialSlide={activeIndex}
                                onSwiper={(s) => { modalSwiperRef.current = s; }}
                                onSlideChange={(s) => { setActiveIndex(s.realIndex); }}
                                className="rounded-2xl overflow-hidden bg-black shadow-2xl aspect-[9/16]"
                            >
                                {reels.map((reel, index) => (
                                    <SwiperSlide key={`modal-${reel.reelId}`}>
                                        <div className="w-full h-full relative">
                                            {reel.videoFile ? (
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                                    className="w-full h-full block"
                                                    aria-label={isPaused ? 'Play video' : 'Pause video'}
                                                >
                                                    <video
                                                        ref={el => { modalVideoRefs.current[index] = el; }}
                                                        src={reel.videoFile}
                                                        poster={reel.thumbnail}
                                                        loop
                                                        playsInline
                                                        muted={isMuted}
                                                        preload="metadata"
                                                        className="w-full h-full object-cover"
                                                        />
                                                    {/* <video
                                                        ref={el => { modalVideoRefs.current[index] = el; }}
                                                        src={reel.videoFile}
                                                        poster={reel.thumbnail}
                                                        autoPlay loop playsInline
                                                        muted={isMuted}
                                                        onLoadedData={(e) => {
                                                            e.currentTarget.muted = isMuted;
                                                            e.currentTarget.play().catch(() => { });
                                                        }}
                                                        className="w-full h-full object-cover"
                                                    /> */}
                                                </button>
                                            ) : (
                                                <img src={reel.thumbnail} alt={reel.productName} className="w-full h-full object-cover" />
                                            )}

                                            {/* Instagram link (right side) */}
                                            <a
                                                href={reel.videoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center hover:bg-black/75 transition"
                                                aria-label="Open on Instagram"
                                            >
                                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm10 2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2zm-5 2.8a4.2 4.2 0 110 8.4 4.2 4.2 0 010-8.4zm0 2a2.2 2.2 0 100 4.4 2.2 2.2 0 000-4.4zM17.6 6.3a1 1 0 110 2 1 1 0 010-2z" />
                                                </svg>
                                            </a>

                                            {/* Mute toggle (only with video) */}
                                            {reel.videoFile && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                                                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition"
                                                >
                                                    {isMuted ? (
                                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a10.95 10.95 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
                                                    ) : (
                                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                                                    )}
                                                </button>
                                            )}

                                            {/* Pause/Play indicator */}
                                            {reel.videoFile && isPaused && (
                                                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                                                    <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Product card */}
                                            <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                                                <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-xl flex items-center gap-3">
                                                    <img src={reel.thumbnail} alt={reel.productName} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{reel.productName}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-sm font-bold text-gray-900">{fmt(reel.salePrice)}</span>
                                                            {reel.price !== reel.salePrice && (
                                                                <span className="text-xs text-gray-400 line-through">{fmt(reel.price)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Link href={reel.productUrl} className="bg-[#04a9ff] text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#0390dd] transition whitespace-nowrap shadow-md flex-shrink-0">
                                                        SHOP NOW
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-[15]" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
