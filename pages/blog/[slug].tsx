import React, { useState } from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import MainLayOut from "@/layout/MainLayOut";
import { DesktopNav } from "@/components/Navigation";
import TopBar from "@/components/home/TopBar";
import { getBlogImageUrl } from "@/content/blog-service";
import { BlogService } from "@/content/blog-service.server";

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
        <link rel="canonical" href={`${siteBase}/blog/${blog.slug}`} key="canonical" />
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

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="relative bg-[#0f1a2c] overflow-hidden">
          {imgSrc && (
            <>
              <img src={imgSrc} alt={blog.title}
                className="absolute inset-0 w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a2c] via-[#0f1a2c]/70 to-[#0f1a2c]/30" />
            </>
          )}

          <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-12 pb-14 md:pt-16 md:pb-20">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-white/40 mb-6">
              <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
              <span>›</span>
              <Link href="/blog" className="hover:text-white/70 transition-colors">Blog</Link>
              <span>›</span>
              <span className="text-white/60 line-clamp-1">{blog.title}</span>
            </nav>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {tags.map((tag) => (
                  <span key={tag}
                    className="px-3 py-1 rounded-full bg-[#04A9FF]/20 text-[#04A9FF] border border-[#04A9FF]/30 text-xs font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6 max-w-4xl">
              {blog.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm text-white/55">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#04A9FF] to-[#0070cc] flex items-center justify-center text-white text-sm font-black shadow-lg shadow-[#04A9FF]/30 flex-shrink-0">
                  {blog.author[0]?.toUpperCase()}
                </div>
                <span className="font-semibold text-white/80">{blog.author}</span>
              </div>
              <span className="text-white/30">|</span>
              <span>{formatDate(blog.created_at)}</span>
              {blog.read_time && (
                <>
                  <span className="text-white/30">|</span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                    {blog.read_time} min read
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 xl:gap-16 items-start">

            {/* ── Main article ──────────────────────────────────────────── */}
            <article className="min-w-0">

              {/* Featured image (below hero on no-image posts, or as article opener) */}
              {imgSrc && (
                <div className="rounded-2xl overflow-hidden mb-10 shadow-xl shadow-black/10 border border-gray-100">
                  <img src={imgSrc} alt={blog.title} className="w-full max-h-[480px] object-cover" />
                </div>
              )}

              {/* Lead / short description */}
              {blog.short_description && (
                <div className="relative mb-10 pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#04A9FF] to-[#0070cc] rounded-full" />
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light italic">
                    {blog.short_description}
                  </p>
                </div>
              )}

              {/* Blog body */}
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />

              {/* Tags footer */}
              {tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Tags</span>
                  {tags.map((tag) => (
                    <span key={tag}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-xs font-medium capitalize hover:bg-[#04A9FF]/10 hover:text-[#04A9FF] transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Share this article</p>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    {
                      label: "Facebook", color: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
                      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
                      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                    },
                    {
                      label: "Twitter / X", color: "hover:bg-black hover:text-white hover:border-black",
                      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(pageUrl)}`,
                      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                    },
                    {
                      label: "WhatsApp", color: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
                      href: `https://wa.me/?text=${encodeURIComponent(blog.title + " " + pageUrl)}`,
                      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>,
                    },
                  ].map(({ label, color, href, icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium transition-all ${color}`}>
                      {icon} {label}
                    </a>
                  ))}
                  <button onClick={handleCopy}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${copied ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200 text-gray-500 hover:bg-gray-100"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                    {copied ? "Link Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              {/* Author card */}
              <div className="mt-12 p-6 md:p-8 bg-gradient-to-br from-[#0f1a2c] to-[#1c2e48] rounded-2xl flex items-center gap-5 border border-white/5 shadow-xl shadow-[#0f1a2c]/20">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#04A9FF] to-[#0070cc] flex items-center justify-center text-white text-2xl font-black flex-shrink-0 shadow-lg shadow-[#04A9FF]/40 ring-4 ring-[#04A9FF]/20">
                  {blog.author[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#04A9FF] mb-1">Written by</p>
                  <p className="text-white font-bold text-xl">{blog.author}</p>
                  <p className="text-white/50 text-sm mt-0.5">Hair Specialist & Consultant — Indian Hair World</p>
                </div>
              </div>
            </article>

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <aside className="space-y-6 lg:sticky lg:top-6">

              {/* CTA box */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#04A9FF] to-[#0058b0] rounded-2xl p-6 shadow-xl shadow-[#04A9FF]/25">
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                  </div>
                  <p className="text-white font-extrabold text-lg leading-snug mb-2">Ready for a Hair Transformation?</p>
                  <p className="text-white/75 text-sm leading-relaxed mb-5">Book a free consultation at your nearest branch in Kolkata.</p>
                  <a href="/contact-us"
                    className="block w-full py-3 bg-white text-[#04A9FF] text-sm font-extrabold rounded-xl hover:bg-white/90 transition-all text-center shadow-lg shadow-black/10">
                    Book Free Consultation →
                  </a>
                </div>
              </div>

              {/* Related articles */}
              {relatedBlogs.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Related Articles</h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {relatedBlogs.map((rb) => (
                      <Link key={rb.id} href={`/blog/${rb.slug}`}
                        className="group flex gap-3.5 p-4 hover:bg-gray-50/80 transition-colors">
                        {rb.featured_image ? (
                          <img src={getBlogImageUrl(rb.featured_image) || ""} alt={rb.title}
                            className="w-18 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-100" style={{ width: "4.5rem" }} />
                        ) : (
                          <div className="w-18 h-14 rounded-xl bg-gradient-to-br from-[#04A9FF]/10 to-[#04A9FF]/5 flex items-center justify-center flex-shrink-0 border border-[#04A9FF]/10" style={{ width: "4.5rem" }}>
                            <span className="text-[#04A9FF] text-xs font-black">IHW</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-[#04A9FF] transition-colors leading-snug">
                            {rb.title}
                          </p>
                          {rb.read_time && (
                            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                              </svg>
                              {rb.read_time} min read
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back link */}
              <Link href="/blog"
                className="flex items-center gap-2 text-sm font-semibold text-[#04A9FF] hover:gap-3 transition-all group">
                <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back to all articles
              </Link>
            </aside>
          </div>
        </div>
      </MainLayOut>

      <style jsx global>{`
        .blog-content {
          font-size: 1.0625rem;
          line-height: 1.85;
          color: #374151;
        }
        .blog-content h1 { font-size: 2rem; font-weight: 800; color: #0f1a2c; margin: 2.5rem 0 1rem; line-height: 1.2; }
        .blog-content h2 { font-size: 1.6rem; font-weight: 700; color: #0f1a2c; margin: 2.25rem 0 .875rem; line-height: 1.3; padding-bottom: .5rem; border-bottom: 2px solid #f3f4f6; }
        .blog-content h3 { font-size: 1.3rem; font-weight: 700; color: #1f2937; margin: 1.75rem 0 .625rem; line-height: 1.35; }
        .blog-content h4 { font-size: 1.1rem; font-weight: 600; color: #374151; margin: 1.5rem 0 .5rem; }
        .blog-content p  { margin-bottom: 1.5rem; }
        .blog-content ul { list-style: none; padding-left: 0; margin-bottom: 1.5rem; }
        .blog-content ul li { padding-left: 1.5rem; position: relative; margin-bottom: .6rem; }
        .blog-content ul li::before { content: ""; position: absolute; left: 0; top: .65em; width: 7px; height: 7px; background: #04A9FF; border-radius: 50%; }
        .blog-content ol { list-style: decimal; padding-left: 1.75rem; margin-bottom: 1.5rem; }
        .blog-content ol li { margin-bottom: .6rem; padding-left: .25rem; }
        .blog-content li { line-height: 1.75; color: #4b5563; }
        .blog-content a { color: #04A9FF; text-decoration: underline; text-underline-offset: 3px; font-weight: 500; }
        .blog-content a:hover { color: #0070cc; }
        .blog-content strong { font-weight: 700; color: #111827; }
        .blog-content em { font-style: italic; color: #6b7280; }
        .blog-content s  { text-decoration: line-through; color: #9ca3af; }
        .blog-content blockquote {
          border-left: 4px solid #04A9FF;
          padding: 1rem 1.5rem;
          background: linear-gradient(to right, #f0faff, #f8fcff);
          margin: 2rem 0;
          border-radius: 0 .75rem .75rem 0;
          font-style: italic;
          color: #374151;
          font-size: 1.05rem;
        }
        .blog-content code {
          background: #f3f4f6; padding: .15rem .45rem; border-radius: .35rem;
          font-size: .875rem; font-family: monospace; color: #be185d;
        }
        .blog-content pre {
          background: #0f172a; color: #e2e8f0; padding: 1.5rem; border-radius: 1rem;
          overflow-x: auto; margin: 2rem 0; font-size: .875rem; line-height: 1.7;
          box-shadow: 0 8px 32px rgba(0,0,0,.15);
        }
        .blog-content pre code { background: none; color: inherit; padding: 0; font-size: inherit; }
        .blog-content img {
          width: 100%; border-radius: 1rem; margin: 2rem 0;
          box-shadow: 0 8px 32px rgba(0,0,0,.1); border: 1px solid #f3f4f6;
        }
        .blog-content hr { border: none; border-top: 2px solid #f3f4f6; margin: 2.5rem 0; }
        .blog-content table { width: 100%; border-collapse: collapse; margin: 2rem 0; font-size: .9rem; border-radius: .75rem; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,.06); }
        .blog-content th { background: #0f1a2c; color: white; padding: .875rem 1.25rem; text-align: left; font-weight: 600; font-size: .875rem; letter-spacing: .03em; }
        .blog-content td { padding: .875rem 1.25rem; border-bottom: 1px solid #f3f4f6; color: #4b5563; }
        .blog-content tr:last-child td { border-bottom: none; }
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
