import { useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiPlus, FiSearch, FiTrash2, FiX, FiAlertCircle, FiEdit2, FiImage } from "react-icons/fi";

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function BlogModal({ blog, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    id: blog?.id || null,
    title: blog?.title || "",
    slug: blog?.slug || "",
    author: blog?.author || "",
    short_description: blog?.short_description || "",
    content: blog?.content || "",
    status: blog?.status || "Published",
  });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(blog?.featured_image || null);
  const [error, setError] = useState("");
  const fileRef = useRef();
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
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.author.trim()) return setError("Author is required.");
    if (!form.short_description.trim()) return setError("Short description is required.");
    if (!form.content.trim()) return setError("Content is required.");
    await onSave(form, imgFile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-gray-900">{blog ? "Edit Blog Post" : "New Blog Post"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <FiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              <FiAlertCircle size={15} /> {error}
            </div>
          )}

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

          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Short Description *</label>
            <textarea rows={2} value={form.short_description} onChange={(e) => set("short_description", e.target.value)}
              placeholder="Brief summary of the post..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none" />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Content *</label>
            <textarea rows={10} value={form.content} onChange={(e) => set("content", e.target.value)}
              placeholder="Write your blog content here (HTML supported)..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none font-mono" />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Featured Image</label>
            <div className="flex items-center gap-3">
              {imgPreview ? (
                <img src={imgPreview} alt="" className="w-20 h-14 rounded-xl object-cover border border-gray-100" />
              ) : (
                <div className="w-20 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                  <FiImage size={20} className="text-gray-300" />
                </div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                {imgPreview ? "Change Image" : "Upload Image"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImg} />
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
            {saving ? "Saving..." : blog ? "Update Post" : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Blogs() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/blogs");
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

  const filtered = blogs.filter((b) => {
    const q = search.toLowerCase();
    return !q || (b.title || "").toLowerCase().includes(q) || (b.author || "").toLowerCase().includes(q);
  });

  const handleSave = async (form, imgFile) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("slug", form.slug);
      fd.append("author", form.author);
      fd.append("short_description", form.short_description);
      fd.append("content", form.content);
      fd.append("status", form.status);
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

  const isPublished = (b) => b.status === "Published" || b.status === "published" || b.status === 1;

  if (!ready) return null;

  return (
    <AdminLayout title="Blogs">
      <Head><title>Blogs — IHW Admin</title></Head>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search blog posts..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm" />
        </div>
        <button onClick={() => setModal("new")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap">
          <FiPlus size={15} /> New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No blog posts found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((blog) => {
              const published = isPublished(blog);
              return (
                <div key={blog.id} className="px-5 py-4 hover:bg-gray-50/70 transition-colors flex items-start gap-4">
                  {blog.featured_image ? (
                    <img src={blog.featured_image} alt={blog.title}
                      className="w-16 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                  ) : (
                    <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-[#04A9FF]/10 to-[#04A9FF]/5 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#04A9FF] text-lg font-black">B</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-800 text-sm line-clamp-1">{blog.title}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${published ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                        {published ? "Published" : "Draft"}
                      </span>
                    </div>
                    {blog.author && <p className="text-xs text-gray-500 mt-0.5">by {blog.author}</p>}
                    {blog.short_description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{blog.short_description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <p className="text-xs text-gray-400 hidden sm:block whitespace-nowrap">
                      {blog.created_at ? new Date(blog.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                    </p>
                    <button onClick={() => setModal(blog)}
                      className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <FiEdit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(blog)} disabled={deleting === blog.id}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-60">
                      {deleting === blog.id ? <span className="text-xs">...</span> : <FiTrash2 size={13} />}
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
