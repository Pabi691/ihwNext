import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaWhatsapp, FaPhone, FaVolumeXmark, FaVolumeHigh, FaPlay, FaPause,
  FaCalendarDays, FaCreditCard,
} from "react-icons/fa6";
import { branchData } from "@/content/branchData";

const EASE = [0.22, 1, 0.36, 1];

// Bajaj Finance "Blockbuster EMI Days" runs 28 Sept – 15 Nov. The section
// removes itself after the last day so an expired offer never stays up.
const CAMPAIGN_END = new Date("2026-11-15T23:59:59+05:30").getTime();

const VIDEO_SRC = "/videos/bajaj-promotion.mp4";
const POSTER_SRC = "/videos/bajaj-promotion-poster.jpg";

const store = branchData.kolkata;
const whatsappHref = `https://wa.me/${store.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hi Indian Hair World, I'd like to know about the Bajaj Finance EMI offer."
)}`;

function EmiVideo() {
  const videoRef = useRef(null);
  const userPaused = useRef(false); // a manual pause wins over scroll-autoplay
  const inView = useRef(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    // Respect "reduce motion": show the poster with a play button instead of autoplaying.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      userPaused.current = true;
    }

    // Play while at least half the video is on screen, pause otherwise. The
    // file (preload="none") only downloads once the visitor scrolls here.
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting && !userPaused.current) video.play().catch(() => {});
        else if (!entry.isIntersecting) video.pause();
      },
      { threshold: 0.5 }
    );
    observer.observe(video);

    // Don't keep talking in a background tab; pick up again on return. The
    // observer won't fire for that, since the video never left the screen.
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (inView.current && !userPaused.current) video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const play = () => {
    userPaused.current = false;
    videoRef.current?.play().catch(() => {});
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) play();
    else {
      userPaused.current = true;
      video.pause();
    }
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted && video.paused) play();
  };

  return (
    // Same 16:9 shape as the video, so nothing is cropped: the logos and
    // "T&C applied" sit right at the edges of the frame.
    <div className="relative aspect-video overflow-hidden rounded-2xl md:rounded-3xl bg-black shadow-2xl ring-1 ring-black/5">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        muted
        loop
        playsInline
        preload="none"
        aria-label="Bajaj Finance Blockbuster EMI Days at Indian Hair World, Kolkata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={() => (videoRef.current?.paused ? play() : toggleSound())}
        className="absolute inset-0 h-full w-full cursor-pointer object-contain"
      />

      {!playing && (
        <button
          type="button"
          onClick={play}
          aria-label="Play video"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 md:h-20 md:w-20 items-center justify-center rounded-full bg-white/90 text-[var(--rb-primary)] shadow-xl backdrop-blur transition-transform hover:scale-105"
        >
          <FaPlay className="ml-1 h-5 w-5 md:h-7 md:w-7" />
        </button>
      )}

      {/* Bottom-left is the one corner of the frame with no logo or caption.
          Stacked so the buttons never reach the centred "Indian Hair World" caption. */}
      <div className="absolute bottom-2.5 left-2.5 md:bottom-4 md:left-4 flex flex-col-reverse items-start gap-2">
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Turn sound on" : "Mute"}
          className="inline-flex h-9 md:h-10 items-center gap-2 rounded-full bg-black/60 px-3 text-xs md:text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-black/75"
        >
          {muted ? <FaVolumeXmark className="h-4 w-4" /> : <FaVolumeHigh className="h-4 w-4" />}
          {muted && <span className="hidden sm:inline">Unmute</span>}
        </button>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause video" : "Play video"}
          className="inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/75"
        >
          {playing ? <FaPause className="h-3.5 w-3.5" /> : <FaPlay className="ml-0.5 h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

function EmiPromoSection() {
  return (
    <section className="bg-white py-8 md:py-14" aria-labelledby="emi-promo-heading">
      {/* Mobile: heading, video, then details. Desktop: text left, video right. */}
      <div className="mx-auto grid max-w-7xl gap-5 px-4 md:px-8 lg:grid-cols-[5fr_7fr] lg:gap-x-12 lg:gap-y-6 [grid-template-areas:'head'_'video'_'body'] lg:[grid-template-areas:'head_video'_'body_video']">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="[grid-area:head] lg:self-end"
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--rb-primary)] px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold text-white">
              <FaCreditCard className="h-3 w-3 text-[var(--rb-accent-light)]" /> EMI OFFER
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rb-cream-border)] bg-[var(--rb-cream)] px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-semibold text-[var(--rb-dark)]">
              <FaCalendarDays className="h-3 w-3 text-[var(--rb-heading)]" /> 28 Sept – 15 Nov
            </span>
          </div>
          <h2 id="emi-promo-heading" className="text-2xl md:text-4xl font-black leading-tight text-[var(--rb-dark)]">
            Pay in Easy EMIs with <span className="whitespace-nowrap text-[var(--rb-heading)]">Bajaj Finance</span>
          </h2>
          <span className="mt-3 block h-1 w-12 md:w-16 rounded-full bg-[var(--rb-accent)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="[grid-area:video] lg:self-center"
        >
          <EmiVideo />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
          className="[grid-area:body] lg:self-start"
        >
          <p className="text-sm md:text-base leading-relaxed text-gray-600">
            Blockbuster EMI Days are on at Indian Hair World, Kolkata. Get your hair patch, wig or
            extensions today and pay for it in easy monthly instalments with Bajaj Finance.
          </p>
          <div className="mt-5 flex gap-2.5">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 md:px-5 py-2.5 md:py-3 text-xs md:text-sm font-bold text-white transition-colors hover:bg-emerald-600"
            >
              <FaWhatsapp className="h-4 w-4" /> Ask about EMI
            </a>
            <a
              href={`tel:${store.phones[0]}`}
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-[var(--rb-primary)] px-4 md:px-5 py-2.5 md:py-3 text-xs md:text-sm font-bold text-white transition-colors hover:bg-[var(--rb-primary-hover)]"
            >
              <FaPhone className="h-3.5 w-3.5" /> Call Now
            </a>
          </div>
          <p className="mt-3 text-[11px] text-gray-400">*T&amp;C apply. EMI subject to Bajaj Finance approval.</p>
        </motion.div>
      </div>
    </section>
  );
}

export default function NEmiPromo() {
  if (Date.now() > CAMPAIGN_END) return null;
  return <EmiPromoSection />;
}
