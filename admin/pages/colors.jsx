import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiAlertCircle } from "react-icons/fi";

function ColorModal({ color, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    id: color?.id || null,
    color_name: color?.color_name || "",
    color_code: color?.color_code || "#000000",
  });
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.color_name.trim()) return setError("Color name is required.");
    if (!form.color_code.trim()) return setError("Color code is required.");
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{color ? "Edit Color" : "New Color"}</h3>
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
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Color Name *</label>
            <input value={form.color_name} onChange={(e) => set("color_name", e.target.value)}
              placeholder="e.g. Natural Black"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Color Code *</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.color_code} onChange={(e) => set("color_code", e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" />
              <input value={form.color_code} onChange={(e) => set("color_code", e.target.value)}
                placeholder="#000000"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-[#04A9FF] transition-colors" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
            {saving ? "Saving..." : color ? "Update Color" : "Create Color"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Colors() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);

  const fetchColors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_all_colors");
      const data = res.data;
      setColors(Array.isArray(data?.colors) ? data.colors : Array.isArray(data) ? data : []);
    } catch {
      setColors([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchColors();
  }, [ready, fetchColors]);

  const filtered = colors.filter((c) => {
    const q = search.toLowerCase();
    return !q || (c.color_name || "").toLowerCase().includes(q);
  });

  const handleSave = async (form) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("color_name", form.color_name);
      fd.append("color_code", form.color_code);
      if (form.id) {
        fd.append("id", form.id);
        fd.append("status", "1");
        await api("post", `/update_color/${form.id}`, fd);
      } else {
        fd.append("status", "1");
        await api("post", "/create_color", fd);
      }
      await fetchColors();
      setModal(null);
    } catch {}
    setSaving(false);
  };

  const toggleStatus = async (color) => {
    setToggling(color.id);
    const newStatus = color.status === 1 || color.status === "1" || color.status === true ? 0 : 1;
    try {
      await api("get", `/update_color_status/${color.id}/${newStatus}`);
      setColors((prev) => prev.map((c) => c.id === color.id ? { ...c, status: newStatus } : c));
    } catch {}
    setToggling(null);
  };

  const handleDelete = async (color) => {
    if (!window.confirm(`Delete color "${color.color_name}"?`)) return;
    setDeleting(color.id);
    try {
      await api("get", `/delete_color/${color.id}`);
      setColors((prev) => prev.filter((c) => c.id !== color.id));
    } catch {}
    setDeleting(null);
  };

  const isActive = (c) => c.status === 1 || c.status === "1" || c.status === true;

  if (!ready) return null;

  return (
    <AdminLayout title="Colors">
      <Head><title>Colors — IHW Admin</title></Head>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search colors..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm" />
        </div>
        <button onClick={() => setModal("new")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap">
          <FiPlus size={15} /> New Color
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No colors found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                  <th className="px-5 py-3.5 text-left">Color</th>
                  <th className="px-5 py-3.5 text-left">Code</th>
                  <th className="px-5 py-3.5 text-left">Status</th>
                  <th className="px-5 py-3.5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((color) => {
                  const active = isActive(color);
                  return (
                    <tr key={color.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0"
                            style={{ backgroundColor: color.color_code || "#ccc" }} />
                          <span className="font-medium text-gray-800">{color.color_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-gray-500 text-xs">{color.color_code}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-gray-400"}`} />
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setModal(color)}
                            className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <FiEdit2 size={13} />
                          </button>
                          <button onClick={() => toggleStatus(color)} disabled={toggling === color.id}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 ${active ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                            {toggling === color.id ? "..." : active ? "Disable" : "Enable"}
                          </button>
                          <button onClick={() => handleDelete(color)} disabled={deleting === color.id}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-60">
                            {deleting === color.id ? <span className="text-xs">...</span> : <FiTrash2 size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <ColorModal color={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} saving={saving} />
      )}
    </AdminLayout>
  );
}
