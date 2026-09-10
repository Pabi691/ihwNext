import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { ImageService } from "@/content/image-service";
import { FaPhone, FaWhatsapp, FaRankingStar, FaArrowRight } from "react-icons/fa6";
import { Users, ShieldCheck, BadgeCheck, Headphones, Truck, RefreshCw } from "lucide-react";
import RBGenderNav from "@/components/newui/RBGenderNav";
import { useFestivalTheme } from "./FestivalThemeContext";

const STATS = [
  { icon: Users, value: "100K+", label: "Happy Clients" },
  { icon: ShieldCheck, value: "Non-Surgical", label: "& Safe" },
  { icon: BadgeCheck, value: "Premium", label: "Quality" },
  { icon: Headphones, value: "Expert Support", label: "Always" },
];

const QUICK_TRUST = [
  { icon: Truck, title: "Free Shipping", subtitle: "On orders above ₹999" },
  { icon: ShieldCheck, title: "100% Secure Payment", subtitle: "Safe & encrypted" },
  { icon: RefreshCw, title: "Easy Returns", subtitle: "Hassle free returns" },
  { icon: BadgeCheck, title: "Top Rated", subtitle: "4.9/5 by customers" },
];

// absolute-position style for one CRM-configured rangoli placement
function rangoliStyle({ position = "top-right", size = 40, rotation = 0, opacity = 20 }) {
  const s = { position: "absolute", width: `${size}%`, opacity: (opacity ?? 20) / 100 };
  const OFF = "-4%";
  const tf = [];
  if (position.includes("top")) s.top = OFF;
  if (position.includes("bottom")) s.bottom = OFF;
  if (position === "top-center" || position === "bottom-center") { s.left = "50%"; tf.push("translateX(-50%)"); }
  else if (position === "left-center") { s.left = OFF; s.top = "50%"; tf.push("translateY(-50%)"); }
  else if (position === "right-center") { s.right = OFF; s.top = "50%"; tf.push("translateY(-50%)"); }
  else {
    if (position.includes("left")) s.left = OFF;
    if (position.includes("right")) s.right = OFF;
  }
  if (rotation) tf.push(`rotate(${rotation}deg)`);
  if (tf.length) s.transform = tf.join(" ");
  return s;
}

// Rangoli layer — CRM-configured images at their placements, else two drawn motifs.
function RangoliLayer({ items }) {
  if (items && items.length) {
    return items.map((r, i) => (
      <img key={i} src={r.url} alt="" aria-hidden className="pointer-events-none select-none" style={rangoliStyle(r)} />
    ));
  }
  return (
    <>
      <RangoliMotif className="absolute -right-9 -top-9 w-40 h-40 opacity-20 pointer-events-none" />
      <RangoliMotif className="absolute -left-12 bottom-8 w-32 h-32 opacity-[0.14] pointer-events-none" />
    </>
  );
}

