import { actionTypes } from "./actionTypes";
import { csrfFetch } from "./csrf";

const initalState = {
  spotData: {},
  spotImages: [],
  Owner: {},
};
const getSpotDetails = (data) => ({
  type: actionTypes.GET_SPOT_DETAILS,
  payload: data,
});
const getSpotReviews = (data) => ({
  type: actionTypes.GET_SPOT_REVIEWS,
  payload: data,
});
export const thunkGetSpotDetails = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    const data = await res.json();
    dispatch(getSpotDetails(data));
    return data;
  } catch (err) {
    console.log("there was an error", err);
    return await err.json();
  }
};

export const thunkGetSpotReviews = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await res.json();
    dispatch(getSpotReviews(data));
    return data;
  } catch (err) {
    console.log("there was an error", err);
    return await err.json();
  }
};

export const singleSpotReducer = (state = initalState, action) => {
  switch (action.type) {
    case actionTypes.GET_SPOT_DETAILS: {
      let newState = { ...state };
      const spot = action.payload;
      newState = { ...spot, spotImages: spot.SpotImages };
      delete newState.SpotImages;
      return newState;
    }
    case actionTypes.GET_SPOT_REVIEWS: {
      const newState = { ...state };
      const { Reviews } = action.payload;
      newState.Reviews = Reviews;
      return newState;
    }
    default:
      return state;
  }
};
