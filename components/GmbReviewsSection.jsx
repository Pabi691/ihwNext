import React, { useState } from "react";
import { BiSolidStar, BiStar } from "react-icons/bi";
import { FaGoogle } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

const SHOW_INITIAL = 3;

const StarRow = ({ rating }) => (
  <span className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) =>
      i < rating
        ? <BiSolidStar key={i} className="text-yellow-400 text-xs" />
        : <BiStar key={i} className="text-gray-300 text-xs" />
    )}
  </span>
);

const GmbReviewsSection = ({ reviews }) => {
  const [showAll, setShowAll] = useState(false);

  if (!reviews || reviews.length === 0) return null;

  const visible = showAll ? reviews : reviews.slice(0, SHOW_INITIAL);

  return (
    <div className="p-4 border-b">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FaGoogle className="text-[#4285F4] text-lg" />
        <h2 className="text-lg font-medium">Google Reviews</h2>
      </div>

      <div className="space-y-4">
        {visible.map((review, i) => (
          <div key={i} className="flex gap-3 border-b pb-4 last:border-none">
            {review.profile_photo ? (
              <img
                src={review.profile_photo}
                alt={review.reviewer_name}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
              />
            ) : null}
            <FaUserCircle
              className="text-gray-400 text-3xl flex-shrink-0"
              style={{ display: review.profile_photo ? "none" : "block" }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="font-medium text-gray-800 text-sm">{review.reviewer_name}</p>
                <span className="text-xs text-gray-400">
                  {review.review_date
                    ? new Date(review.review_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 mb-1">
                <StarRow rating={review.rating} />
                <span className="text-xs text-gray-500">{review.branch}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{review.review_text}</p>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > SHOW_INITIAL && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-[#04A9FF] text-sm mt-3"
        >
          {showAll ? "Show Less" : `View All ${reviews.length} Google Reviews`}
        </button>
      )}
    </div>
  );
};

export default GmbReviewsSection;
