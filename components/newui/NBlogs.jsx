import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ENV } from "@/config/env";
import { FaArrowRight, FaClock } from "react-icons/fa6";

function BlogCard({ blog }) {
  const tag = (blog.tags || "Hair Care").split(",")[0].trim();
  const date = blog.created_at
    ? new Date(blog.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "";

  return (
    <Link href={`/blog/${blog.slug}`} className="group block h-full">
      <article className="h-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
          {blog.featured_image ? (
            <img
              src={blog.featured_image}
              alt={blog.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--rb-primary)]/10 to-[var(--rb-dark)]/5 flex items-center justify-center">
              <span className="text-5xl font-black text-[var(--rb-heading)]/20">IHW</span>
            </div>
          )}
          <span className="absolute top-3 left-3 bg-[var(--rb-primary)] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {tag}
          </span>
          {blog.read_time && (
            <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
              <FaClock className="w-2.5 h-2.5" /> {blog.read_time} min
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-5">
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-[var(--rb-heading)] transition-colors mb-2">
            {blog.title}
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 flex-1 mb-4">
            {blog.short_description}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-primary-hover)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(blog.author || "I").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-gray-700 text-xs font-semibold">{blog.author || "IHW Team"}</p>
                {date && <p className="text-gray-400 text-[10px]">{date}</p>}
              </div>
            </div>
            <span className="text-[var(--rb-heading)] text-xs font-bold group-hover:gap-2 flex items-center gap-1 transition-all">
              Read <FaArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function SkeletonBlog() {
  return (
    <div className="rounded-3xl overflow-hidden border border-gray-100 bg-white">
      <div className="h-52 bg-gray-100 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse" />
        <div className="h-3 bg-gray-100 rounded w-3/5 animate-pulse" />
      </div>
    </div>
  );
}

export default function NBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${ENV.API_URL}/api/v1/blogs`)
      .then(r => r.json())
      .then(d => setBlogs((d?.data || []).slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-10">
          <div>
            <span className="text-[var(--rb-heading)] text-xs font-bold uppercase tracking-widest">Insights</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-1">
              Hair Care <span className="text-[var(--rb-heading)]">Tips &amp; Articles</span>
            </h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-[var(--rb-heading)] font-bold text-sm hover:gap-3 transition-all">
            View All Articles <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonBlog key={i} />)
            : blogs.slice(0, 4).map((b, i) => <BlogCard key={b.id || i} blog={b} />)}
        </div>
      </div>
    </section>
  );
}
