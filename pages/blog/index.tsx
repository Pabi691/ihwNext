import React, { useState, useMemo } from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import MainLayOut from "@/layout/MainLayOut";
import { DesktopNav } from "@/components/Navigation";
import TopBar from "@/components/home/TopBar";
import BlogCard from "@/components/blog/BlogCard";
import { BlogService } from "@/content/blog-service.server";

const POSTS_PER_PAGE = 9;

interface Blog {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  featured_image: string | null;
  author: string;
  read_time: number | null;
  tags: string | null;
  created_at: string;
}

interface Props {
  blogs: Blog[];
}

export default function BlogListingPage({ blogs }: Props) {
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [activeTag, setActiveTag] = useState("");

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    blogs.forEach((b) => {
      (b.tags || "").split(",").forEach((t) => {
        const trimmed = t.trim();
        if (trimmed) tagSet.add(trimmed);
      });
    });
    return Array.from(tagSet).slice(0, 10);
  }, [blogs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return blogs.filter((b) => {
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        (b.short_description || "").toLowerCase().includes(q) ||
        (b.author || "").toLowerCase().includes(q);
      const matchTag =
        !activeTag ||
        (b.tags || "").toLowerCase().split(",").map((t) => t.trim()).includes(activeTag.toLowerCase());
      return matchSearch && matchTag;
    });
  }, [blogs, search, activeTag]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleTag = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? "" : tag));
    setPage(1);
  };

  const featuredPost = page === 1 && !search && !activeTag ? paginated[0] : null;
  const gridPosts    = featuredPost ? paginated.slice(1) : paginated;

  return (
    <>
      <Head>
        <title>Hair Care Blog — Tips, Guides & Insights | Indian Hair World</title>
        <meta name="description" content="Expert articles on hair patches, wigs, non-surgical hair replacement, and hair care tips from Indian Hair World." />
        <meta name="keywords" content="hair patch blog, hair wig tips, non-surgical hair replacement, hair care guide, Indian Hair World" />
        <meta property="og:title" content="Hair Care Blog | Indian Hair World" />
        <meta property="og:description" content="Expert articles on hair patches, wigs, and non-surgical hair replacement." />
        <link rel="canonical" href="https://www.indianhairworld.com/blog" />
      </Head>

      <TopBar />
      <MainLayOut>
        <DesktopNav />

        {/* Hero Banner */}
        <section className="relative bg-[#0f1a2c] py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #04A9FF 0%, transparent 60%)" }} />
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-[#04A9FF] mb-4">Our Blog</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight leading-tight">
                Hair Care <span className="text-[#04A9FF]">Tips & Insights</span>
              </h1>
              <p className="mt-4 text-lg text-white/60 leading-relaxed">
                Expert guides on hair patches, wigs, and non-surgical hair replacement — straight from the Indian Hair World team.
              </p>

              {/* Search */}
              <div className="mt-8 relative max-w-md mx-auto">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm outline-none focus:border-[#04A9FF] focus:bg-white/15 transition-all"
                />
              </div>

              {/* Breadcrumb */}
              <nav className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
                <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
                <span>›</span>
                <span className="text-white/70">Blog</span>
              </nav>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">

          {/* Tag filters */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => handleTag("")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  !activeTag ? "bg-[#04A9FF] text-white shadow-md shadow-[#04A9FF]/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                All
              </button>
              {allTags.map((tag) => (
                <button key={tag} onClick={() => handleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                    activeTag === tag ? "bg-[#04A9FF] text-white shadow-md shadow-[#04A9FF]/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          {(search || activeTag) && (
            <p className="text-sm text-gray-500 mb-6">
              {filtered.length} article{filtered.length !== 1 ? "s" : ""} found
              {search && <> for "<strong>{search}</strong>"</>}
              {activeTag && <> tagged "<strong>{activeTag}</strong>"</>}
            </p>
          )}

          {blogs.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                </svg>
              </div>
              <p className="text-xl font-bold text-gray-700 mb-2">No articles yet</p>
              <p className="text-gray-400 text-sm">Check back soon for expert hair care tips and guides.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-bold text-gray-700">No articles match your search</p>
              <button onClick={() => { setSearch(""); setActiveTag(""); }}
                className="mt-3 text-[#04A9FF] text-sm font-semibold hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-8">
                  <BlogCard blog={featuredPost} featured />
                </div>
              )}

              {/* Grid */}
              {gridPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridPosts.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#04A9FF] hover:text-[#04A9FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        p === page
                          ? "bg-[#04A9FF] text-white shadow-md shadow-[#04A9FF]/20"
                          : "border border-gray-200 text-gray-600 hover:border-[#04A9FF] hover:text-[#04A9FF]"
                      }`}>
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#04A9FF] hover:text-[#04A9FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </MainLayOut>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const blogs = await BlogService.getAll();
  return { props: { blogs } };
};
