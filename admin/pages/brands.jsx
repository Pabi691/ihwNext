import { useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiAlertCircle, FiImage, FiAward } from "react-icons/fi";

function BrandModal({ brand, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    id: brand?.id || null,
    brand_name: brand?.brand_name || "",
    brand_desc: brand?.brand_desc || "",
  });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(brand?.brand_img || null);
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
    if (!form.brand_name.trim()) return setError("Brand name is required.");
    if (!brand && !imgFile) return setError("Brand image is required.");
    await onSave(form, imgFile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{brand ? "Edit Brand" : "New Brand"}</h3>
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
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Brand Name *</label>
            <input value={form.brand_name} onChange={(e) => set("brand_name", e.target.value)}
              placeholder="e.g. Remy Hair"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Description</label>
            <textarea rows={3} value={form.brand_desc} onChange={(e) => set("brand_desc", e.target.value)}
              placeholder="Brand description..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">
              Brand Logo {!brand && <span className="text-red-400">*</span>}
            </label>
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
            {saving ? "Saving..." : brand ? "Update Brand" : "Create Brand"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Brands() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_brands");
      const data = res.data;
      setBrands(Array.isArray(data?.brandList) ? data.brandList : Array.isArray(data) ? data : []);
    } catch {
      setBrands([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchBrands();
  }, [ready, fetchBrands]);

  const filtered = brands.filter((b) => {
    const q = search.toLowerCase();
    return !q || (b.brand_name || "").toLowerCase().includes(q);
  });

  const handleSave = async (form, imgFile) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("brand_name", form.brand_name);
      fd.append("brand_desc", form.brand_desc || "");
      if (imgFile) fd.append("brand_img", imgFile);

      if (form.id) {
        fd.append("id", form.id);
        await api("post", "/update_brand", fd);
      } else {
        await api("post", "/create_brand", fd);
      }
      await fetchBrands();
      setModal(null);
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (brand) => {
    if (!window.confirm(`Delete brand "${brand.brand_name}"? This cannot be undone.`)) return;
    setDeleting(brand.id);
    try {
      await api("delete", `/delete_brand/${brand.id}`);
      setBrands((prev) => prev.filter((b) => b.id !== brand.id));
    } catch {}
    setDeleting(null);
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Brands">
      <Head><title>Brands — IHW Admin</title></Head>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search brands..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm" />
        </div>
        <button onClick={() => setModal("new")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap">
          <FiPlus size={15} /> New Brand
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm h-36 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center text-gray-400 text-sm">No brands found</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((brand) => (
            <div key={brand.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              {brand.brand_img ? (
                <img src={brand.brand_img} alt={brand.brand_name}
                  className="w-14 h-14 rounded-xl object-cover mb-3 border border-gray-100" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mb-3">
                  <FiAward size={22} className="text-purple-400" />
                </div>
              )}
              <p className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{brand.brand_name}</p>
              {brand.brand_desc && <p className="text-xs text-gray-400 line-clamp-1 mb-3">{brand.brand_desc}</p>}
              <div className="flex items-center gap-2 mt-auto">
                <button onClick={() => setModal(brand)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <FiEdit2 size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(brand)} disabled={deleting === brand.id}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50">
                  {deleting === brand.id ? <span className="text-xs">...</span> : <FiTrash2 size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <BrandModal
          brand={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </AdminLayout>
  );
}
