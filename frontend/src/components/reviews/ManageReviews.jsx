import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";
import ReviewList from "./ReviewList";
import { thunkGetUserReviews } from "../../store/reviews";

const ManageReviewsWrapper = styled.div``;

export default function ManageReviews() {
  const dispatch = useDispatch();
  const userReviews = useSelector((state) => {
    const arr = [];
    for (let key in state.reviews.user) {
      arr.push(state.reviews.user[key]);
    }
    return arr;
  });

  useEffect(() => {
    (async () => {
      const res = await dispatch(thunkGetUserReviews());
    })();
  }, [dispatch]);
  return (
    <ManageReviewsWrapper>
      <ReviewList reviews={userReviews} isEdit />
    </ManageReviewsWrapper>
  );
}
