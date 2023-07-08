import React, { useState } from "react";
import { ReviewsWrapper } from "./ReviewsWrapper";
import Review from "./Review";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeleteReviewModal from "./ReviewDeleteModal";
import { useSelector } from "react-redux";
import ReviewModal from "./ReviewModal";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function ReviewList({ reviews, loading, isEdit }) {
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
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
            key={review.id}
            review={review}
            setActiveReviewId={setActiveReviewId}
            setIsOpen={setIsOpen}
            isEdit={isEdit}
            setEditModal={setIsEditOpen}
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
      <ReviewModal
        isOpen={isEditOpen}
        onRequestClose={() => setIsEditOpen(false)}
        isEdit={true}
        activeReviewId={activeReviewId}
      />
    </ReviewsWrapper>
  );
}
