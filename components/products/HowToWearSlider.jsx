import React, { useState } from "react";

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
  "linear-gradient(135deg, #200122, #6f0000, #200122)",
  "linear-gradient(135deg, #134e5e, #71b280)",
];

// Handles: watch?v=, youtu.be/, embed/, shorts/
function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&\n?#]+)/
  );
  return match ? match[1] : null;
}

function buildEmbedUrl(id, opts = {}) {
  const params = new URLSearchParams({ rel: "0", ...opts });
  return `https://www.youtube.com/embed/${id}?${params}`;
}

function VideoCard({ slide, index, onPlay }) {
  const [hovered, setHovered] = useState(false);

  const videoId = getYouTubeId(slide.video_url);
  const hasVideo = !!videoId;
  const bg = slide.thumbnail_image
    ? null
    : FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];
  const stepNum = String(index + 1).padStart(2, "0");

  const hoverEmbedUrl = videoId
    ? buildEmbedUrl(videoId, {
        autoplay: "1",
        mute: "1",
        loop: "1",
        playlist: videoId,
        controls: "0",
      })
    : null;

  return (
    <div
      className="relative flex-shrink-0 w-40 rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{ height: 230 }}
      onMouseEnter={() => hasVideo && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => hasVideo && onPlay(videoId)}
    >
      {/* Thumbnail — hidden when video is playing */}
      {!hovered && (
        <>
          {slide.thumbnail_image ? (
            <img
              src={slide.thumbnail_image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: bg }} />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col justify-between p-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 bg-white/10 rounded-full px-2 py-0.5 w-fit backdrop-blur-sm">
              {slide.badge_text}
            </span>
            <div>
              <p className="text-3xl font-black text-white/20 leading-none mb-1">
                {stepNum}
              </p>
              <p className="text-white text-xs font-semibold leading-snug">
                {slide.title}
              </p>
              {hasVideo && (
                <div className="mt-2 flex items-center gap-1 text-white/70 text-[10px]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Hover to play
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Muted autoplay iframe on hover — pointer-events:none so click goes to parent */}
      {hovered && hoverEmbedUrl && (
        <>
          <iframe
            src={hoverEmbedUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            title={slide.title}
            style={{ border: "none", pointerEvents: "none" }}
          />
          {/* "Click for sound" hint */}
          <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
            <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full px-2 py-1 flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
              Click for sound
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function YoutubeModal({ videoId, onClose }) {
  const embedUrl = buildEmbedUrl(videoId, { autoplay: "1", rel: "0" });
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="How to wear video"
          style={{ border: "none" }}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function HowToWearSlider({ slides = [] }) {
  const [playId, setPlayId] = useState(null);

  if (!slides || slides.length === 0) return null;

  return (
    <>
      <div className="mt-4 px-1">
        <p className="text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide">
          How to Wear the Patch
        </p>
        <p className="text-[10px] text-gray-400 mb-3">
          Hover to preview · Click for sound
        </p>
        <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
          {slides.map((slide, i) => (
            <VideoCard
              key={slide.id}
              slide={slide}
              index={i}
              onPlay={setPlayId}
            />
          ))}
        </div>
      </div>

      {playId && <YoutubeModal videoId={playId} onClose={() => setPlayId(null)} />}
    </>
  );
}
