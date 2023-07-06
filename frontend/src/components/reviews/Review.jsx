import React from "react";
import { ReviewWrapper } from "./ReviewWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faStar, faSpinner } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";

export default function Review({ review }) {
  const { User } = review;
  return (
    <ReviewWrapper>
      <header>
        <div className='rating'>
          {[1, 2, 3, 4, 5].map((val) => {
            return (
              <FontAwesomeIcon
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
      </div>
    </ReviewWrapper>
  );
}
