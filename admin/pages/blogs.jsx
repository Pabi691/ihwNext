import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiPlus, FiSearch, FiTrash2, FiEdit2 } from "react-icons/fi";

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Blogs() {
  const { ready }  = useAuthGuard();
  const { api }    = useAdmin();
  const router     = useRouter();
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
        <button onClick={() => router.push("/blog-editor/new")}
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
            <button onClick={() => router.push("/blog-editor/new")} className="mt-3 text-[#04A9FF] text-sm font-semibold hover:underline">
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
                    <button onClick={() => router.push(`/blog-editor/${blog.id}`)}
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

    </AdminLayout>
  );
}
