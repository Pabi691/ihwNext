import { useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import {
  FiPlus, FiSearch, FiTrash2, FiX, FiAlertCircle, FiEdit2,
  FiImage, FiBold, FiItalic, FiList, FiLink, FiCode, FiEye,
  FiEyeOff, FiTag, FiGlobe, FiChevronDown, FiChevronUp,
} from "react-icons/fi";

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function estimateReadTime(html) {
  const words = (html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ── Rich Text Toolbar ──────────────────────────────────────────────────────
function RichToolbar({ textareaRef, onChange }) {
  const wrap = (before, after = before) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const sel   = el.value.slice(start, end);
    const next  = el.value.slice(0, start) + before + sel + after + el.value.slice(end);
    onChange(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertBlock = (tag) => {
    const el = textareaRef.current;
    if (!el) return;
    const pos  = el.selectionStart;
    const ins  = `\n<${tag}></${tag}>\n`;
    const next = el.value.slice(0, pos) + ins + el.value.slice(pos);
    onChange(next);
    setTimeout(() => el.focus(), 0);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (!url) return;
    const el    = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const sel   = el.value.slice(start, end) || "Link text";
    const tag   = `<a href="${url}" target="_blank" rel="noopener noreferrer">${sel}</a>`;
    const next  = el.value.slice(0, start) + tag + el.value.slice(end);
    onChange(next);
    setTimeout(() => el.focus(), 0);
  };

  const btn = "p-1.5 rounded-md hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors";
  const sep = <span className="w-px h-5 bg-gray-200 mx-0.5" />;

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-t-xl border-b-0">
      <button type="button" title="Bold" onClick={() => wrap("<strong>", "</strong>")} className={btn}><FiBold size={13} /></button>
      <button type="button" title="Italic" onClick={() => wrap("<em>", "</em>")} className={btn}><FiItalic size={13} /></button>
      {sep}
      <button type="button" title="H2" onClick={() => wrap("<h2>", "</h2>")} className={`${btn} text-[11px] font-black`}>H2</button>
      <button type="button" title="H3" onClick={() => wrap("<h3>", "</h3>")} className={`${btn} text-[11px] font-black`}>H3</button>
      {sep}
      <button type="button" title="Unordered List" onClick={() => insertBlock("ul")} className={btn}><FiList size={13} /></button>
      <button type="button" title="Paragraph" onClick={() => wrap("<p>", "</p>")} className={`${btn} text-[11px] font-bold`}>P</button>
      <button type="button" title="Blockquote" onClick={() => wrap("<blockquote>", "</blockquote>")} className={`${btn} text-[11px] font-bold`}>❝</button>
      {sep}
      <button type="button" title="Link" onClick={insertLink} className={btn}><FiLink size={13} /></button>
      <button type="button" title="Inline code" onClick={() => wrap("<code>", "</code>")} className={btn}><FiCode size={13} /></button>
    </div>
  );
}

// ── Blog Modal ─────────────────────────────────────────────────────────────
function BlogModal({ blog, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    id:                blog?.id || null,
    title:             blog?.title || "",
    slug:              blog?.slug || "",
    author:            blog?.author || "",
    short_description: blog?.short_description || "",
    content:           blog?.content || "",
    status:            blog?.status || "Published",
    tags:              blog?.tags || "",
    meta_title:        blog?.meta_title || "",
    meta_description:  blog?.meta_description || "",
    meta_keywords:     blog?.meta_keywords || "",
  });
  const [imgFile, setImgFile]     = useState(null);
  const [imgPreview, setImgPreview] = useState(blog?.featured_image || null);
  const [error, setError]         = useState("");
  const [preview, setPreview]     = useState(false);
  const [seoOpen, setSeoOpen]     = useState(false);
  const fileRef   = useRef();
  const contentRef = useRef();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (val) => {
    set("title", val);
    if (!blog) set("slug", slugify(val));
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim())             return setError("Title is required.");
    if (!form.author.trim())            return setError("Author is required.");
    if (!form.short_description.trim()) return setError("Short description is required.");
    if (!form.content.trim())           return setError("Content is required.");
    await onSave(form, imgFile);
  };

  const readTime = estimateReadTime(form.content);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="font-bold text-gray-900">{blog ? "Edit Blog Post" : "New Blog Post"}</h3>
            {form.content && (
              <p className="text-xs text-gray-400 mt-0.5">~{readTime} min read · {form.content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length} words</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPreview(!preview)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors">
              {preview ? <><FiEyeOff size={12} /> Editor</> : <><FiEye size={12} /> Preview</>}
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <FiX size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                <FiAlertCircle size={15} /> {error}
              </div>
            )}

            {/* Title & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Title *</label>
                <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Blog post title..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Author *</label>
                <input value={form.author} onChange={(e) => set("author", e.target.value)}
                  placeholder="Author name..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
              </div>
            </div>

            {/* Slug & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Slug</label>
                <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
                  placeholder="url-slug"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-[#04A9FF] transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] bg-white transition-colors">
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">
                <span className="inline-flex items-center gap-1"><FiTag size={11} /> Tags</span>
                <span className="text-gray-400 font-normal ml-1">(comma separated)</span>
              </label>
              <input value={form.tags} onChange={(e) => set("tags", e.target.value)}
                placeholder="hair loss, hair patch, wig care..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            </div>

            {/* Short Description */}
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Short Description *</label>
              <textarea rows={2} value={form.short_description} onChange={(e) => set("short_description", e.target.value)}
                placeholder="Brief summary shown in listing pages and SEO..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none" />
            </div>

            {/* Content */}
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Content * (HTML supported)</label>
              {preview ? (
                <div className="border border-gray-200 rounded-b-xl rounded-tr-xl min-h-[280px] p-4 prose prose-sm max-w-none overflow-auto"
                  dangerouslySetInnerHTML={{ __html: form.content }} />
              ) : (
                <>
                  <RichToolbar textareaRef={contentRef} onChange={(v) => set("content", v)} />
                  <textarea
                    ref={contentRef}
                    rows={12}
                    value={form.content}
                    onChange={(e) => set("content", e.target.value)}
                    placeholder="Write your blog content here... HTML is supported."
                    className="w-full border border-gray-200 rounded-b-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none font-mono"
                  />
                </>
              )}
            </div>

            {/* Featured Image */}
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">
                <span className="inline-flex items-center gap-1"><FiImage size={11} /> Featured Image</span>
              </label>
              <div className="flex items-center gap-3">
                {imgPreview ? (
                  <img src={imgPreview} alt="" className="w-24 h-16 rounded-xl object-cover border border-gray-100 shadow-sm" />
                ) : (
                  <div className="w-24 h-16 rounded-xl bg-gray-100 flex items-center justify-center border border-dashed border-gray-300">
                    <FiImage size={22} className="text-gray-300" />
                  </div>
                )}
                <div className="space-y-1">
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors block">
                    {imgPreview ? "Change Image" : "Upload Image"}
                  </button>
                  {imgPreview && (
                    <button type="button" onClick={() => { setImgPreview(null); setImgFile(null); }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-50 transition-colors block">
                      Remove
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImg} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Recommended: 1200×630px · JPG or PNG · max 2MB</p>
            </div>

            {/* SEO Section */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button type="button" onClick={() => setSeoOpen(!seoOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiGlobe size={14} className="text-[#04A9FF]" />
                  SEO Settings
                  <span className="text-xs font-normal text-gray-400">(meta title, description, keywords)</span>
                </span>
                {seoOpen ? <FiChevronUp size={15} className="text-gray-400" /> : <FiChevronDown size={15} className="text-gray-400" />}
              </button>

              {seoOpen && (
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Meta Title</label>
                      <span className={`text-xs ${form.meta_title.length > 60 ? "text-red-500" : "text-gray-400"}`}>
                        {form.meta_title.length}/60
                      </span>
                    </div>
                    <input value={form.meta_title} onChange={(e) => set("meta_title", e.target.value)}
                      placeholder={form.title || "SEO page title (defaults to post title)"}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
                    <p className="text-xs text-gray-400 mt-1">Shown in search engine results. Ideal: 50–60 chars.</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Meta Description</label>
                      <span className={`text-xs ${form.meta_description.length > 160 ? "text-red-500" : "text-gray-400"}`}>
                        {form.meta_description.length}/160
                      </span>
                    </div>
                    <textarea rows={2} value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)}
                      placeholder={form.short_description || "SEO description (defaults to short description)"}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none" />
                    <p className="text-xs text-gray-400 mt-1">Shown below title in search results. Ideal: 120–160 chars.</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Meta Keywords</label>
                    <input value={form.meta_keywords} onChange={(e) => set("meta_keywords", e.target.value)}
                      placeholder="hair patch, hair wig, non-surgical hair replacement..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
                    <p className="text-xs text-gray-400 mt-1">Comma-separated keywords for this post.</p>
                  </div>

                  {/* SERP Preview */}
                  {(form.meta_title || form.title) && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 mt-2">
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Search Preview</p>
                      <p className="text-base font-medium text-blue-700 hover:underline cursor-pointer line-clamp-1">
                        {form.meta_title || form.title}
                      </p>
                      <p className="text-xs text-green-700">indianhairworld.com/blog/{form.slug || "post-url"}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {form.meta_description || form.short_description || "No description provided."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
              {saving ? "Saving..." : blog ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Blogs() {
  const { ready }  = useAuthGuard();
  const { api }    = useAdmin();
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal]     = useState(null);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await api("get", "/blogs");
      const data = res.data;
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setBlogs(list);
    } catch {
      setBlogs([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchBlogs();
  }, [ready, fetchBlogs]);

  const isPublished = (b) => b.status === "Published" || b.status === "published" || b.status === 1;

  const filtered = blogs.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (b.title || "").toLowerCase().includes(q) || (b.author || "").toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && isPublished(b)) ||
      (statusFilter === "draft" && !isPublished(b));
    return matchSearch && matchStatus;
  });

  const handleSave = async (form, imgFile) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title",             form.title);
      fd.append("slug",              form.slug);
      fd.append("author",            form.author);
      fd.append("short_description", form.short_description);
      fd.append("content",           form.content);
      fd.append("status",            form.status);
      fd.append("tags",              form.tags || "");
      fd.append("meta_title",        form.meta_title || "");
      fd.append("meta_description",  form.meta_description || "");
      fd.append("meta_keywords",     form.meta_keywords || "");
      if (imgFile) fd.append("featured_image", imgFile);

      if (form.id) {
        await api("post", `/blogs/${form.id}?_method=PUT`, fd);
      } else {
        await api("post", "/blogs", fd);
      }
      await fetchBlogs();
      setModal(null);
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (blog) => {
    if (!window.confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;
    setDeleting(blog.id);
    try {
      await api("delete", `/blogs/${blog.id}`);
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
    } catch {}
    setDeleting(null);
  };

  const counts = {
    all:       blogs.length,
    published: blogs.filter(isPublished).length,
    draft:     blogs.filter((b) => !isPublished(b)).length,
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Blogs">
      <Head><title>Blogs — IHW Admin</title></Head>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Posts",  val: counts.all,       color: "bg-blue-50 text-blue-700" },
          { label: "Published",    val: counts.published,  color: "bg-green-50 text-green-700" },
          { label: "Drafts",       val: counts.draft,      color: "bg-yellow-50 text-yellow-700" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 text-center">
            <p className={`text-2xl font-black ${s.color.split(" ")[1]}`}>{s.val}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm" />
        </div>
        <div className="flex items-center gap-2">
          {["all", "published", "draft"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                statusFilter === s ? "bg-[#04A9FF] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#04A9FF]"
              }`}>
              {s} {counts[s] !== undefined ? `(${counts[s]})` : ""}
            </button>
          ))}
        </div>
        <button onClick={() => setModal("new")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap">
          <FiPlus size={15} /> New Post
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <FiEdit2 size={20} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">No blog posts found</p>
            <button onClick={() => setModal("new")} className="mt-3 text-[#04A9FF] text-sm font-semibold hover:underline">
              Create your first post →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((blog) => {
              const published = isPublished(blog);
              const tags = (blog.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
              return (
                <div key={blog.id} className="px-5 py-4 hover:bg-gray-50/70 transition-colors flex items-start gap-4">
                  {/* Thumbnail */}
                  {blog.featured_image ? (
                    <img src={blog.featured_image} alt={blog.title}
                      className="w-16 h-12 rounded-xl object-cover flex-shrink-0 border border-gray-100 shadow-sm" />
                  ) : (
                    <div className="w-16 h-12 rounded-xl bg-gradient-to-br from-[#04A9FF]/10 to-[#04A9FF]/5 flex items-center justify-center flex-shrink-0 border border-[#04A9FF]/10">
                      <span className="text-[#04A9FF] text-lg font-black">B</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-800 text-sm line-clamp-1">{blog.title}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        published ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                      }`}>
                        {published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      by {blog.author}
                      {blog.read_time && <span className="ml-2 text-gray-400">· {blog.read_time} min read</span>}
                    </p>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tags.slice(0, 3).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px]">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <p className="text-xs text-gray-400 hidden sm:block whitespace-nowrap">
                      {blog.created_at ? new Date(blog.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                    </p>
                    <button onClick={() => setModal(blog)}
                      className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors">
                      <FiEdit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(blog)} disabled={deleting === blog.id}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-60">
                      {deleting === blog.id ? <span className="text-xs font-bold">...</span> : <FiTrash2 size={13} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modal && (
        <BlogModal
          blog={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </AdminLayout>
  );
}
