import React, { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { FaPlay, FaInstagram, FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";

const reels = [
  { videoFile: "/videos/men-reel-4.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/model-hair-patch-black.jpg", productName: "Model Hair Patch – Black", price: 9999, salePrice: 6999, productUrl: "/product/model-hair-patch-black" },
  { videoFile: "/videos/men-reel-1.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/0.3-mm-hair-patch-black-2.jpg", productName: "0.3 Mm Hair Patch – Black", price: 39999, salePrice: 26999, productUrl: "/product/03-mm-hair-patch-black" },
  { videoFile: "/videos/men-reel-2.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/hairline-patch-with-net-base-%E2%80%93-100-percent-natural-human-hair.jpg", productName: "Hairline Patch – Natural Human Hair", price: 12999, salePrice: 6999, productUrl: "/product/hairline-patch-with-net-base-100-natural-human-hair" },
  { videoFile: "/videos/men-reel-3.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/curly-hair-patch-with-mono-base-%E2%80%93-brown.jpg", productName: "Curly Hair Patch – Brown", price: 14999, salePrice: 10999, productUrl: "/product/curly-hair-patch-with-mono-base-brown" },
  { videoFile: "/videos/women-reel-1.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/teal-blue-colors-strands-%E2%80%93-clip-in-hair-2.jpg", productName: "Teal Blue Strands – Clip In Hair", price: 1499, salePrice: 899, productUrl: "/product/teal-blue-colors-strands-clip-in-hair" },
  { videoFile: "/videos/women-reel-2.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/clip-in-bangs-%E2%80%93-100-percent-natural-human-hair.jpg", productName: "Clip-In Bangs – Natural Human Hair", price: 2999, salePrice: 1499, productUrl: "/product/clip-in-bangs-100-percent-natural-human-hair" },
  { videoFile: "/videos/women-reel-3.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/mirage-hair-topper-ladies-black-1.jpg", productName: "Mirage Hair Topper – Ladies Black", price: 14999, salePrice: 10999, productUrl: "/product/mirage-hair-topper-ladies-black" },
];

function ReelCard({ reel, onVideoState }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const discount = Math.round(((reel.price - reel.salePrice) / reel.price) * 100);

  const play = () => { videoRef.current?.play(); setPlaying(true); onVideoState(true); };
  const stop = () => { videoRef.current?.pause(); setPlaying(false); onVideoState(false); };

  return (
    <motion.div
      className="group relative flex-shrink-0 w-[220px] md:w-[248px]"
      whileHover={{ y: -10, rotateZ: -1, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="relative rounded-[22px] overflow-hidden aspect-[9/16] bg-gray-900 shadow-lg ring-1 ring-black/5 transition-shadow duration-300 group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-[var(--rb-accent)]">
        {playing ? (
          <video
            ref={videoRef}
            src={reel.videoFile}
            className="w-full h-full object-cover"
            autoPlay playsInline muted loop
            onClick={stop}
          />
        ) : (
          <>
            <img
              src={reel.thumbnail}
              alt={reel.productName}
              className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
              onError={(e) => { e.currentTarget.src = "/images/noimage.jpg"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />

            {/* play button with pulsing ring */}
            <button onClick={play} aria-label="Play video" className="absolute inset-0 flex items-center justify-center">
              <span className="relative flex items-center justify-center">
                <motion.span
                  className="absolute w-14 h-14 rounded-full bg-white/70"
                  animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
                  <FaPlay className="w-5 h-5 text-gray-900 ml-1" />
                </span>
              </span>
            </button>

            <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              -{discount}%
            </span>
            <span className="absolute top-2.5 right-2.5 bg-gradient-to-br from-purple-500 to-pink-500 p-1.5 rounded-full shadow">
              <FaInstagram className="w-3 h-3 text-white" />
            </span>

            {/* overlaid product info */}
            <Link href={reel.productUrl} className="absolute inset-x-0 bottom-0 p-3">
              <h3 className="text-white text-[13px] font-bold leading-tight line-clamp-2 drop-shadow">
                {reel.productName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white font-black text-sm">₹{reel.salePrice.toLocaleString("en-IN")}</span>
                <span className="text-white/50 text-xs line-through">₹{reel.price.toLocaleString("en-IN")}</span>
              </div>
            </Link>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function NTrendingVideos() {
  const [paused, setPaused] = useState(false);
  const [anyPlaying, setAnyPlaying] = useState(0);
  const onVideoState = useCallback((isPlaying) => {
    setAnyPlaying((n) => Math.max(0, n + (isPlaying ? 1 : -1)));
  }, []);

  const loop = [...reels, ...reels];
  const running = !paused && anyPlaying === 0;

  return (
    <section className="py-8 md:py-12 bg-white overflow-hidden">
      <style>{`@keyframes ihw-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-[var(--rb-primary)] text-xs font-bold uppercase tracking-widest">Social Proof</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-1">
              Trending <span className="text-[var(--rb-primary)]">Videos</span>
            </h2>
            <p className="text-gray-500 text-sm mt-2">Real results, real people. Hover to pause · tap to watch.</p>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-[var(--rb-primary)] font-bold text-sm hover:gap-3 transition-all">
            View All Products <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>

      {/* full-bleed marquee with edge fades */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 z-10 bg-gradient-to-l from-white to-transparent" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex gap-5 w-max px-4 md:px-8 py-3"
          style={{
            animation: "ihw-marquee 55s linear infinite",
            animationPlayState: running ? "running" : "paused",
          }}
        >
          {loop.map((reel, i) => (
            <ReelCard key={i} reel={reel} onVideoState={onVideoState} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
