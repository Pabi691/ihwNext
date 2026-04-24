import { useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiGrid, FiPlus, FiEdit2, FiTrash2, FiX, FiAlertCircle, FiImage } from "react-icons/fi";

function CategoryModal({ category, categories, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    id: category?.id || null,
    category_name: category?.category_name || "",
    cat_desc: category?.cat_desc || "",
    parent_category_id: category?.parents?.[0]?.id || category?.parent_category_id || "",
  });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(category?.cat_img || null);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.category_name.trim()) return setError("Category name is required.");
    await onSave(form, imgFile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{category ? "Edit Category" : "New Category"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <FiX size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              <FiAlertCircle size={15} /> {error}
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Category Name *</label>
            <input value={form.category_name} onChange={(e) => set("category_name", e.target.value)}
              placeholder="e.g. Hair Extensions"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Parent Category</label>
            <select value={form.parent_category_id} onChange={(e) => set("parent_category_id", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-[#04A9FF] transition-colors">
              <option value="">None (Top Level)</option>
              {categories.filter((c) => c.id !== category?.id).map((c) => (
                <option key={c.id} value={c.id}>{c.category_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Description</label>
            <textarea rows={3} value={form.cat_desc} onChange={(e) => set("cat_desc", e.target.value)}
              placeholder="Brief description..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Category Image</label>
            <div className="flex items-center gap-3">
              {imgPreview ? (
                <img src={imgPreview} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-100" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
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
            {saving ? "Saving..." : category ? "Update Category" : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Categories() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState(null);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_all_categories");
      const data = res.data;
      setCategories(Array.isArray(data?.categoryList) ? data.categoryList : Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchCategories();
  }, [ready, fetchCategories]);

  const filtered = categories.filter((c) => {
    const q = search.toLowerCase();
    return !q || (c.category_name || "").toLowerCase().includes(q);
  });

  const toggleStatus = async (cat) => {
    setToggling(cat.id);
    const newStatus = cat.status === 1 || cat.status === "1" || cat.status === true ? 0 : 1;
    try {
      await api("get", `/update_category_status/${cat.id}/${newStatus}`);
      setCategories((prev) => prev.map((c) => c.id === cat.id ? { ...c, status: newStatus } : c));
    } catch {}
    setToggling(null);
  };

  const handleSave = async (form, imgFile) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("category_name", form.category_name);
      fd.append("cat_desc", form.cat_desc || "");
      fd.append("parent_category_id", form.parent_category_id || "");
      if (imgFile) fd.append("cat_img", imgFile);

      if (form.id) {
        fd.append("id", form.id);
        await api("post", "/update_category", fd);
      } else {
        await api("post", "/create_category", fd);
      }
      await fetchCategories();
      setModal(null);
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete "${cat.category_name}"? This cannot be undone.`)) return;
    setDeleting(cat.id);
    try {
      await api("get", `/delete_category/${cat.id}`);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    } catch {}
    setDeleting(null);
  };

  const isActive = (c) => c.status === 1 || c.status === "1" || c.status === true;

  if (!ready) return null;

  return (
    <AdminLayout title="Categories">
      <Head><title>Categories — IHW Admin</title></Head>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm" />
        </div>
        <button onClick={() => setModal("new")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap">
          <FiPlus size={15} /> New Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse h-36" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center text-gray-400 text-sm">
          No categories found
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((cat) => {
            const active = isActive(cat);
            const parentName = cat.parents?.[0]?.category_name || null;
            return (
              <div key={cat.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                {cat.cat_img ? (
                  <img src={cat.cat_img} alt={cat.category_name}
                    className="w-12 h-12 rounded-xl object-cover mb-3 border border-gray-100" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#04A9FF]/20 to-[#04A9FF]/5 flex items-center justify-center mb-3">
                    <FiGrid size={20} className="text-[#04A9FF]" />
                  </div>
                )}
                <p className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug mb-0.5">{cat.category_name}</p>
                {parentName && <p className="text-xs text-gray-400 mb-2">in {parentName}</p>}
                <div className="flex items-center justify-between mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-gray-400"}`} />
                    {active ? "Active" : "Off"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setModal(cat)}
                      className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <FiEdit2 size={12} />
                    </button>
                    <button onClick={() => handleDelete(cat)} disabled={deleting === cat.id}
                      className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50">
                      {deleting === cat.id ? <span className="text-xs">...</span> : <FiTrash2 size={12} />}
                    </button>
                    <button onClick={() => toggleStatus(cat)} disabled={toggling === cat.id}
                      title={active ? "Deactivate" : "Activate"}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 text-xs font-bold
                        ${active ? "bg-orange-50 text-orange-500 hover:bg-orange-100" : "bg-blue-50 text-blue-500 hover:bg-blue-100"}`}>
                      {toggling === cat.id ? "..." : active ? "✕" : "✓"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <CategoryModal
          category={modal === "new" ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </AdminLayout>
  );
}
