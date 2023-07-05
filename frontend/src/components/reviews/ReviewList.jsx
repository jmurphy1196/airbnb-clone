import React from "react";
import { ReviewsWrapper } from "./ReviewsWrapper";
import Review from "./Review";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function ReviewList({ reviews, loading }) {
  if (loading) {
    return (
      <ReviewsWrapper>
        <FontAwesomeIcon className='spinner' icon={faSpinner} />
      </ReviewsWrapper>
    );
  }
  return (
    <ReviewsWrapper>
      {reviews.map((review) => {
        return <Review review={review} />;
      })}
    </ReviewsWrapper>
  );
}
