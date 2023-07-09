import React from "react";
import { ReviewWrapper } from "./ReviewWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faStar } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { useSelector } from "react-redux";

export default function Review({
  review,
  setActiveReviewId,
  setIsOpen,
  isEdit,
  setEditModal,
}) {
  const { User } = review;
  const usr = useSelector((state) => state.session.user);
  const handleDelete = () => {
    setActiveReviewId(review.id);
    setIsOpen(true);
  };
  const handleEdit = () => {
    setActiveReviewId(review.id);
    setEditModal(true);
  };
  return (
    <ReviewWrapper>
      <header>
        <div className='rating'>
          {[1, 2, 3, 4, 5].map((val) => {
            return (
              <FontAwesomeIcon
                key={val}
                icon={review.stars >= val ? faStar : faStarEmpty}
                width={20}
                color='gold'
              />
            );
          })}
        </div>
        <span>- {User.firstName}</span>
      </header>
      <div className='content'>
        <span className='date'>
          {dayjs(review.createdAt).format("MM/DD/YYYY")}
        </span>
        <span>{review.review}</span>
        <div className='buttons'>
          {usr?.id === User.id && (
            <button onClick={handleDelete}>Delete</button>
          )}
          {usr?.id === User.id && <button onClick={handleEdit}>Edit</button>}
        </div>
      </div>
    </ReviewWrapper>
  );
}
