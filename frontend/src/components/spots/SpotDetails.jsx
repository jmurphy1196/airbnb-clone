import React, { useEffect, useState } from "react";
import { SpotDetailsWrapper } from "./SpotDetailsWrapper";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector, useDispatch } from "react-redux";
import {
  thunkGetSpotDetails,
  thunkGetSpotReviews,
} from "../../store/singleSpot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import ReviewList from "../reviews/ReviewList";

export default function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [loadingReviews, setLoadingReviews] = useState(true);
  const user = useSelector((state) => state.session.user);
  const spot = useSelector((state) =>
    state.singleSpot.id == spotId ? state.singleSpot : null
  );
  const reviews = useSelector((state) => state.singleSpot.Reviews || []);

  //replace w/ loading screen

  useEffect(() => {
    (async () => {
      const data = await dispatch(thunkGetSpotDetails(spotId));
      const reviewData = await dispatch(thunkGetSpotReviews(spotId));
      setLoadingReviews(false);
    })();
  }, [dispatch]);
  if (!spot) return null;
  return (
    <SpotDetailsWrapper>
      <header>
        <h1>{spot.name}</h1>
        <p>
          {spot.city}, {spot.state}, USA{" "}
        </p>
      </header>
      <div className='spot-images'>
        <div className='image main-image'>
          <img src={spot.spotImages[0]?.url || "/stock-house.png"} alt='' />
        </div>
        {[1, 2, 3, 4].map((val) => (
          <div key={val} className='image sub-image'>
            <img src={spot.spotImages[val]?.url || "/stock-house.png"} alt='' />
          </div>
        ))}
      </div>
      <h1>
        Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
      </h1>
      <div className='desc'>
        <p>
          {spot.description.length < 40
            ? "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            : spot.description}
        </p>
        <div className='spot-pricing-container'>
          <div className='spot-pricing'>
            <header>
              <span>
                <strong>${spot.price}</strong>/ night
              </span>
              <span>
                <FontAwesomeIcon icon={faStar} width={20} />
                {spot.avgStarRating}
              </span>
              <span># reviews</span>
            </header>
            <button>Reserve</button>
          </div>
        </div>
      </div>
      {loadingReviews ? (
        <ReviewList loading={true} />
      ) : (
        <ReviewList reviews={reviews} />
      )}
    </SpotDetailsWrapper>
  );
}
