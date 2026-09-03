import React from "react";
import Link from "next/link";
import { getBlogImageUrl } from "@/content/blog-service";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getTags(tagsStr) {
  if (!tagsStr) return [];
  return tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
}

export default function BlogCard({ blog, featured = false }) {
  if (!blog) return null;

  const imgSrc = getBlogImageUrl(blog.featured_image);
  const tags   = getTags(blog.tags);
  const firstTag = tags[0] || "Hair Care";

  if (featured) {
    // Large featured card (used for the first post in the listing grid)
    return (
      <Link href={`/blog/${blog.slug}`} className="group block h-full">
        <article className="relative h-[420px] md:h-[480px] rounded-2xl overflow-hidden shadow-lg bg-gray-900">
          {imgSrc ? (
            <img src={imgSrc} alt={blog.title} loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--site-primary-rgb)_/_0.2)] to-[var(--site-dark)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <span className="inline-block px-3 py-1 rounded-full bg-[var(--site-primary)] text-white text-xs font-bold uppercase tracking-wider mb-3">
              {firstTag}
            </span>
            <h2 className="text-white text-xl md:text-2xl font-extrabold leading-tight mb-2 line-clamp-2 group-hover:text-[var(--site-primary)] transition-colors">
              {blog.title}
            </h2>
            <p className="text-white/70 text-sm line-clamp-2 mb-4 hidden md:block">{blog.short_description}</p>
            <div className="flex items-center gap-3 text-xs text-white/60">
              <span className="font-medium text-white/80">{blog.author}</span>
              <span>·</span>
              <span>{formatDate(blog.created_at)}</span>
              {blog.read_time && <><span>·</span><span>{blog.read_time} min read</span></>}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Standard card
  return (
    <Link href={`/blog/${blog.slug}`} className="group block h-full">
      <article className="h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
        {/* Image */}
        <div className="relative h-48 md:h-52 overflow-hidden bg-gray-100 flex-shrink-0">
          {imgSrc ? (
            <img src={imgSrc} alt={blog.title} loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[rgb(var(--site-primary-rgb)_/_0.1)] to-[rgb(var(--site-dark-rgb)_/_0.05)] flex items-center justify-center">
              <span className="text-5xl font-black text-[rgb(var(--site-primary-rgb)_/_0.2)]">IHW</span>
            </div>
          )}
          {/* Tag badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[var(--site-primary)] text-white text-[11px] font-bold uppercase tracking-wide">
            {firstTag}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-5">
          <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-[var(--site-primary)] transition-colors mb-2">
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
            {blog.read_time && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg whitespace-nowrap">
                {blog.read_time} min read
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
