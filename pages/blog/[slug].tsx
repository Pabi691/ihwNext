import React, { useState } from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import MainLayOut from "@/layout/MainLayOut";
import { DesktopNav } from "@/components/Navigation";
import TopBar from "@/components/home/TopBar";
import BlogCard from "@/components/blog/BlogCard";
import { BlogService, getBlogImageUrl } from "@/content/blog-service";

interface Blog {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  content: string;
  featured_image: string | null;
  author: string;
  read_time: number | null;
  tags: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  created_at: string;
}

interface Props {
  blog: Blog;
  relatedBlogs: Blog[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function ShareButton({ label, href, icon }: { label: string; href: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-[#04A9FF] hover:text-[#04A9FF] transition-colors">
      {icon} {label}
    </a>
  );
}

export default function BlogInnerPage({ blog, relatedBlogs }: Props) {
  const [copied, setCopied] = useState(false);
  const imgSrc   = getBlogImageUrl(blog.featured_image);
  const tags     = (blog.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
  const pageUrl  = typeof window !== "undefined" ? window.location.href : `https://www.indianhairworld.com/blog/${blog.slug}`;
  const siteBase = "https://www.indianhairworld.com";

  const metaTitle       = blog.meta_title       || blog.title;
  const metaDescription = blog.meta_description || blog.short_description;
  const metaKeywords    = blog.meta_keywords     || tags.join(", ");
  const ogImage         = imgSrc ? `${siteBase}${blog.featured_image}` : `${siteBase}/images/og-default.jpg`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <Head>
        <title>{metaTitle} | Indian Hair World Blog</title>
        <meta name="description" content={metaDescription} />
        {metaKeywords && <meta name="keywords" content={metaKeywords} />}
        <meta name="author" content={blog.author} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`${siteBase}/blog/${blog.slug}`} />
        <meta property="og:site_name" content="Indian Hair World" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={`${siteBase}/blog/${blog.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": blog.title,
          "description": metaDescription,
          "image": ogImage,
          "author": { "@type": "Person", "name": blog.author },
          "publisher": { "@type": "Organization", "name": "Indian Hair World", "url": siteBase },
          "datePublished": blog.created_at,
          "dateModified": blog.created_at,
          "url": `${siteBase}/blog/${blog.slug}`,
          ...(blog.read_time ? { "timeRequired": `PT${blog.read_time}M` } : {}),
        }) }} />
      </Head>

      <TopBar />
      <MainLayOut>
        <DesktopNav />

        {/* Hero */}
        <section className="relative bg-[#0f1a2c]">
          {imgSrc ? (
            <div className="relative h-[320px] md:h-[500px] overflow-hidden">
              <img src={imgSrc} alt={blog.title} className="w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a2c] via-[#0f1a2c]/60 to-transparent" />
              <div className="absolute inset-0 flex items-end">
                <div className="max-w-4xl mx-auto px-4 md:px-6 pb-10 md:pb-16 w-full">
                  {/* Breadcrumb */}
                  <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
                    <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
                    <span>›</span>
                    <Link href="/blog" className="hover:text-white/80 transition-colors">Blog</Link>
                    <span>›</span>
                    <span className="text-white/70 line-clamp-1">{blog.title}</span>
                  </nav>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-[#04A9FF] text-white text-xs font-bold uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                    {blog.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#04A9FF] to-[#0070cc] flex items-center justify-center text-white text-xs font-bold">
                        {blog.author[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-white/80">{blog.author}</span>
                    </div>
                    <span>·</span>
                    <span>{formatDate(blog.created_at)}</span>
                    {blog.read_time && (
                      <>
                        <span>·</span>
                        <span>{blog.read_time} min read</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 md:py-24">
              <div className="max-w-4xl mx-auto px-4 md:px-6">
                <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
                  <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
                  <span>›</span>
                  <Link href="/blog" className="hover:text-white/80 transition-colors">Blog</Link>
                  <span>›</span>
                  <span className="text-white/70">{blog.title}</span>
                </nav>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-[#04A9FF] text-white text-xs font-bold uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                  {blog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#04A9FF] to-[#0070cc] flex items-center justify-center text-white text-xs font-bold">
                      {blog.author[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-white/80">{blog.author}</span>
                  </div>
                  <span>·</span>
                  <span>{formatDate(blog.created_at)}</span>
                  {blog.read_time && (
                    <>
                      <span>·</span>
                      <span>{blog.read_time} min read</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 lg:gap-16">

            {/* Main content */}
            <article>
              {/* Short description lead */}
              {blog.short_description && (
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed border-l-4 border-[#04A9FF] pl-4 mb-8 italic">
                  {blog.short_description}
                </p>
              )}

              {/* Blog body */}
              <div
                className="blog-content text-gray-700 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-500 mr-1">Tags:</span>
                  {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium capitalize hover:bg-[#04A9FF]/10 hover:text-[#04A9FF] transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-700 mb-3">Share this article</p>
                <div className="flex flex-wrap gap-2">
                  <ShareButton
                    label="Facebook"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                    icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>}
                  />
                  <ShareButton
                    label="Twitter"
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(pageUrl)}`}
                    icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>}
                  />
                  <ShareButton
                    label="WhatsApp"
                    href={`https://wa.me/?text=${encodeURIComponent(blog.title + " " + pageUrl)}`}
                    icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>}
                  />
                  <button onClick={handleCopy}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-[#04A9FF] hover:text-[#04A9FF] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              {/* Author card */}
              <div className="mt-10 p-6 bg-gradient-to-br from-[#0f1a2c] to-[#1a2940] rounded-2xl flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#04A9FF] to-[#0070cc] flex items-center justify-center text-white text-xl font-black flex-shrink-0 shadow-lg shadow-[#04A9FF]/30">
                  {blog.author[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#04A9FF] mb-1">Written by</p>
                  <p className="text-white font-bold text-lg">{blog.author}</p>
                  <p className="text-white/60 text-sm mt-1">Indian Hair World — Hair Specialist & Consultant</p>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* CTA */}
              <div className="bg-gradient-to-br from-[#04A9FF] to-[#0070cc] rounded-2xl p-6 text-center shadow-lg shadow-[#04A9FF]/20">
                <p className="text-white font-extrabold text-lg leading-tight mb-2">Ready for a Hair Transformation?</p>
                <p className="text-white/80 text-sm mb-4">Book a free consultation at your nearest branch.</p>
                <a href="/contact-us"
                  className="block w-full py-2.5 bg-white text-[#04A9FF] text-sm font-bold rounded-xl hover:bg-white/90 transition-colors">
                  Book Free Consultation
                </a>
              </div>

              {/* Related posts */}
              {relatedBlogs.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Related Articles</h3>
                  <div className="space-y-3">
                    {relatedBlogs.map((rb) => (
                      <Link key={rb.id} href={`/blog/${rb.slug}`}
                        className="group flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                        {rb.featured_image ? (
                          <img src={getBlogImageUrl(rb.featured_image) || ""} alt={rb.title}
                            className="w-16 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-[#04A9FF]/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-[#04A9FF] text-xs font-black">IHW</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-[#04A9FF] transition-colors leading-snug">
                            {rb.title}
                          </p>
                          {rb.read_time && (
                            <p className="text-xs text-gray-400 mt-1">{rb.read_time} min read</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to blog */}
              <Link href="/blog"
                className="flex items-center gap-2 text-sm font-semibold text-[#04A9FF] hover:underline">
                ← Back to all articles
              </Link>
            </aside>
          </div>
        </div>
      </MainLayOut>

      {/* Blog content typography styles */}
      <style jsx global>{`
        .blog-content h1 { font-size: 2rem; font-weight: 800; color: #111827; margin: 2rem 0 1rem; line-height: 1.25; }
        .blog-content h2 { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 1.75rem 0 0.75rem; line-height: 1.3; }
        .blog-content h3 { font-size: 1.25rem; font-weight: 700; color: #1f2937; margin: 1.5rem 0 0.5rem; }
        .blog-content h4 { font-size: 1.1rem; font-weight: 600; color: #374151; margin: 1.25rem 0 0.5rem; }
        .blog-content p  { margin-bottom: 1.25rem; line-height: 1.8; color: #4b5563; }
        .blog-content ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .blog-content ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .blog-content li { margin-bottom: 0.5rem; line-height: 1.7; color: #4b5563; }
        .blog-content a  { color: #04A9FF; text-decoration: underline; text-underline-offset: 2px; font-weight: 500; }
        .blog-content a:hover { color: #0070cc; }
        .blog-content strong { font-weight: 700; color: #111827; }
        .blog-content em { font-style: italic; }
        .blog-content blockquote {
          border-left: 4px solid #04A9FF; padding: 0.75rem 1.25rem;
          background: #f0faff; margin: 1.5rem 0; border-radius: 0 0.5rem 0.5rem 0;
          font-style: italic; color: #374151;
        }
        .blog-content code {
          background: #f3f4f6; padding: 0.15rem 0.45rem; border-radius: 0.35rem;
          font-size: 0.875rem; font-family: monospace; color: #be185d;
        }
        .blog-content pre {
          background: #1e293b; color: #e2e8f0; padding: 1.25rem; border-radius: 0.75rem;
          overflow-x: auto; margin: 1.5rem 0; font-size: 0.875rem;
        }
        .blog-content img {
          width: 100%; border-radius: 0.75rem; margin: 1.5rem 0;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .blog-content hr { border: none; border-top: 2px solid #f3f4f6; margin: 2rem 0; }
        .blog-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
        .blog-content th { background: #04A9FF; color: white; padding: 0.75rem 1rem; text-align: left; font-weight: 600; }
        .blog-content td { padding: 0.75rem 1rem; border-bottom: 1px solid #f3f4f6; color: #4b5563; }
        .blog-content tr:hover td { background: #f9fafb; }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  if (!slug) return { notFound: true };

  const [blog, allBlogs] = await Promise.all([
    BlogService.getBySlug(slug as string),
    BlogService.getAll(),
  ]);

  if (!blog) return { notFound: true };

  const relatedBlogs = allBlogs
    .filter((b: any) => b.slug !== slug)
    .slice(0, 3);

  return { props: { blog, relatedBlogs } };
};
