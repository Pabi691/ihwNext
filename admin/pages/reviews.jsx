import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSearch, FiStar, FiCheck, FiX, FiTrash2 } from "react-icons/fi";

const TABS = ["All", "Pending", "Approved", "Rejected"];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar
          key={s}
          size={12}
          className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [actioning, setActioning] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_all_review");
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

  const getStatus = (r) => {
    if (r.status === "approved" || r.status === 1 || r.is_approved === 1) return "Approved";
    if (r.status === "rejected" || r.status === -1 || r.is_rejected === 1) return "Rejected";
    return "Pending";
  };

  const filtered = reviews.filter((r) => {
    const status = getStatus(r);
    const matchTab = tab === "All" || status === tab;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (r.customer_name || r.user_name || r.name || "").toLowerCase().includes(q) ||
      (r.product_name || r.product || "").toLowerCase().includes(q) ||
      (r.review || r.comment || "").toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

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
      }
    } catch {}
    setActioning(null);
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Reviews">
      <Head><title>Reviews — IHW Admin</title></Head>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or product..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#04A9FF] bg-white shadow-sm"
          />
        </div>
        <div className="text-sm text-gray-400 font-medium whitespace-nowrap">
          {filtered.length} review{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto mb-5 bg-white rounded-xl border border-gray-100 shadow-sm p-1">
        {TABS.map((t) => {
          const count = t === "All" ? reviews.length : reviews.filter((r) => getStatus(r) === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                tab === t ? "bg-[#04A9FF] text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t}
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${tab === t ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

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
            const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
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
                          "bg-yellow-50 text-yellow-700"
                        }`}>
                          {status}
                        </span>
                      </div>
                      {(review.product_name || review.product) && (
                        <p className="text-xs text-[#04A9FF] font-medium mt-0.5">
                          {review.product_name || review.product}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {review.review || review.comment || "No review text"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {status !== "Approved" && (
                      <button
                        onClick={() => action(review, "approve")}
                        disabled={actioning === `${review.id}-approve`}
                        className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors disabled:opacity-60"
                        title="Approve"
                      >
                        <FiCheck size={14} />
                      </button>
                    )}
                    {status !== "Rejected" && (
                      <button
                        onClick={() => action(review, "reject")}
                        disabled={actioning === `${review.id}-reject`}
                        className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 flex items-center justify-center transition-colors disabled:opacity-60"
                        title="Reject"
                      >
                        <FiX size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => action(review, "delete")}
                      disabled={actioning === `${review.id}-delete`}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-60"
                      title="Delete"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
}
