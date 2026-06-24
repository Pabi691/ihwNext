import { useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiStar, FiCheck, FiX, FiTrash2, FiEdit2, FiPlus, FiMessageSquare } from "react-icons/fi";

const TABS = ["All", "Pending", "Approved", "Rejected", "Products"];
const PRODUCT_FILTERS = ["All Products", "Reviewed Products", "No Reviews Products"];
const EMPTY_FORM = { customer_name: "", product_id: "", product_name: "", rating: 5, review_text: "", status: "pending" };

/* ── helpers ── */
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar key={s} size={12} className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
          className="focus:outline-none">
          <FiStar size={22} className={s <= (hovered || value) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
        </button>
      ))}
    </div>
  );
}

function ProductDropdown({ value, onChange, products, reviewCounts = {} }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => { setQuery(value || ""); }, [value]);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = query.trim()
    ? products.filter((p) => p.prod_name.toLowerCase().includes(query.toLowerCase()))
    : products;

  const handleSelect = (p) => { setQuery(p.prod_name); onChange({ id: p.id, name: p.prod_name }); setOpen(false); };
  const handleChange = (e) => { setQuery(e.target.value); if (!e.target.value) onChange({ id: "", name: "" }); setOpen(true); };

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input type="text" value={query} onChange={handleChange} onFocus={() => setOpen(true)}
          placeholder="Search product..."
          className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-sm outline-none focus:border-[#04A9FF]" />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {filtered.slice(0, 30).map((p) => {
            const cnt = reviewCounts[p.id] || 0;
            return (
              <button key={p.id} type="button" onMouseDown={() => handleSelect(p)}
                className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#04A9FF] transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center justify-between gap-2">
                <span>{p.prod_name}</span>
                {cnt > 0 && (
                  <span className="text-xs font-semibold bg-blue-50 text-[#04A9FF] rounded-full px-2 py-0.5 flex-shrink-0">
                    {cnt} review{cnt !== 1 ? "s" : ""}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
      {open && query.trim() && filtered.length === 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-3 text-sm text-gray-400">
          No products found
        </div>
      )}
    </div>
  );
}

/* ── infinite marquee slider ── */
function ProductMarquee({ products, direction = "left", reviewCounts = {}, onSelect, speed = 35 }) {
  if (!products.length) return null;
  const doubled = [...products, ...products];
  const animName = direction === "left" ? "marqueeLeft" : "marqueeRight";

  return (
    <div className="overflow-hidden cursor-pointer select-none">
      <div
        style={{ display: "flex", gap: "12px", width: "max-content",
          animation: `${animName} ${speed}s linear infinite` }}
      >
        {doubled.map((p, i) => {
          const cnt = reviewCounts[p.id] || 0;
          return (
            <button
              key={`${p.id}-${i}`}
              type="button"
              onClick={() => onSelect(p)}
              className="flex-shrink-0 w-28 sm:w-40 bg-white rounded-2xl border border-gray-100 shadow-sm p-2 hover:border-[#04A9FF] hover:shadow-md transition-all group text-left"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2 flex items-center justify-center">
                {p.primary_img ? (
                  <img
                    src={p.primary_img}
                    alt={p.prod_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
                  />
                ) : null}
                <div
                  className="w-full h-full bg-gradient-to-br from-[#04A9FF]/10 to-[#0070cc]/10 flex items-center justify-center"
                  style={{ display: p.primary_img ? "none" : "flex" }}
                >
                  <span className="text-lg font-bold text-[#04A9FF]/40">
                    {p.prod_name?.[0]?.toUpperCase() || "P"}
                  </span>
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-700 truncate leading-tight">{p.prod_name}</p>
              <p className="text-xs mt-0.5">
                {cnt > 0
                  ? <span className="text-[#04A9FF] font-medium">{cnt} review{cnt !== 1 ? "s" : ""}</span>
                  : <span className="text-gray-300">No reviews</span>}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── main page ── */
export default function Reviews() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [actioning, setActioning] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [productFilter, setProductFilter] = useState("All Products");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [allCategories, setAllCategories] = useState([]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_all_review");
      const data = res.data;
      setReviews(Array.isArray(data?.reviews) ? data.reviews : Array.isArray(data) ? data : []);
    } catch { setReviews([]); }
    setLoading(false);
  }, [api]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api("get", "/get_products");
      setProducts(Array.isArray(res.data?.productList) ? res.data.productList : []);
    } catch { setProducts([]); }
  }, [api]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api("get", "/get_all_categories");
      setAllCategories(Array.isArray(res.data?.categoryList) ? res.data.categoryList : []);
    } catch { setAllCategories([]); }
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchReviews();
    fetchProducts();
    fetchCategories();
  }, [ready, fetchReviews, fetchProducts, fetchCategories]);

  const getStatus = (r) => {
    if (r.status === "approved" || r.status === 1 || r.is_approved === 1) return "Approved";
    if (r.status === "rejected" || r.status === -1 || r.is_rejected === 1) return "Rejected";
    return "Pending";
  };

  const getProductName = (r) => {
    const p = r.product_name || r.product;
    if (!p) return "";
    if (typeof p === "object") return p.prod_name || p.name || "";
    return p;
  };

  const getReviewText = (r) => r.review || r.comment || r.review_text || "";

  const reviewCounts = reviews.reduce((acc, r) => {
    const id = r.product_id || (typeof r.product === "object" ? r.product?.id : null);
    if (id) acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  const filtered = reviews.filter((r) => {
    if (!r || typeof r !== "object") return false;
    const matchTab = tab === "All" || tab === "Products" || getStatus(r) === tab;
    const q = search.toLowerCase();
    return matchTab && (!q ||
      (r.customer_name || r.user_name || r.name || "").toLowerCase().includes(q) ||
      getProductName(r).toLowerCase().includes(q) ||
      getReviewText(r).toLowerCase().includes(q));
  });

  const visibleProductsForTab = (() => {
    let list = products;
    if (productFilter === "Reviewed Products") list = list.filter((p) => !!reviewCounts[p.id]);
    if (productFilter === "No Reviews Products") list = list.filter((p) => !reviewCounts[p.id]);
    if (categoryFilter) list = list.filter((p) =>
      (p.product_categories || []).some((c) => c.category_name === categoryFilter)
    );
    const q = search.toLowerCase();
    if (q) list = list.filter((p) => p.prod_name.toLowerCase().includes(q));
    return list;
  })();

  const counts = {
    total: reviews.length,
    pending: reviews.filter((r) => getStatus(r) === "Pending").length,
    approved: reviews.filter((r) => getStatus(r) === "Approved").length,
    rejected: reviews.filter((r) => getStatus(r) === "Rejected").length,
  };

  /* split products into 3 bands of up to 15 each; fall back to all if too few */
  const band = (idx) => {
    const s = products.slice(idx * 15, idx * 15 + 15);
    return s.length >= 3 ? s : products.slice(0, 15);
  };

  const action = async (review, type) => {
    setActioning(`${review.id}-${type}`);
    try {
      if (type === "approve") {
        await api("put", `/update_review_status/${review.id}/1`);
        setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, status: "approved", is_approved: 1 } : r));
      } else if (type === "reject") {
        await api("put", `/update_review_status/${review.id}/0`);
        setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, status: "rejected", is_rejected: 1 } : r));
      } else if (type === "delete") {
        if (!window.confirm("Delete this review? This cannot be undone.")) return;
        await api("delete", `/delete_review/${review.id}`);
        setReviews((prev) => prev.filter((r) => r.id !== review.id));
        showToast("Review deleted");
      }
    } catch { showToast("Action failed", "error"); }
    setActioning(null);
  };

  const openAddForm = (prefill = null) => {
    setEditReview(null);
    setFormData(prefill ? { ...EMPTY_FORM, product_id: prefill.id, product_name: prefill.prod_name } : EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (review) => {
    setEditReview(review);
    setFormData({
      customer_name: review.customer_name || review.user_name || review.name || "",
      product_id: review.product_id || "",
      product_name: getProductName(review),
      rating: review.rating || review.stars || 5,
      review_text: getReviewText(review),
      status: getStatus(review).toLowerCase(),
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formData.customer_name.trim()) return setFormError("Customer name is required.");
    if (!formData.review_text.trim()) return setFormError("Review text is required.");
    if (!editReview && !formData.product_id) return setFormError("Please select a product.");
    setSubmitting(true);
    try {
      const isApproved = formData.status === "approved" ? 1 : 0;
      const payload = {
        name: formData.customer_name,
        rating: formData.rating,
        review_text: formData.review_text,
        is_approved: isApproved,
      };
      if (editReview) {
        const res = await api("put", `/update_review/${editReview.id}`, payload);
        const updated = { ...editReview, ...(res.data?.reviewData || {}), ...payload };
        setReviews((prev) => prev.map((r) => r.id === editReview.id ? updated : r));
        showToast("Review updated");
      } else {
        const res = await api("post", `/create_review/${formData.product_id}`, payload);
        const created = res.data?.reviewData || { ...payload, id: Date.now(), product_id: formData.product_id };
        setReviews((prev) => [created, ...prev]);
        showToast("Review added");
      }
      setShowForm(false);
    } catch { setFormError("Failed to save. Please try again."); }
    setSubmitting(false);
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Reviews">
      <Head><title>Reviews — IHW Admin</title></Head>

      {/* keyframes */}
      <style>{`
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.msg}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{editReview ? "Edit Review" : "Add Review"}</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <FiX size={16} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Customer Name *</label>
                <input type="text" placeholder="e.g. Priya Sharma" value={formData.customer_name}
                  onChange={(e) => setFormData((f) => ({ ...f, customer_name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product <span className="text-gray-400 font-normal">(optional)</span></label>
                <ProductDropdown
                  value={formData.product_name}
                  products={products}
                  reviewCounts={reviewCounts}
                  onChange={({ id, name }) => setFormData((f) => ({ ...f, product_id: id, product_name: name }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rating *</label>
                <StarPicker value={formData.rating} onChange={(v) => setFormData((f) => ({ ...f, rating: v }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Review Text *</label>
                <textarea rows={4} placeholder="Customer's review..." value={formData.review_text}
                  onChange={(e) => setFormData((f) => ({ ...f, review_text: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                <select value={formData.status} onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-[#04A9FF]">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              {formError && <p className="text-red-500 text-xs font-medium">{formError}</p>}
              <button type="submit" disabled={submitting}
                className="w-full py-3 bg-[#04A9FF] hover:bg-[#0070cc] text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-60">
                {submitting ? "Saving..." : editReview ? "Update Review" : "Add Review"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Reviews", value: counts.total, color: "text-[#04A9FF]", bg: "bg-blue-50" },
          { label: "Pending", value: counts.pending, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Approved", value: counts.approved, color: "text-green-600", bg: "bg-green-50" },
          { label: "Rejected", value: counts.rejected, color: "text-red-500", bg: "bg-red-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <FiMessageSquare size={18} className={s.color} />
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Product sliders — click to add review */}
      {products.length > 0 && (
        <div className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-hidden">
          <p className="text-xs font-semibold text-gray-500 mb-3">
            Click any product to add a review for it
          </p>
          <div className="space-y-3">
            <ProductMarquee products={band(0)} direction="left"  speed={40} reviewCounts={reviewCounts} onSelect={(p) => openAddForm(p)} />
            <ProductMarquee products={band(1)} direction="right" speed={32} reviewCounts={reviewCounts} onSelect={(p) => openAddForm(p)} />
            <ProductMarquee products={band(2)} direction="left"  speed={45} reviewCounts={reviewCounts} onSelect={(p) => openAddForm(p)} />
          </div>
        </div>
      )}

      {/* Search + Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or product..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm" />
        </div>
        <button onClick={() => openAddForm()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap">
          <FiPlus size={15} /> Add Review
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto mb-5 bg-white rounded-xl border border-gray-100 shadow-sm p-1">
        {TABS.map((t) => {
          const count = t === "All" ? reviews.length
            : t === "Products" ? products.length
            : reviews.filter((r) => getStatus(r) === t).length;
          return (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                tab === t ? "bg-[#04A9FF] text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
              {t}
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${tab === t ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Products Tab */}
      {tab === "Products" ? (
        <>
          {/* Sub-filters */}
          <div className="flex gap-1 overflow-x-auto mb-3 bg-white rounded-xl border border-gray-100 shadow-sm p-1">
            {PRODUCT_FILTERS.map((f) => {
              const count = f === "All Products" ? products.length
                : f === "Reviewed Products" ? products.filter((p) => !!reviewCounts[p.id]).length
                : products.filter((p) => !reviewCounts[p.id]).length;
              return (
                <button key={f} onClick={() => setProductFilter(f)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    productFilter === f ? "bg-[#04A9FF] text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                  {f}
                  <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${productFilter === f ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category filter */}
          {allCategories.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto mb-4 pb-1">
              <button onClick={() => setCategoryFilter("")}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === "" ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                All Categories
              </button>
              {allCategories.map((cat) => (
                <button key={cat.id} onClick={() => setCategoryFilter(cat.category_name === categoryFilter ? "" : cat.category_name)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    categoryFilter === cat.category_name ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                  {cat.category_name}
                </button>
              ))}
            </div>
          )}

          {/* Product grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 animate-pulse">
                  <div className="w-full aspect-square rounded-xl bg-gray-100 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-7 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : visibleProductsForTab.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center text-gray-400 text-sm">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {visibleProductsForTab.map((p) => {
                const cnt = reviewCounts[p.id] || 0;
                return (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col group hover:border-[#04A9FF] hover:shadow-md transition-all">
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3 flex items-center justify-center">
                      {p.primary_img ? (
                        <img src={p.primary_img} alt={p.prod_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} />
                      ) : null}
                      <div className="w-full h-full bg-gradient-to-br from-[#04A9FF]/10 to-[#0070cc]/10 flex items-center justify-center"
                        style={{ display: p.primary_img ? "none" : "flex" }}>
                        <span className="text-2xl font-bold text-[#04A9FF]/30">{p.prod_name?.[0]?.toUpperCase() || "P"}</span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-700 leading-tight line-clamp-2 mb-1 flex-1">{p.prod_name}</p>
                    {cnt > 0
                      ? <p className="text-xs text-[#04A9FF] font-medium mb-2">{cnt} review{cnt !== 1 ? "s" : ""}</p>
                      : <p className="text-xs text-gray-300 mb-2">No reviews yet</p>}
                    <button onClick={() => openAddForm(p)}
                      className="w-full py-1.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1">
                      <FiPlus size={12} /> Add Review
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
      /* Review Cards */
      <div className="space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center text-gray-400 text-sm">
            No reviews found
          </div>
        ) : (
          filtered.map((review) => {
            const status = getStatus(review);
            const name = review.customer_name || review.user_name || review.name || "Anonymous";
            const initials = name.split(" ").filter(Boolean).map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "??";
            const reviewText = getReviewText(review);
            return (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#04A9FF] to-[#0070cc] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm">{name}</p>
                        <StarRating rating={review.rating || review.stars || 0} />
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                          status === "Approved" ? "bg-green-50 text-green-700" :
                          status === "Rejected" ? "bg-red-50 text-red-600" :
                          "bg-yellow-50 text-yellow-700"}`}>
                          {status}
                        </span>
                      </div>
                      {getProductName(review) && (
                        <p className="text-xs text-[#04A9FF] font-medium mt-0.5">{getProductName(review)}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {reviewText || <span className="text-gray-400 italic">No review text</span>}
                      </p>
                      {Array.isArray(review.images) && review.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {review.images.map((img, i) => {
                            const url = typeof img === "string" ? img : img.image_url;
                            return (
                              <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={url}
                                  alt=""
                                  className="w-16 h-16 object-cover rounded-xl border border-gray-100 shadow-sm hover:opacity-80 transition-opacity"
                                />
                              </a>
                            );
                          })}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-1.5">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => openEditForm(review)}
                      className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 flex items-center justify-center transition-colors" title="Edit">
                      <FiEdit2 size={13} />
                    </button>
                    {status !== "Approved" && (
                      <button onClick={() => action(review, "approve")} disabled={actioning === `${review.id}-approve`}
                        className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors disabled:opacity-60" title="Approve">
                        <FiCheck size={14} />
                      </button>
                    )}
                    {status !== "Rejected" && (
                      <button onClick={() => action(review, "reject")} disabled={actioning === `${review.id}-reject`}
                        className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 flex items-center justify-center transition-colors disabled:opacity-60" title="Reject">
                        <FiX size={14} />
                      </button>
                    )}
                    <button onClick={() => action(review, "delete")} disabled={actioning === `${review.id}-delete`}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-60" title="Delete">
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      )}
    </AdminLayout>
  );
}
