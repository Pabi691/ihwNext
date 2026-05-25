import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import {
  FiStar, FiPlus, FiTrash2, FiX, FiMapPin, FiCheck,
} from "react-icons/fi";

const BRANCHES = [
  "Salt Lake, Kolkata",
  "Behala, Kolkata",
  "Siliguri",
  "Bhubaneswar",
];

const RATINGS = [1, 2, 3, 4, 5];

const EMPTY_FORM = {
  branch: BRANCHES[0],
  reviewer_name: "",
  rating: 5,
  review_text: "",
  review_date: new Date().toISOString().split("T")[0],
  profile_photo: "",
};

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
          <FiStar
            size={24}
            className={
              s <= (hovered || value)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating, size = 13 }) {
  return (
    <div className="flex gap-0.5">
      {RATINGS.map((s) => (
        <FiStar
          key={s}
          size={size}
          className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, onDelete, deleting }) {
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
            <p className="text-xs text-gray-400 mt-1.5">
              {review.review_date
                ? new Date(review.review_date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : ""}
              {" · "}
              <span className="text-green-600 font-medium inline-flex items-center gap-0.5">
                <FiCheck size={10} /> Google Review
              </span>
            </p>
          </div>
        </div>
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
  );
}

export default function GmbReviews() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBranch, setActiveBranch] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const [formError, setFormError] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/v1/get_gmb_reviews");
      const data = res.data;
      const list = Array.isArray(data?.reviews)
        ? data.reviews
        : Array.isArray(data)
        ? data
        : [];
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.reviewer_name.trim()) return setFormError("Reviewer name is required.");
    if (!form.review_text.trim()) return setFormError("Review text is required.");

    setSubmitting(true);
    try {
      const res = await api("post", "/v1/create_gmb_review", form);
      const created = res.data?.review || { ...form, id: Date.now() };
      setReviews((prev) => [created, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      showToast("Review added successfully");
    } catch {
      setFormError("Failed to save review. Please try again.");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    setDeleting(id);
    try {
      await api("delete", `/v1/delete_gmb_review/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast("Review deleted");
    } catch {
      showToast("Failed to delete review", "error");
    }
    setDeleting(null);
  };

  const displayedReviews =
    activeBranch === "All"
      ? reviews
      : reviews.filter((r) => r.branch === activeBranch);

  if (!ready) return null;

  return (
    <AdminLayout title="GMB Reviews">
      <Head>
        <title>GMB Reviews — IHW Admin</title>
      </Head>

      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${
            toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-xs text-gray-400 mt-0.5">
            Add Google My Business reviews from your branches to display on the website
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setFormError(""); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <FiPlus size={15} /> Add GMB Review
        </button>
      </div>

      {/* Add Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Add Google Review</h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Branch */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Branch *
                </label>
                <select
                  value={form.branch}
                  onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-[#04A9FF]"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Reviewer Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Reviewer Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={form.reviewer_name}
                  onChange={(e) => setForm((f) => ({ ...f, reviewer_name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF]"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Rating *
                </label>
                <StarPicker
                  value={form.rating}
                  onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Review Text *
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste the customer's review from Google..."
                  value={form.review_text}
                  onChange={(e) => setForm((f) => ({ ...f, review_text: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] resize-none"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Review Date
                </label>
                <input
                  type="date"
                  value={form.review_date}
                  onChange={(e) => setForm((f) => ({ ...f, review_date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF]"
                />
              </div>

              {formError && (
                <p className="text-red-500 text-xs font-medium">{formError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#04A9FF] hover:bg-[#0070cc] text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save Review"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Branch Filter Tabs */}
      <div className="flex gap-1 overflow-x-auto mb-5 bg-white rounded-xl border border-gray-100 shadow-sm p-1">
        {["All", ...BRANCHES].map((branch) => {
          const count =
            branch === "All"
              ? reviews.length
              : reviews.filter((r) => r.branch === branch).length;
          return (
            <button
              key={branch}
              onClick={() => setActiveBranch(branch)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeBranch === branch
                  ? "bg-[#04A9FF] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {branch === "All" ? (
                "All Branches"
              ) : (
                <span className="flex items-center gap-1">
                  <FiMapPin size={10} /> {branch}
                </span>
              )}
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                  activeBranch === branch
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
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
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse"
            >
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
            <p className="text-gray-300 text-xs mt-1">Click "Add GMB Review" to get started</p>
          </div>
        ) : (
          displayedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={handleDelete}
              deleting={deleting}
            />
          ))
        )}
      </div>
    </AdminLayout>
  );
}
