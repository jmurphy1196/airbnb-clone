const SET_SESSION = "session/setUserData";
const REMOVE_SESSION = "session/removeUserData";
const GET_SESSION = "session/getUserData";
const GET_SPOTS = "spots/getSpotsData";
const GET_SPOT_DETAILS = "singleSpot/getSpotDetails";
const GET_SPOT_REVIEWS = "singleSpot/getSpotReviews";
const CREATE_SPOT = "singleSpot/createSpot";
const CREATE_REVIEW = "reviews/createReview";
const CREATE_SPOT_IMAGES = "spots/createSpotImages";
const REMOVE_REVIEW = "reviews/removeReview";
const EDIT_REVIEW = "reviews/editReview";
const GET_USER_REVIEWS = "reviews/getUserReviews";

export const actionTypes = {
  SET_SESSION,
  REMOVE_SESSION,
  GET_SESSION,
  GET_SPOTS,
  GET_SPOT_DETAILS,
  GET_SPOT_REVIEWS,
  CREATE_REVIEW,
  CREATE_SPOT,
  CREATE_SPOT_IMAGES,
  REMOVE_REVIEW,
  EDIT_REVIEW,
  GET_USER_REVIEWS,
};
