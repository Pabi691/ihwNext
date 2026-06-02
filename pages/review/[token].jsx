import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";

const API = process.env.NEXT_PUBLIC_API_URL;

function StarPicker({ value, onChange, disabled }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" disabled={disabled}
          onClick={() => !disabled && onChange(s)}
          onMouseEnter={() => !disabled && setHovered(s)}
          onMouseLeave={() => !disabled && setHovered(0)}
          className="focus:outline-none disabled:cursor-default"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
            className={`transition-colors ${s <= (hovered || value) ? "text-yellow-400" : "text-gray-200"}`}>
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ReviewPage() {
  const router = useRouter();
  const { token } = router.query;

  const [info, setInfo] = useState(null);          // { product_name, customer_name, customer_email }
  const [loadError, setLoadError] = useState("");
  const [infoLoading, setInfoLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) return;
    setInfoLoading(true);
    axios.get(`${API}/api/v1/review_link/${token}`)
      .then((res) => {
        if (res.data?.status) {
          setInfo(res.data);
          setName(res.data.customer_name || "");
          setEmail(res.data.customer_email || "");
        } else {
          setLoadError(res.data?.message || "Invalid review link.");
        }
      })
      .catch(() => setLoadError("Unable to load review. The link may be invalid or expired."))
      .finally(() => setInfoLoading(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!name.trim()) return setFormError("Please enter your name.");
    if (!email.trim()) return setFormError("Please enter your email.");
    if (rating === 0) return setFormError("Please select a star rating.");
    if (!reviewText.trim()) return setFormError("Please write a short review.");
    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/api/v1/review_link/${token}`, { name, email, rating, review_text: reviewText });
      if (res.data?.status) {
        setDone(true);
      } else {
        setFormError(res.data?.message || "Submission failed. Please try again.");
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <>
      <Head>
        <title>Leave a Review — IndianHairWorld</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">

          {/* Logo / Brand */}
          <div className="text-center mb-6">
            <p className="text-xl font-bold text-gray-800 tracking-tight">IndianHairWorld</p>
            <p className="text-sm text-gray-400 mt-1">Share your experience</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            {/* Loading state */}
            {infoLoading && (
              <div className="p-10 text-center">
                <div className="w-8 h-8 border-2 border-[#04A9FF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-400">Loading...</p>
              </div>
            )}

            {/* Error state */}
            {!infoLoading && loadError && (
              <div className="p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                </div>
                <p className="font-semibold text-gray-800 mb-1">Link Unavailable</p>
                <p className="text-sm text-gray-400">{loadError}</p>
              </div>
            )}

            {/* Success state */}
            {done && (
              <div className="p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="font-bold text-gray-800 text-lg mb-2">Thank you!</p>
                <p className="text-sm text-gray-500">Your review has been submitted and will appear after our team reviews it.</p>
              </div>
            )}

            {/* Review form */}
            {!infoLoading && !loadError && !done && info && (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-[#04A9FF] to-[#0070cc] px-6 py-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">You purchased</p>
                  <p className="font-bold text-lg leading-tight">{info.product_name}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Your Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
                    <p className="text-xs text-gray-400 mt-1">Must match the email used for your order.</p>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Your Rating</label>
                    <StarPicker value={rating} onChange={setRating} disabled={submitting} />
                    {rating > 0 && (
                      <p className="text-sm text-yellow-500 font-semibold mt-1.5">{ratingLabels[rating]}</p>
                    )}
                  </div>

                  {/* Review text */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Your Review</label>
                    <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                      rows={4} placeholder="Tell others about your experience with this product..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none" />
                  </div>

                  {formError && (
                    <p className="text-red-500 text-sm font-medium">{formError}</p>
                  )}

                  <button type="submit" disabled={submitting || rating === 0}
                    className="w-full py-3.5 bg-[#04A9FF] hover:bg-[#0070cc] disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm">
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">© IndianHairWorld. Your review will be visible after approval.</p>
        </div>
      </div>
    </>
  );
}
