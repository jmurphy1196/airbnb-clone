import React, { useEffect, useState, useRef } from "react";
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
import gsap from "gsap";

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
  const [spotImagesLoaded, setSpotImagesLoaded] = useState(false);
  const reviews = useSelector((state) => state.singleSpot.Reviews || []);
  const imgRefArray = useRef([]);
  console.log(spotImagesLoaded);

  const updateImgRefArray = (idx, ref) => {
    imgRefArray.current[idx] = ref;
  };

  //replace w/ loading screen

  useEffect(() => {
    (async () => {
      const data = await dispatch(thunkGetSpotDetails(spotId));
      const reviewData = await dispatch(thunkGetSpotReviews(spotId, user?.id));
      setLoadingReviews(false);
    })();
  }, [dispatch]);

  useEffect(() => {
    if (spotImagesLoaded) {
      const tl = gsap.timeline();

      imgRefArray.current.forEach((cardRef, idx) => {
        const card = cardRef;
        let options = {};
        if (idx === 0) options.y = 50;
        else if (idx === 1) options.y = -50;
        else if (idx === 2) options.x = 50;
        else if (idx === 3) options.y = 50;
        else if (idx === 4) options.x = 50;
        tl.from(card, { opacity: 0, ...options, duration: 0.8 }, idx * 0.2);
      });
    }
  }, [spotImagesLoaded]);

  const handleImagesLoaded = () => {
    const images = document.querySelectorAll(".image > img");
    const imageLoadedCount = Array.from(images).filter(
      (img) => img.complete
    ).length;
    if (imageLoadedCount === 5) setSpotImagesLoaded(true);
  };
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
          <img
            ref={(ref) => updateImgRefArray(0, ref)}
            src={spotImageOrder[0]?.url || "/stock-house.png"}
            alt=''
            onLoad={handleImagesLoaded}
          />
        </div>
        {[1, 2, 3, 4].map((val) => (
          <div key={val} className='image sub-image'>
            <img
              ref={(ref) => updateImgRefArray(val, ref)}
              src={spotImageOrder[val]?.url || "/stock-house.png"}
              alt=''
              onLoad={handleImagesLoaded}
            />
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
                {spot.reviewCount > 0 ? spot.reviewCount : 0}{" "}
                {spot.reviewCount > 1 ? "Reviews" : "Review"}
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
      {!reviews.length && user && user.id != spot.ownerId && (
        <p>Be the first to post a review! </p>
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
