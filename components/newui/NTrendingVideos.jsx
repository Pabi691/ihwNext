import React, { useRef, useState } from "react";
import Link from "next/link";
import { FaPlay, FaInstagram, FaArrowRight } from "react-icons/fa6";

const reels = [
  { videoFile: "/videos/men-reel-4.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/model-hair-patch-black.jpg", productName: "Model Hair Patch – Black", price: 9999, salePrice: 6999, productUrl: "/product/model-hair-patch-black" },
  { videoFile: "/videos/men-reel-1.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/0.3-mm-hair-patch-black-2.jpg", productName: "0.3 Mm Hair Patch – Black", price: 39999, salePrice: 26999, productUrl: "/product/03-mm-hair-patch-black" },
  { videoFile: "/videos/men-reel-2.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/hairline-patch-with-net-base-%E2%80%93-100-percent-natural-human-hair.jpg", productName: "Hairline Patch – Natural Human Hair", price: 12999, salePrice: 6999, productUrl: "/product/hairline-patch-with-net-base-100-natural-human-hair" },
  { videoFile: "/videos/men-reel-3.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/curly-hair-patch-with-mono-base-%E2%80%93-brown.jpg", productName: "Curly Hair Patch – Brown", price: 14999, salePrice: 10999, productUrl: "/product/curly-hair-patch-with-mono-base-brown" },
  { videoFile: "/videos/women-reel-1.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/teal-blue-colors-strands-%E2%80%93-clip-in-hair-2.jpg", productName: "Teal Blue Strands – Clip In Hair", price: 1499, salePrice: 899, productUrl: "/product/teal-blue-colors-strands-clip-in-hair" },
  { videoFile: "/videos/women-reel-2.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/clip-in-bangs-%E2%80%93-100-percent-natural-human-hair.jpg", productName: "Clip-In Bangs – Natural Human Hair", price: 2999, salePrice: 1499, productUrl: "/product/clip-in-bangs-100-percent-natural-human-hair" },
  { videoFile: "/videos/women-reel-3.mp4", thumbnail: "https://cdn.indianhairworld.com/product-images/mirage-hair-topper-ladies-black-1.jpg", productName: "Mirage Hair Topper – Ladies Black", price: 14999, salePrice: 10999, productUrl: "/product/mirage-hair-topper-ladies-black" },
];

function ReelCard({ reel }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const discount = Math.round(((reel.price - reel.salePrice) / reel.price) * 100);

  return (
    <div className="group flex-shrink-0 w-[200px] md:w-[220px]">
      {/* Video / Thumbnail */}
      <div className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-gray-900 mb-3 shadow-md">
        {playing ? (
          <video
            ref={videoRef}
            src={reel.videoFile}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            loop
            onClick={() => { videoRef.current?.pause(); setPlaying(false); }}
          />
        ) : (
          <>
            <img
              src={reel.thumbnail}
              alt={reel.productName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={e => { e.currentTarget.src = "/images/noimage.jpg"; }}
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button
                onClick={handlePlay}
                className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
              >
                <FaPlay className="w-5 h-5 text-gray-900 ml-1" />
              </button>
            </div>
            {/* Discount badge */}
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </div>
            {/* Instagram badge */}
            <div className="absolute top-2 right-2 bg-gradient-to-br from-purple-500 to-pink-500 p-1.5 rounded-full">
              <FaInstagram className="w-3 h-3 text-white" />
            </div>
          </>
        )}
      </div>

      {/* Product info */}
      <Link href={reel.productUrl} className="flex items-start gap-2 group/info">
        <img
          src={reel.thumbnail}
          alt={reel.productName}
          className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
          onError={e => { e.currentTarget.src = "/images/noimage.jpg"; }}
        />
        <div className="min-w-0">
          <h3 className="text-gray-900 text-xs font-bold leading-tight line-clamp-2 mb-1 group-hover/info:text-[#04A9FF] transition-colors">
            {reel.productName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[#04A9FF] font-black text-sm">₹{reel.salePrice.toLocaleString("en-IN")}</span>
            <span className="text-gray-400 text-xs line-through">₹{reel.price.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function NTrendingVideos() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="text-[#04A9FF] text-xs font-bold uppercase tracking-widest">Social Proof</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-1">
              Trending <span className="text-[#04A9FF]">Videos</span>
            </h2>
            <p className="text-gray-500 text-sm mt-2">Real results, real people. Tap to watch.</p>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-[#04A9FF] font-bold text-sm hover:gap-3 transition-all">
            View All Products <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-4 lg:grid-cols-7 md:overflow-visible">
          {reels.map((reel, i) => <ReelCard key={i} reel={reel} />)}
        </div>
      </div>
    </section>
  );
}
