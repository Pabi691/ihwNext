import React, { useState } from "react";
import { BiSolidStar, BiSolidStarHalf, BiStar } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { AiFillSafetyCertificate } from "react-icons/ai";

const ReviewRatingComments = ({ reviews, overallRating, totalRatings, ratingBreakdown }) => {

  const [openReviews, setOpenReviews] = useState(false);
  // console.log('reviews', reviews);
  // console.log('overallRating', overallRating);
  // console.log('totalRatings', totalRatings);
  // console.log('ratingBreakdown', ratingBreakdown);
  return (
    <div className="p-4">
      {/* Overall Rating Section */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">User Reviews & Ratings</h2>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <p className="text-4xl font-medium text-gray-800">{overallRating}</p>
            <p className="text-sm text-gray-500 my-3">{totalRatings} ratings</p>
            <div className="flex items-center text-yellow-500">
              {Array.from({ length: Math.floor(overallRating) }, (_, i) => (
                // <FaStar key={i} />
                <BiSolidStar key={i} />
              ))}
              {overallRating % 1 !== 0 && <BiSolidStarHalf />}
              {Array.from({ length: 5 - Math.ceil(overallRating) }, (_, i) => (
                <BiStar key={i + 10} className="text-gray-300" />
              ))}
            </div>
          </div>
          <div className="flex-1">
            {Object.keys(ratingBreakdown).reverse().map((rating, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <p className="text-gray-800 font-medium">{rating}</p>
                <div className="flex-1 bg-gray-200 rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-1 rounded-full ${(ratingBreakdown[rating] / totalRatings) * 100 > 50
                        ? "bg-green-700"
                        : (ratingBreakdown[rating] / totalRatings) * 100 > 30
                          ? "bg-green-300"
                          : "bg-yellow-300"
                      }`}
                    style={{
                      width: `${(ratingBreakdown[rating] / totalRatings) * 100}%`,
                    }}
                  ></div>

                </div>
                <p className="text-gray-600 text-sm">{`(${ratingBreakdown[rating]})`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Reviews Section */}
      {reviews && reviews.length > 0 ? (
        (openReviews ? reviews : reviews.slice(0, 3)).map((review, index) => (
            <div key={index} className="mb-6 border-b pb-4 last:border-none">
              <div className="flex items-center gap-4 mb-2">
                <FaUserCircle className="text-gray-500 text-3xl" />
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">{review.name}</h4>
                  <div className="flex items-center text-black">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <BiSolidStar key={i} />
                    ))}
                    {Array.from({ length: 5 - review.rating }, (_, i) => (
                      <BiStar key={i + 10} className="text-gray-300" />
                    ))}
                    <span className="ml-2 text-xs text-gray-600">
                      {review.rating} / 5
                    </span>
                  </div>
                </div>
                <div className="text-green-500 flex items-center gap-2 text-xs md:text-base">
                  <span className=""><AiFillSafetyCertificate /></span> Verified Buyer</div>
              </div>
              <p className="text-gray-600 text-sm">{review.review_text}</p>
            </div>  
        ))
      ) : (
        <p className="text-gray-500">No reviews available.</p>
      )}

      {totalRatings > 5 && (
              <button
                onClick={() => setOpenReviews(!openReviews)}
                className="text-[#04A9FF] mt-2"
              >
                {openReviews ? 'View Less Reviews' : 'View All Reviews'}
              </button>
            )}
    </div>
  );
};

export default ReviewRatingComments;
