import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiAlertCircle, FiFileText } from "react-icons/fi";

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function PageModal({ page, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    id: page?.id || null,
    title: page?.title || "",
    slug: page?.slug || "",
    content: page?.content || "",
  });
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (val) => {
    set("title", val);
    if (!page) set("slug", slugify(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.content.trim()) return setError("Content is required.");
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-gray-900">{page ? "Edit Page" : "New Page"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <FiX size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              <FiAlertCircle size={15} /> {error}
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Page title..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Slug</label>
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
              placeholder="url-slug"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-[#04A9FF] transition-colors" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Content *</label>
            <textarea rows={12} value={form.content} onChange={(e) => set("content", e.target.value)}
              placeholder="Page content (HTML supported)..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none font-mono" />
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
            {saving ? "Saving..." : page ? "Update Page" : "Create Page"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Pages() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_all_pages");
      const data = res.data;
      setPages(Array.isArray(data?.pages) ? data.pages : Array.isArray(data) ? data : []);
    } catch {
      setPages([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchPages();
  }, [ready, fetchPages]);

  const filtered = pages.filter((p) => {
    const q = search.toLowerCase();
    return !q || (p.title || "").toLowerCase().includes(q) || (p.slug || "").toLowerCase().includes(q);
  });

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (form.id) {
        await api("post", `/update_page/${form.id}`, form);
      } else {
        await api("post", "/create_page", form);
      }
      await fetchPages();
      setModal(null);
    } catch {}
    setSaving(false);
  };

  const toggleStatus = async (page) => {
    setToggling(page.id);
    const newStatus = page.status === 1 || page.status === "1" || page.status === true ? 0 : 1;
    try {
      await api("get", `/update_page_status/${page.id}/${newStatus}`);
      setPages((prev) => prev.map((p) => p.id === page.id ? { ...p, status: newStatus } : p));
    } catch {}
    setToggling(null);
  };

  const handleDelete = async (page) => {
    if (!window.confirm(`Delete page "${page.title}"? This cannot be undone.`)) return;
    setDeleting(page.id);
    try {
      await api("delete", `/delete_page/${page.id}`);
      setPages((prev) => prev.filter((p) => p.id !== page.id));
    } catch {}
    setDeleting(null);
  };

  const isActive = (p) => p.status === 1 || p.status === "1" || p.status === true;

  if (!ready) return null;

  return (
    <AdminLayout title="Pages">
      <Head><title>Pages — IHW Admin</title></Head>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pages..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm" />
        </div>
        <button onClick={() => setModal("new")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap">
          <FiPlus size={15} /> New Page
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No pages found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((page) => {
              const active = isActive(page);
              return (
                <div key={page.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#04A9FF]/10 flex items-center justify-center flex-shrink-0">
                    <FiFileText size={18} className="text-[#04A9FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-800 text-sm">{page.title}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">/{page.slug}</p>
                  </div>
                  <p className="text-xs text-gray-400 hidden sm:block whitespace-nowrap">
                    {page.created_at ? new Date(page.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setModal(page)}
                      className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <FiEdit2 size={13} />
                    </button>
                    <button onClick={() => toggleStatus(page)} disabled={toggling === page.id}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-60 ${active ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                      {toggling === page.id ? "..." : active ? "Disable" : "Enable"}
                    </button>
                    <button onClick={() => handleDelete(page)} disabled={deleting === page.id}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-60">
                      {deleting === page.id ? <span className="text-xs">...</span> : <FiTrash2 size={13} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modal && (
        <PageModal page={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} saving={saving} />
      )}
    </AdminLayout>
  );
}
