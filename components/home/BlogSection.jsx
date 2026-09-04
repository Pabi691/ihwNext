import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function BlogSlideCard({ blog }) {
  const imgSrc = blog.featured_image || null;
  const firstTag = (blog.tags || "Hair Care").split(",")[0].trim();

  return (
    <Link href={`/blog/${blog.slug}`} className="group block h-full">
      <article className="h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={blog.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[rgb(var(--site-primary-rgb)_/_0.1)] to-[rgb(var(--site-dark-rgb)_/_0.05)] flex items-center justify-center">
              <span className="text-5xl font-black text-[rgb(var(--site-primary-rgb)_/_0.2)]">IHW</span>
            </div>
          )}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[var(--site-primary)] text-white text-[11px] font-bold uppercase tracking-wide">
            {firstTag}
          </span>
          {blog.read_time && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-[11px] font-medium backdrop-blur-sm">
              {blog.read_time} min
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-5">
          <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-[var(--site-heading)] transition-colors mb-2">
            {blog.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
            {blog.short_description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--site-primary)] to-[var(--site-primary-hover)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(blog.author || "A")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 leading-none">{blog.author}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(blog.created_at)}</p>
              </div>
            </div>
            <span className="text-xs text-[var(--site-heading)] font-semibold group-hover:underline">
              Read More →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogSection() {
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = (process.env.API_BACKEND_URL || "").replace(/\/+$/, "");
    fetch(`${apiBase}/api/v1/blogs`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        setBlogs(list.slice(0, 8));
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && blogs.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-[var(--site-light)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--site-heading)] mb-3">
              Latest Articles
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-gray-900">
              Hair Care <span className="text-[var(--site-heading)]">Tips & Insights</span>
            </h2>
            <p className="mt-3 text-base text-gray-500 leading-relaxed max-w-lg">
              Expert advice on hair patches, wigs, and non-surgical hair replacement from the Indian Hair World team.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[var(--site-primary)] text-[var(--site-heading)] text-sm font-bold hover:bg-[var(--site-primary)] hover:text-white transition-all duration-200 whitespace-nowrap self-start md:self-auto"
          >
            View All Articles
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Slider */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-52 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            loop={blogs.length > 4}
            autoplay={{ delay: 3500, pauseOnMouseEnter: true, disableOnInteraction: false }}
            spaceBetween={20}
            breakpoints={{
              0:    { slidesPerView: 1 },
              640:  { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="blog-slider"
          >
            {blogs.map((blog) => (
              <SwiperSlide key={blog.id} style={{ height: "auto" }}>
                <BlogSlideCard blog={blog} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <style jsx global>{`
        .blog-slider .swiper-button-next,
        .blog-slider .swiper-button-prev {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
          color: var(--site-primary);
        }
        .blog-slider .swiper-button-next::after,
        .blog-slider .swiper-button-prev::after {
          font-size: 14px;
          font-weight: 900;
        }
        .blog-slider .swiper-button-disabled {
          opacity: 0.3;
        }
        .blog-slider .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
}
