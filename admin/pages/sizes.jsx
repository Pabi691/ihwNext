import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiAlertCircle } from "react-icons/fi";

function SizeModal({ size, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    id: size?.id || null,
    size_name: size?.size_name || "",
    size_code: size?.size_code || "",
  });
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.size_name.trim()) return setError("Size name is required.");
    if (!form.size_code.trim()) return setError("Size code is required.");
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{size ? "Edit Size" : "New Size"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
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
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Size Name *</label>
            <input value={form.size_name} onChange={(e) => set("size_name", e.target.value)}
              placeholder="e.g. 10 Inch"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Size Code *</label>
            <input value={form.size_code} onChange={(e) => set("size_code", e.target.value)}
              placeholder="e.g. 10IN"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
            {saving ? "Saving..." : size ? "Update Size" : "Create Size"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Sizes() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchSizes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_all_sizes");
      const data = res.data;
      setSizes(Array.isArray(data?.sizes) ? data.sizes : Array.isArray(data) ? data : []);
    } catch {
      setSizes([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchSizes();
  }, [ready, fetchSizes]);

  const filtered = sizes.filter((s) => {
    const q = search.toLowerCase();
    return !q || (s.size_name || "").toLowerCase().includes(q) || (s.size_code || "").toLowerCase().includes(q);
  });

  const handleSave = async (form) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("size_name", form.size_name);
      fd.append("size_code", form.size_code);
      if (form.id) {
        fd.append("id", form.id);
        await api("post", `/update_size/${form.id}`, fd);
      } else {
        await api("post", "/create_size", fd);
      }
      await fetchSizes();
      setModal(null);
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (size) => {
    if (!window.confirm(`Delete size "${size.size_name}"?`)) return;
    setDeleting(size.id);
    try {
      await api("get", `/delete_size/${size.id}`);
      setSizes((prev) => prev.filter((s) => s.id !== size.id));
    } catch {}
    setDeleting(null);
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Sizes">
      <Head><title>Sizes — IHW Admin</title></Head>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sizes..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm" />
        </div>
        <button onClick={() => setModal("new")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap">
          <FiPlus size={15} /> New Size
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No sizes found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                  <th className="px-5 py-3.5 text-left">Size Name</th>
                  <th className="px-5 py-3.5 text-left">Size Code</th>
                  <th className="px-5 py-3.5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((size) => (
                  <tr key={size.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800">{size.size_name}</td>
                    <td className="px-5 py-3.5 font-mono text-gray-500">{size.size_code}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setModal(size)}
                          className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
                          <FiEdit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(size)} disabled={deleting === size.id}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-60">
                          {deleting === size.id ? <span className="text-xs">...</span> : <FiTrash2 size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <SizeModal size={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} saving={saving} />
      )}
    </AdminLayout>
  );
}
