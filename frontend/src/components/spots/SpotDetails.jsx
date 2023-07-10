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
import ReviewModal from "../reviews/ReviewModal";

export default function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.session.user);
  const spot = useSelector((state) =>
    state.singleSpot.id == spotId ? state.singleSpot : null
  );
  const spotImageOrder = useSelector((state) =>
    state.singleSpot.spotImages.sort((a, b) => b.preview - a.preview)
  );
  const reviews = useSelector((state) => state.singleSpot.Reviews || []);

  //replace w/ loading screen

  useEffect(() => {
    (async () => {
      const data = await dispatch(thunkGetSpotDetails(spotId));
      const reviewData = await dispatch(thunkGetSpotReviews(spotId, user?.id));
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
          <img src={spotImageOrder[0]?.url || "/stock-house.png"} alt='' />
        </div>
        {[1, 2, 3, 4].map((val) => (
          <div key={val} className='image sub-image'>
            <img src={spotImageOrder[val]?.url || "/stock-house.png"} alt='' />
          </div>
        ))}
      </div>
      <h1>
        Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
      </h1>
      <div className='desc'>
        <p>{spot.description}</p>
        <div className='spot-pricing-container'>
          <div className='spot-pricing'>
            <header>
              <span>
                <strong>${spot?.price}</strong>/ night
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <FontAwesomeIcon icon={faStar} width={20} color='gold' />
                {Number(spot.avgStarRating).toFixed(1) != 0.0
                  ? Number(spot.avgStarRating).toFixed(1)
                  : "New"}
              </span>
              <span>
                {spot.reviewCount ? spot.reviewCount : 0}{" "}
                {spot.reviewCount ? "Reviews" : "Review"}
              </span>
            </header>
            <button onClick={() => alert("feature coming soon...")}>
              Reserve
            </button>
          </div>
        </div>
      </div>
      {user && (
        <button id='review-btn' onClick={() => setIsOpen(true)}>
          Post a review
        </button>
      )}
      {loadingReviews ? (
        <ReviewList loading={true} />
      ) : (
        <ReviewList reviews={reviews} />
      )}
      <ReviewModal
        spotId={spot?.id}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
      />
    </SpotDetailsWrapper>
  );
}
