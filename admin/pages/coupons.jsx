import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiPlus, FiSearch, FiTrash2, FiX, FiAlertCircle } from "react-icons/fi";

const EMPTY_FORM = {
  coupon_code: "",
  description: "",
  discount_type: "Percentage",
  discount_value: "",
  minimum_order_value: "",
  maximum_discount: "",
  start_date: "",
  end_date: "",
  usage_limit: "",
};

function CouponModal({ coupon, onClose, onSave, saving }) {
  const [form, setForm] = useState(
    coupon
      ? {
          id: coupon.id,
          coupon_code: coupon.coupon_code || "",
          description: coupon.description || "",
          discount_type: coupon.discount_type || "Percentage",
          discount_value: coupon.discount_value || "",
          minimum_order_value: coupon.minimum_order_value || "",
          maximum_discount: coupon.maximum_discount || "",
          start_date: coupon.start_date ? coupon.start_date.split("T")[0] : "",
          end_date: coupon.end_date ? coupon.end_date.split("T")[0] : "",
          usage_limit: coupon.usage_limit || "",
        }
      : { ...EMPTY_FORM }
  );
  const [error, setError] = useState("");

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.coupon_code.trim()) return setError("Coupon code is required.");
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.discount_value) return setError("Discount value is required.");
    if (!form.start_date) return setError("Start date is required.");
    if (!form.end_date) return setError("End date is required.");
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-gray-900">{coupon ? "Edit Coupon" : "Create Coupon"}</h3>
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

          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Coupon Code *</label>
            <input
              value={form.coupon_code}
              onChange={(e) => set("coupon_code", e.target.value.toUpperCase())}
              placeholder="e.g. SAVE20"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-[#04A9FF] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Description *</label>
            <input
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Coupon description..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Discount Type</label>
              <select
                value={form.discount_type}
                onChange={(e) => set("discount_type", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] bg-white transition-colors"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed">Fixed (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">
                Value {form.discount_type === "Percentage" ? "(%)" : "(₹)"} *
              </label>
              <input
                type="number"
                min="1"
                value={form.discount_value}
                onChange={(e) => set("discount_value", e.target.value)}
                placeholder={form.discount_type === "Percentage" ? "20" : "100"}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Min Order (₹)</label>
              <input
                type="number"
                min="0"
                value={form.minimum_order_value}
                onChange={(e) => set("minimum_order_value", e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Max Discount (₹)</label>
              <input
                type="number"
                min="0"
                value={form.maximum_discount}
                onChange={(e) => set("maximum_discount", e.target.value)}
                placeholder="No limit"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Start Date *</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => set("start_date", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">End Date *</label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => set("end_date", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Usage Limit</label>
            <input
              type="number"
              min="1"
              value={form.usage_limit}
              onChange={(e) => set("usage_limit", e.target.value)}
              placeholder="Unlimited"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Coupons() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_all_coupons");
      setCoupons(Array.isArray(res.data?.coupons) ? res.data.coupons : []);
    } catch {
      setCoupons([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchCoupons();
  }, [ready, fetchCoupons]);

  const filtered = coupons.filter((c) => {
    const q = search.toLowerCase();
    return !q || (c.coupon_code || "").toLowerCase().includes(q);
  });

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (form.id) {
        await api("post", `/update_coupon/${form.id}`, form);
      } else {
        await api("post", "/create_coupon", form);
      }
      await fetchCoupons();
      setModal(null);
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Delete coupon "${coupon.coupon_code}"? This cannot be undone.`)) return;
    setDeleting(coupon.id);
    try {
      await api("get", `/delete_coupon/${coupon.id}`);
      setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
    } catch {}
    setDeleting(null);
  };

  const isExpired = (c) => c.end_date && new Date(c.end_date) < new Date();

  if (!ready) return null;

  return (
    <AdminLayout title="Coupons">
      <Head><title>Coupons — IHW Admin</title></Head>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coupon code..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm"
          />
        </div>
        <button
          onClick={() => setModal("new")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap"
        >
          <FiPlus size={15} /> New Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No coupons found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                  <th className="px-5 py-3.5 text-left">Code</th>
                  <th className="px-5 py-3.5 text-left">Description</th>
                  <th className="px-5 py-3.5 text-left">Discount</th>
                  <th className="px-5 py-3.5 text-left">Min Order</th>
                  <th className="px-5 py-3.5 text-left">Uses</th>
                  <th className="px-5 py-3.5 text-left">Valid Till</th>
                  <th className="px-5 py-3.5 text-left">Status</th>
                  <th className="px-5 py-3.5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((coupon) => {
                  const expired = isExpired(coupon);
                  const active = coupon.is_active === 1 || coupon.is_active === "1" || coupon.is_active === true;
                  return (
                    <tr key={coupon.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg text-xs">
                          {coupon.coupon_code}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs max-w-[160px] truncate">{coupon.description || "—"}</td>
                      <td className="px-5 py-3.5 font-semibold text-[#04A9FF]">
                        {coupon.discount_type === "Percentage" || coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}%`
                          : `₹${parseFloat(coupon.discount_value).toLocaleString("en-IN")}`}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {coupon.minimum_order_value > 0
                          ? `₹${parseFloat(coupon.minimum_order_value).toLocaleString("en-IN")}`
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {coupon.used_count ?? 0}
                        {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""}
                      </td>
                      <td className="px-5 py-3.5">
                        {coupon.end_date ? (
                          <span className={`text-xs font-medium ${expired ? "text-red-500" : "text-gray-500"}`}>
                            {expired ? "Expired · " : ""}
                            {new Date(coupon.end_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-gray-400"}`} />
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setModal(coupon)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(coupon)}
                            disabled={deleting === coupon.id}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-60"
                          >
                            {deleting === coupon.id ? "..." : <FiTrash2 size={13} />}
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
        <CouponModal
          coupon={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </AdminLayout>
  );
}