// Decorative rangoli / mandala — tinted with the active festival palette.
function RangoliMotif({ className }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden>
      <g stroke="var(--rb-accent)" strokeWidth="1.4">
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 100 100)`}>
            <path d="M100 18 C 113 44, 113 62, 100 82 C 87 62, 87 44, 100 18 Z" fill="var(--rb-accent)" fillOpacity="0.16" />
            <circle cx="100" cy="24" r="2.6" fill="var(--rb-accent)" />
          </g>
        ))}
        <circle cx="100" cy="100" r="13" />
        <circle cx="100" cy="100" r="6" fill="var(--rb-accent)" />
        <circle cx="100" cy="100" r="28" strokeDasharray="2 5" />
        <circle cx="100" cy="100" r="44" strokeDasharray="1 7" />
      </g>
    </svg>
  );
}

// Cross-fade image stack — one image fades out as the next fades in.
// `fill` = the stack fills its positioned parent (used as the mobile hero bg).
function FestivalFadeImages({ images, alt, fill = false }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setIdx(0);
    if (!images || images.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3200);
    return () => clearInterval(t);
  }, [images]);

  return (
    <div
      className={
        fill
          ? "absolute inset-0 overflow-hidden bg-[var(--rb-dark)]"
          : "relative w-full h-56 rounded-2xl overflow-hidden bg-[var(--rb-dark)]"
      }
    >
      {(images || []).map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === idx ? 1 : 0 }}
          onError={(e) => { e.currentTarget.src = "/images/banner_top.jpg"; }}
        />
      ))}
    </div>
  );
}

export default function NHero() {
  const [bannerImages, setBannerImages] = useState([]);
  const { theme } = useFestivalTheme();
  const { hero } = theme;
  const festivalImages = theme.backgroundImages?.length
    ? theme.backgroundImages
    : [theme.backgroundImage || "/images/bannerIhw.png"];
  // A live festival theme ships its own hero art, and that wins over the
  // standing marketing banners — otherwise activating a theme would leave the
  // old Shark Tank banners on the festival homepage. With no theme art we fall
  // back to the marketing banners, then to the built-in default.
  const festivalSlides = theme.backgroundImages?.length
    ? theme.backgroundImages
    : theme.backgroundImage
    ? [theme.backgroundImage]
    : [];
  const festivalArtActive = theme.active && festivalSlides.length > 0;

  const mobileBanners = festivalArtActive
    ? festivalSlides
    : bannerImages.length
    ? bannerImages.map((b) => b.image_path)
    : festivalImages;

  // A video replaces the slider entirely when the theme supplies one.
  const heroVideo = theme.active && theme.heroMedia === "video" ? theme.heroVideo || "" : "";

  // The standing marketing banners on their own, for the card under the strip.
  const defaultBanners = bannerImages.length
    ? bannerImages.map((b) => b.image_path)
    : ["/images/banner_top.jpg"];

  // Same choice for the desktop swiper, normalised to { src, alt }.
  const desktopSlides = festivalArtActive
    ? festivalSlides.map((src) => ({ src, alt: theme.name || "Festival banner" }))
    : bannerImages.map((b) => ({ src: b.image_path, alt: b.name || "Hair Replacement Banner" }));

  const fetchBanners = useCallback(async () => {
    try {
      const res = await ImageService.getAll();
      const filtered = (res.data?.data || []).filter(img => img.image_type === "banner");
      if (filtered.length) setBannerImages(filtered);
    } catch {}
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const canLoop = desktopSlides.length > 1;

  return (
    <section className="relative w-full flex flex-col overflow-hidden bg-[var(--rb-cream)]">
      {/* ── MAIN HERO (desktop only — untouched) — same max-width/padding
           as the nav bar above, so both line up to the same left/right
           edges. Mobile has its own separate block below. ── */}
      <div className="hidden lg:grid flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 lg:grid-cols-2 lg:items-center">

        {/* LEFT — content */}
        <div className="relative z-10 flex flex-col justify-center pt-16 pb-6 bg-[var(--rb-cream)]">
          {/* Badge → Price box only — CTA buttons and stats below stay
              flush with the nav bar's left edge */}
          <div className="pl-3 sm:pl-6">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 bg-[var(--rb-primary)] text-white text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3">
              <FaRankingStar className="w-3 h-3" />
              India's #1 Non-Surgical Hair Replacement
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl xl:text-[2.75rem] font-extrabold leading-[1.5] text-[var(--rb-dark)] mb-2 max-w-sm">
              Best Hair Patch &amp; Non-Surgical Hair Replacement in{" "}
              <span className="text-[var(--rb-accent)]">Kolkata</span>
            </h1>

            <p className="text-gray-600 text-base md:text-lg mb-4 max-w-md leading-relaxed">
              No Surgery. No Side Effects.
            </p>

            {/* Price + EMI */}
            <div className="flex items-center justify-between gap-4 p-4 bg-transparent border-2 border-[var(--rb-cream-border)] rounded-2xl w-full max-w-sm mb-5">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Starting At</p>
                <p className="text-3xl font-black text-[var(--rb-heading)]">₹5,999<span className="text-base font-bold">/-</span></p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="flex flex-col items-center">
                <p className="text-[10px] text-[var(--rb-accent)] font-bold uppercase tracking-wide mb-1">No Cost EMI Available</p>
                <img src="/images/bajaj.png" alt="Bajaj EMI" className="h-10 object-contain" />
                <span className="text-[10px] font-bold text-gray-400 mt-1">Available</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <a
              href="tel:+917980221032"
              className="inline-flex items-center justify-center gap-3 bg-[var(--rb-primary)] hover:bg-[var(--rb-primary-hover)] text-white font-bold pl-6 pr-2.5 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-[var(--rb-primary)]/30 hover:-translate-y-0.5"
            >
              <FaPhone className="w-8 h-8" />
              Book Free Consultation
              <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center ml-1">
                <FaArrowRight className="w-5 h-5" />
              </span>
            </a>
            <a
              href="https://wa.me/917980221032?text=Hello%20Indian%20Hair%20World%2C%20I%20would%20like%20to%20inquire%20about%20your%20hair%20replacement%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold pl-6 pr-2.5 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5"
            >
              <FaWhatsapp className="w-8 h-8" />
              WhatsApp Us
              <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center ml-1">
                <FaArrowRight className="w-5 h-5" />
              </span>
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-start gap-y-3">
            {STATS.map(({ icon: Icon, value, label }, i) => (
              <div
                key={i}
                className={`flex flex-col items-center text-center gap-1.5 pr-5 sm:pr-8 ${
                  i > 0 ? "border-l border-[var(--rb-cream-border)] pl-5 sm:pl-8" : ""
                }`}
              >
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--rb-heading)]" strokeWidth={2} />
                <p className="text-[10px] sm:text-xs font-black text-gray-900 leading-tight">{value}</p>
                <p className="text-[9px] sm:text-[10px] text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — banner swiper, contained in a padded rounded card
            (not a full-bleed edge-to-edge image) */}
        <div className="hidden lg:flex flex-col justify-center gap-4 py-6 xl:py-10 pl-6 xl:pl-10">
          {/* Desktop media box. A live festival theme uses a short 190px strip;
              with no theme active the original tall card is kept, so the default
              (non-festival) hero is untouched. Mobile has its own height below. */}
          <div
            className={`relative w-full rounded-3xl overflow-hidden shadow-2xl bg-white ${
              theme.active ? "h-[190px]" : "h-[420px] xl:h-[460px]"
            }`}
          >
            {heroVideo ? (
              <video
                key={heroVideo}
                src={heroVideo}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : desktopSlides.length > 0 ? (
              <Swiper
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                loop={canLoop}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                speed={1500}
                slidesPerView={1}
                className="h-full w-full rb-hero-swiper"
              >
                {desktopSlides.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="w-full h-full">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--rb-dark)] to-[var(--rb-primary)]/20 flex items-center justify-center">
                <img src="/images/banner_top.jpg" alt="Hero" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* With a theme live the festival art takes the strip above, so the
              standing marketing banner sits underneath rather than being
              replaced. Heights are picked so the pair still totals roughly the
              420/460px the single card used to occupy. */}
          {theme.active && (
            <div className="relative w-full h-[220px] xl:h-[250px] rounded-3xl overflow-hidden shadow-2xl bg-white">
              <FestivalFadeImages images={defaultBanners} alt="Indian Hair World" fill />
            </div>
          )}
        </div>
      </div>

      {/* Quick trust strip (desktop only — untouched) */}
      <div className="hidden lg:block max-w-7xl mx-auto w-full px-4 md:px-8 pb-8 lg:pb-10">
        <div className="border border-[var(--rb-cream-border)] rounded-2xl px-5 md:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_TRUST.map(({ icon: Icon, title, subtitle }, i) => (
              <div
                key={i}
                className={`w-full flex justify-center ${
                  i > 0 ? "md:border-l md:border-[var(--rb-cream-border)]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-[var(--rb-heading)] flex-shrink-0" strokeWidth={2} />
                  <div className="min-w-0">
                    <p className="text-gray-900 font-bold text-xs md:text-sm leading-tight">{title}</p>
                    <p className="text-gray-400 text-[10px] md:text-xs mt-0.5">{subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE HERO — full-bleed; banner strip on top, content on the gradient below ── */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden bg-gradient-to-br from-[var(--rb-primary-mid2)] via-[var(--rb-primary-mid)] to-[var(--rb-dark)]">

          {/* Men / Women sits at the top of the hero rather than in the header
              bar, so the first thing on the page is the choice of section. */}
          <RBGenderNav />

          {/* hero media. Images sit inset with the same 12px gap and 35px
              radius as the bottom nav, so the two read as one system. A video
              still runs full-bleed — no padding, no rounding — as intended. */}
          {heroVideo ? (
            <div className="relative w-full overflow-hidden bg-[var(--rb-dark)]">
              <video
                key={heroVideo}
                src={heroVideo}
                className="block w-full h-auto"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
          ) : (
            <div className="px-3 pt-3">
              <div className="relative h-[10vh] min-h-[120px] max-h-[200px] w-full rounded-[35px] overflow-hidden">
                <FestivalFadeImages
                  images={mobileBanners}
                  alt={[hero.eyebrow, hero.titleLines.join(" ")].filter(Boolean).join(" ") || "Indian Hair World"}
                  fill
                />
              </div>
            </div>
          )}

          {theme.active && <RangoliLayer items={theme.rangoli} />}

          {/* bottom: content on the gradient — each line only if the CRM field is set */}
          <div className="relative z-10 p-6 pb-8">
            {hero.eyebrow && (
              <p className="text-[var(--rb-accent-light)] text-sm font-medium mb-1 drop-shadow">{hero.eyebrow}</p>
            )}
            {hero.titleLines.length > 0 && (
              <h1 className="text-4xl font-black leading-[1.05] bg-gradient-to-b from-[var(--rb-accent-lighter)] to-[var(--rb-accent)] bg-clip-text text-transparent mb-3 [text-shadow:0_2px_8px_rgba(0,0,0,0.35)]">
                {hero.titleLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </h1>
            )}
            {hero.tagline && (
              <p className="text-white text-base font-medium mb-4 drop-shadow">{hero.tagline}</p>
            )}

            {hero.trustedBy && (
              <div className="inline-flex flex-col bg-white/10 border border-white/20 rounded-xl px-4 py-2 backdrop-blur-sm">
                <span className="text-[var(--rb-accent-light)] text-[9px] font-bold uppercase tracking-wider">Trusted By</span>
                <span className="text-white text-sm font-black">{hero.trustedBy}</span>
              </div>
            )}

            {festivalImages.length > 1 && (
              <div className="flex gap-1.5 mt-4">
                {festivalImages.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full ${i === 0 ? "w-5 bg-[var(--rb-accent-light)]" : "w-1.5 bg-white/30"}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price + EMI — straddles the bottom edge of the blue hero card */}
        <div className="flex items-center justify-between gap-3 bg-white rounded-2xl px-4 py-3 -mt-9 relative z-10 mx-3 shadow-lg border border-[var(--rb-cream-border)]">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Starting At</p>
            <p className="text-2xl font-black text-[var(--rb-heading)]">Rs. 5,999<span className="text-sm font-bold">/-</span></p>
          </div>
          <div className="w-px h-12 bg-gray-100" />
          <div className="flex flex-col items-center">
            <img src="/images/bajaj.png" alt="Bajaj Finserv" className="h-10 object-contain" />
            <span className="text-gray-400 text-[9px] mt-0.5">Available</span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-3 mt-5 mx-3">
          <a
            href="tel:+917980221032"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--rb-primary)] text-white font-bold px-3 py-3 rounded-xl text-sm"
          >
            <FaPhone className="w-4 h-4" /> Book Free Consultation
          </a>
          <a
            href="https://wa.me/917980221032?text=Hello%20Indian%20Hair%20World%2C%20I%20would%20like%20to%20inquire%20about%20your%20Raksha%20Bandhan%20offer."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold px-3 py-3 rounded-xl text-sm"
          >
            <FaWhatsapp className="w-4 h-4" /> WhatsApp Us
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-5 mb-6 mx-3">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-1">
              <span className="w-9 h-9 rounded-full bg-[var(--rb-primary)]/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-[var(--rb-heading)]" strokeWidth={2} />
              </span>
              <p className="text-[10px] font-black text-gray-900 leading-tight">{value}</p>
              <p className="text-[9px] text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
