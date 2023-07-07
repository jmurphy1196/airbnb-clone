import { actionTypes } from "./actionTypes";
import { csrfFetch } from "./csrf";

const initalState = {
  spotData: {},
  spotImages: [],
  Owner: {},
  reviewCount: null,
};
const getSpotDetails = (data) => ({
  type: actionTypes.GET_SPOT_DETAILS,
  payload: data,
});
const getSpotReviews = (data) => ({
  type: actionTypes.GET_SPOT_REVIEWS,
  payload: data,
});
const addSpot = (data) => ({
  type: actionTypes.CREATE_SPOT,
  payload: data,
});
const addSpotImages = (data) => ({
  type: actionTypes.CREATE_SPOT_IMAGES,
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
    dispatch(addSpot(jsonData));
    return newSpotId;
  } catch (err) {
    console.log("there was an error", err);
    return err;
  }
};

export const thunkPostSpotImages = (spotId, images) => async (dispatch) => {
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
    const data = await res.json();
    dispatch(
      addSpotImages({ preview: URL.createObjectURL(images[0]), id: spotId })
    );
    return data;
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
      if (Reviews.length) {
        newState.Reviews = Reviews.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        newState.reviewCount = Reviews.length;
      }
      return newState;
    }
    case actionTypes.CREATE_REVIEW: {
      const newState = { ...state };
      if (newState.Reviews) {
        newState.Reviews = [action.payload, ...newState.Reviews];
      } else {
        newState.Reviews = [action.payload];
      }
      newState.reviewCount !== null ? (newState.reviewCount += 1) : 1;
      return newState;
    }
    case actionTypes.REMOVE_REVIEW: {
      const newState = { ...state };
      if (newState.Reviews) {
        newState.reviewCount -= 1;
        newState.Reviews = newState.Reviews.filter(
          (rev) => rev.id !== action.payload
        );
      }
      return newState;
    }
    default:
      return state;
  }
};
