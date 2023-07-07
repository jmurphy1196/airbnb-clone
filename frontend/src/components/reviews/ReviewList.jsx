import React, { useState } from "react";
import { ReviewsWrapper } from "./ReviewsWrapper";
import Review from "./Review";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeleteReviewModal from "./ReviewDeleteModal";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function ReviewList({ reviews, loading }) {
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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
        return (
          <Review
            review={review}
            setActiveReviewId={setActiveReviewId}
            setIsOpen={setIsOpen}
          />
        );
      })}
      <DeleteReviewModal
        isOpen={isOpen}
        onRequestClose={() => {
          setIsOpen(false);
          setActiveReviewId(null);
        }}
        reviewId={activeReviewId}
      />
    </ReviewsWrapper>
  );
}
