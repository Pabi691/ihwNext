import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiPlus, FiSearch, FiTrash2, FiX, FiAlertCircle, FiLock, FiGlobe } from "react-icons/fi";

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
  is_private: false,
  assigned_customer_email: "",
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
          is_private: !!(coupon.is_private == 1 || coupon.is_private === true),
          assigned_customer_email: coupon.assigned_customer_email || "",
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
    await onSave(form, setError);
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {/* Private coupon toggle */}
          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
            <button
              type="button"
              onClick={() => set("is_private", !form.is_private)}
              className={`flex items-center justify-between w-full`}
            >
              <div className="flex items-center gap-2.5">
                {form.is_private ? <FiLock size={15} className="text-purple-500" /> : <FiGlobe size={15} className="text-gray-400" />}
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">{form.is_private ? "Private Coupon" : "Public Coupon"}</p>
                  <p className="text-xs text-gray-400">{form.is_private ? "Only the assigned customer can use this" : "Anyone can apply this coupon code"}</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 ${form.is_private ? "bg-purple-500" : "bg-gray-200"}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow mt-0.5 transition-transform ${form.is_private ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </button>

            {form.is_private && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">
                  Assigned Customer Email <span className="text-gray-400 font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="email"
                  value={form.assigned_customer_email}
                  onChange={(e) => set("assigned_customer_email", e.target.value.toLowerCase())}
                  placeholder="Leave empty to allow anyone with the code"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-400 transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">If set, only this customer can use the coupon.</p>
              </div>
            )}
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
  const [toggling, setToggling] = useState(null);

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

  const handleSave = async (form, setError) => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        is_private: form.is_private ? 1 : 0,
        assigned_customer_email: form.is_private ? (form.assigned_customer_email || "") : "",
      };
      const res = form.id
        ? await api("post", `/update_coupon/${form.id}`, payload)
        : await api("post", "/create_coupon", payload);
      if (res?.data?.status === false) {
        setError?.(res.data.message || "Failed to save coupon.");
        setSaving(false);
        return;
      }
      await fetchCoupons();
      setModal(null);
    } catch {
      setError?.("Something went wrong. Please try again.");
    }
    setSaving(false);
  };

  const handleToggleStatus = async (coupon) => {
    const newStatus = (coupon.is_active === 1 || coupon.is_active === "1" || coupon.is_active === true) ? 0 : 1;
    setToggling(coupon.id);
    try {
      await api("get", `/update_coupon_status/${coupon.id}/${newStatus}`);
      setCoupons((prev) => prev.map((c) => c.id === coupon.id ? { ...c, is_active: newStatus } : c));
    } catch {}
    setToggling(null);
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
          <div>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                    <th className="px-5 py-3.5 text-left">Code</th>
                    <th className="px-5 py-3.5 text-left">Description</th>
                    <th className="px-5 py-3.5 text-left">Type</th>
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
                          <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg text-xs">{coupon.coupon_code}</span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 text-xs max-w-[160px] truncate">
                          {coupon.description || "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          {(coupon.is_private == 1 || coupon.is_private === true) ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700">
                                <FiLock size={10} /> Private
                              </span>
                              {coupon.assigned_customer_email && (
                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[140px]">{coupon.assigned_customer_email}</p>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-600">
                              <FiGlobe size={10} /> Public
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-[#04A9FF]">
                          {coupon.discount_type === "Percentage" || coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `₹${parseFloat(coupon.discount_value).toLocaleString("en-IN")}`}
                        </td>
                        <td className="px-5 py-3.5 text-gray-500">{coupon.minimum_order_value > 0 ? `₹${parseFloat(coupon.minimum_order_value).toLocaleString("en-IN")}` : "—"}</td>
                        <td className="px-5 py-3.5 text-gray-500">{coupon.used_count ?? 0}{coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""}</td>
                        <td className="px-5 py-3.5">
                          {coupon.end_date ? (
                            <span className={`text-xs font-medium ${expired ? "text-red-500" : "text-gray-500"}`}>{expired ? "Expired · " : ""}{new Date(coupon.end_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                          ) : (<span className="text-xs text-gray-400">—</span>)}
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => handleToggleStatus(coupon)}
                            disabled={toggling === coupon.id}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60 ${active ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-gray-400"}`} />
                            {toggling === coupon.id ? "..." : active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setModal(coupon)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Edit</button>
                            <button onClick={() => handleDelete(coupon)} disabled={deleting === coupon.id} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-60">
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

            {/* Mobile card view */}
            <div className="lg:hidden divide-y divide-gray-50">
              {filtered.map((coupon) => {
                const expired = isExpired(coupon);
                const active = coupon.is_active === 1 || coupon.is_active === "1" || coupon.is_active === true;
                return (
                  <div key={coupon.id} className="px-4 py-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg text-xs">{coupon.coupon_code}</span>
                      <span className="font-semibold text-[#04A9FF] text-sm">
                        {coupon.discount_type === "Percentage" || coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `₹${parseFloat(coupon.discount_value).toLocaleString("en-IN")}`}
                      </span>
                    </div>
                    {coupon.description && <p className="text-xs text-gray-500 truncate mb-1">{coupon.description}</p>}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <button
                        onClick={() => handleToggleStatus(coupon)}
                        disabled={toggling === coupon.id}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-60 ${active ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                      >
                        <span className={`w-1 h-1 rounded-full ${active ? "bg-green-400" : "bg-gray-400"}`} />
                        {toggling === coupon.id ? "..." : active ? "Active" : "Off"}
                      </button>
                      {(coupon.is_private == 1 || coupon.is_private === true) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700">
                          <FiLock size={10} /> Private
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-600">
                          <FiGlobe size={10} /> Public
                        </span>
                      )}
                      {coupon.end_date && (
                        <span className={`text-xs font-medium ${expired ? "text-red-500" : "text-gray-400"}`}>
                          {expired ? "Expired" : "Till "}{new Date(coupon.end_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </span>
                      )}
                      {coupon.minimum_order_value > 0 && <span className="text-xs text-gray-400">Min ₹{parseFloat(coupon.minimum_order_value).toLocaleString("en-IN")}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(coupon)} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-600">Edit</button>
                      <button onClick={() => handleDelete(coupon)} disabled={deleting === coupon.id} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 disabled:opacity-60">
                        {deleting === coupon.id ? "..." : <FiTrash2 size={13} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
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
