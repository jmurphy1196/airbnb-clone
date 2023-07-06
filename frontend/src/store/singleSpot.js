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

export const thunkCreateSpot = (data) => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/spots", {
      method: "POST",
      body: data,
    });
    const jsonData = await res.json();
    const newSpotId = jsonData.id;
    console.log("this is the new id", newSpotId);
    return newSpotId;
  } catch (err) {
    console.log("there was an error", err);
    return err;
  }
};

export const postSpotImages = async (spotId, images) => {
  try {
    const formData = new FormData();
    for (let img of images) {
      formData.append("images[]", img);
    }
    const res = await csrfFetch(
      `/api/spots/${spotId}/images/array?previewImgInd=0`,
      {
        method: "POST",
        body: formData,
      },
      true
    );
    return await res.json();
  } catch (err) {
    console.log("there was an error", err);
    return err;
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
