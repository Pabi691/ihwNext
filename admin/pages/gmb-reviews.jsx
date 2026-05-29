import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiStar, FiPlus, FiTrash2, FiX, FiMapPin, FiCheck, FiLink, FiEdit2 } from "react-icons/fi";

const BRANCHES = ["Salt Lake, Kolkata", "Lake Garden, Kolkata", "Siliguri", "Durgapur"];
const RATINGS = [1, 2, 3, 4, 5];

const EMPTY_FORM = {
  branch: BRANCHES[0],
  reviewer_name: "",
  rating: 5,
  review_text: "",
  review_date: new Date().toISOString().split("T")[0],
  profile_photo: "",
  source_url: "",
};

function getSourceInfo(url) {
  if (!url) return null;
  if (url.includes("google.com") || url.includes("maps.google") || url.includes("goo.gl"))
    return { label: "Google Review", color: "text-green-600", bg: "bg-green-50" };
  if (url.includes("justdial.com"))
    return { label: "JustDial", color: "text-orange-600", bg: "bg-orange-50" };
  return { label: "External Review", color: "text-blue-600", bg: "bg-blue-50" };
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {RATINGS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <FiStar size={24} className={s <= (hovered || value) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating, size = 13 }) {
  return (
    <div className="flex gap-0.5">
      {RATINGS.map((s) => (
        <FiStar key={s} size={size} className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
      ))}
    </div>
  );
}

function ReviewCard({ review, onDelete, onEdit, deleting }) {
  const src = getSourceInfo(review.source_url);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#04A9FF] to-[#0070cc] flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
            {review.reviewer_name?.[0]?.toUpperCase() || "G"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-800 text-sm">{review.reviewer_name}</p>
              <StarDisplay rating={review.rating} />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <FiMapPin size={11} className="text-gray-400 flex-shrink-0" />
              <p className="text-xs text-[#04A9FF] font-medium">{review.branch}</p>
            </div>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.review_text}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <p className="text-xs text-gray-400">
                {review.review_date
                  ? new Date(review.review_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                  : ""}
              </p>
              {src ? (
                review.source_url ? (
                  <a
                    href={review.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${src.color} ${src.bg} hover:underline`}
                  >
                    <FiCheck size={10} /> {src.label}
                  </a>
                ) : (
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${src.color} ${src.bg}`}>
                    <FiCheck size={10} /> {src.label}
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md text-gray-500 bg-gray-50">
                  <FiCheck size={10} /> Manual Entry
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(review)}
            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="Edit"
          >
            <FiEdit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(review.id)}
            disabled={deleting === review.id}
            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0 disabled:opacity-50"
            title="Delete"
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GmbReviews() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBranch, setActiveBranch] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [modalTab, setModalTab] = useState("manual"); // "manual" | "url"
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const [formError, setFormError] = useState("");

  // URL import state
  const [importUrl, setImportUrl] = useState("");
  const [importBranch, setImportBranch] = useState(BRANCHES[0]);
  const [importing, setImporting] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_gmb_reviews");
      const data = res.data;
      const list = Array.isArray(data?.reviews) ? data.reviews : Array.isArray(data) ? data : [];
      setReviews(list);
    } catch {
      setReviews([]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchReviews();
  }, [ready, fetchReviews]);

  const openAddForm = () => {
    setEditReview(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setImportUrl("");
    setModalTab("manual");
    setShowForm(true);
  };

  const openEditForm = (review) => {
    setEditReview(review);
    setForm({
      branch: review.branch || BRANCHES[0],
      reviewer_name: review.reviewer_name || "",
      rating: review.rating || 5,
      review_text: review.review_text || "",
      review_date: review.review_date || new Date().toISOString().split("T")[0],
      profile_photo: review.profile_photo || "",
      source_url: review.source_url || "",
    });
    setFormError("");
    setModalTab("manual");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.reviewer_name.trim()) return setFormError("Reviewer name is required.");
    if (!form.review_text.trim()) return setFormError("Review text is required.");
    setSubmitting(true);
    try {
      if (editReview) {
        const res = await api("put", `/update_gmb_review/${editReview.id}`, form);
        const updated = res.data?.review || { ...editReview, ...form };
        setReviews((prev) => prev.map((r) => r.id === editReview.id ? updated : r));
        showToast("Review updated");
      } else {
        const res = await api("post", "/create_gmb_review", form);
        const created = res.data?.review || { ...form, id: Date.now() };
        setReviews((prev) => [created, ...prev]);
        showToast("Review added successfully");
      }
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch {
      setFormError("Failed to save review. Please try again.");
    }
    setSubmitting(false);
  };

  const handleImportFromUrl = async () => {
    setFormError("");
    if (!importUrl.trim()) return setFormError("Please paste a review page URL.");
    const urlLower = importUrl.toLowerCase();
    const isKnown = urlLower.includes("google.com") || urlLower.includes("maps.google") || urlLower.includes("goo.gl") || urlLower.includes("justdial.com");
    if (!isKnown) return setFormError("Only Google Maps and JustDial URLs are supported.");
    setImporting(true);
    try {
      const res = await api("post", "/import_gmb_reviews_from_url", { url: importUrl, branch: importBranch });
      const imported = Array.isArray(res.data?.reviews) ? res.data.reviews : [];
      if (imported.length === 0) {
        setFormError(res.data?.message || "No reviews could be imported. Check server logs for details.");
      } else {
        setReviews((prev) => [...imported, ...prev]);
        setShowForm(false);
        setImportUrl("");
        showToast(`${imported.length} review(s) imported`);
      }
    } catch {
      setFormError("Import failed. The backend may not support this URL yet. Try adding the review manually.");
    }
    setImporting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    setDeleting(id);
    try {
      await api("delete", `/delete_gmb_review/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast("Review deleted");
    } catch {
      showToast("Failed to delete review", "error");
    }
    setDeleting(null);
  };

  const displayedReviews =
    activeBranch === "All" ? reviews : reviews.filter((r) => r.branch === activeBranch);

  if (!ready) return null;

  return (
    <AdminLayout title="GMB Reviews">
      <Head><title>GMB Reviews — IHW Admin</title></Head>

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.msg}
        </div>
      )}

      {/* Modal */}
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

            {/* Tabs — only show on Add */}
            {!editReview && (
              <div className="flex border-b border-gray-100 px-6">
                <button
                  onClick={() => { setModalTab("manual"); setFormError(""); }}
                  className={`py-3 px-1 mr-5 text-sm font-semibold border-b-2 transition-colors ${modalTab === "manual" ? "border-[#04A9FF] text-[#04A9FF]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                >
                  Manual Entry
                </button>
                <button
                  onClick={() => { setModalTab("url"); setFormError(""); }}
                  className={`py-3 px-1 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${modalTab === "url" ? "border-[#04A9FF] text-[#04A9FF]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                >
                  <FiLink size={13} /> Import from URL
                </button>
              </div>
            )}

            {/* Import from URL Tab */}
            {modalTab === "url" && !editReview ? (
              <div className="p-6 space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Paste a <strong>Google Maps</strong> or <strong>JustDial</strong> review page URL. The backend will fetch and import the reviews automatically.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Review Page URL *</label>
                  <input
                    type="url"
                    placeholder="https://www.justdial.com/... or https://maps.google.com/..."
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF]"
                  />
                  {importUrl && getSourceInfo(importUrl) && (
                    <p className={`text-xs font-semibold mt-1.5 ${getSourceInfo(importUrl).color}`}>
                      Detected: {getSourceInfo(importUrl).label}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Assign to Branch *</label>
                  <select
                    value={importBranch}
                    onChange={(e) => setImportBranch(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-[#04A9FF]"
                  >
                    {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                {formError && <p className="text-red-500 text-xs font-medium">{formError}</p>}
                <button
                  type="button"
                  onClick={handleImportFromUrl}
                  disabled={importing}
                  className="w-full py-3 bg-[#04A9FF] hover:bg-[#0070cc] text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <FiLink size={14} />
                  {importing ? "Importing..." : "Import Reviews"}
                </button>
              </div>
            ) : (
              /* Manual Entry Form */
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Branch *</label>
                  <select
                    value={form.branch}
                    onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-[#04A9FF]"
                  >
                    {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Reviewer Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={form.reviewer_name}
                    onChange={(e) => setForm((f) => ({ ...f, reviewer_name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rating *</label>
                  <StarPicker value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Review Text *</label>
                  <textarea
                    rows={4}
                    placeholder="Paste the customer's review..."
                    value={form.review_text}
                    onChange={(e) => setForm((f) => ({ ...f, review_text: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Review Date</label>
                  <input
                    type="date"
                    value={form.review_date}
                    onChange={(e) => setForm((f) => ({ ...f, review_date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Source URL <span className="text-gray-400 font-normal">(Google / JustDial link)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/... or https://justdial.com/..."
                    value={form.source_url}
                    onChange={(e) => setForm((f) => ({ ...f, source_url: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF]"
                  />
                  {form.source_url && getSourceInfo(form.source_url) && (
                    <p className={`text-xs font-semibold mt-1.5 ${getSourceInfo(form.source_url).color}`}>
                      Source: {getSourceInfo(form.source_url).label}
                    </p>
                  )}
                </div>
                {formError && <p className="text-red-500 text-xs font-medium">{formError}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#04A9FF] hover:bg-[#0070cc] text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-60"
                >
                  {submitting ? "Saving..." : editReview ? "Update Review" : "Save Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <p className="text-xs text-gray-400">
          Add Google My Business or JustDial reviews from your branches to display on the website
        </p>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <FiPlus size={15} /> Add Review
        </button>
      </div>

      {/* Branch Filter */}
      <div className="flex gap-1 overflow-x-auto mb-5 bg-white rounded-xl border border-gray-100 shadow-sm p-1">
        {["All", ...BRANCHES].map((branch) => {
          const count = branch === "All" ? reviews.length : reviews.filter((r) => r.branch === branch).length;
          return (
            <button
              key={branch}
              onClick={() => setActiveBranch(branch)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeBranch === branch ? "bg-[#04A9FF] text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {branch === "All" ? "All Branches" : (
                <span className="flex items-center gap-1"><FiMapPin size={10} /> {branch}</span>
              )}
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${activeBranch === branch ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))
        ) : displayedReviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
            <FiStar size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">No reviews yet for this branch</p>
            <p className="text-gray-300 text-xs mt-1">Click "Add Review" to get started</p>
          </div>
        ) : (
          displayedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={handleDelete}
              onEdit={openEditForm}
              deleting={deleting}
            />
          ))
        )}
      </div>
    </AdminLayout>
  );
}
