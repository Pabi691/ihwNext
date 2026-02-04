import React from "react";
import ReviewRatingComments from "./ReviewRatingComments";

const DummyContentProvider = ({reviews, overallRating, totalRatings, ratingBreakdown}) => {



  // const dummyReviews = [
  //   {
  //     username: "Sana Khan",
  //     rating: 5,
  //     comment: "Excellent product! Highly recommended.",
  //   },
  //   {
  //     username: "Rohit Shribastwab",
  //     rating: 4,
  //     comment: "Very good quality, but delivery was delayed.",
  //   },
  //   {
  //     username: "Barun Dey",
  //     rating: 3,
  //     comment: "Product is okay, but could be improved in some areas.",
  //   },
  // ];

  

  return (
    <div className="container mx-auto mt-6">
      <ReviewRatingComments
        // reviews={dummyReviews}
        // overallRating={overallRating}
        // totalRatings={totalRatings}
        // ratingBreakdown={ratingBreakdown}
      />
    </div>
  );
};

export default DummyContentProvider;
