import { actionTypes } from "./actionTypes";
import { csrfFetch } from "./csrf";

const initalState = {
  spotData: {},
  spotImages: [],
  Owner: {},
  reviewCount: null,
  Reviews: [],
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
const editSpot = (data) => ({
  type: actionTypes.EDIT_SPOT,
  payload: data,
});
const editSpotImage = (data) => ({
  type: actionTypes.EDIT_SPOT_IMAGE,
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

export const thunkGetSpotReviews =
  (spotId, usrId = null) =>
  async (dispatch) => {
    try {
      const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
      const data = await res.json();
      dispatch(getSpotReviews({ ...data, usrId: usrId }));
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

export const deleteSpotImages = async (imgIds) => {
  try {
    for (let imgId of imgIds) {
      const res = await csrfFetch(`/api/spot-images/${imgId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log("this was the data", data);
    }
  } catch (err) {
    console.log("there was an error", err);
    if (err.json) return await err.json();
  }
};

export const thunkEditSpot = (spotData) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotData.id}`, {
      method: "PUT",
      body: spotData,
    });
    const data = await res.json();
    console.log("this is the data , ", data);
    dispatch(editSpot(data));
    return data;
  } catch (err) {
    console.log("there was an error", err);
    if (err.json) return await err.json();
  }
};

export const thunkEditSpotImage = (spotImageId, spotId) => async (dispatch) => {
  try {
    //will make spotimage id the new preview img
    const res = await csrfFetch(`/api/spot-images/${spotImageId}`, {
      method: "PUT",
    });
    const data = await res.json();
    dispatch(editSpotImage({ spotId, url: data.data }));
    return data;
  } catch (err) {
    console.log("there was an err ", err);
    if (err.json) return await err.json();
  }
};

export const thunkPostSpotImages =
  (spotId, images, previewInd = 0) =>
  async (dispatch) => {
    try {
      const formData = new FormData();
      for (let img of images) {
        formData.append("images[]", img);
      }
      const res = await csrfFetch(
        `/api/spots/${spotId}/images/array?previewImgInd=${previewInd}`,
        {
          method: "POST",
          body: formData,
        },
        true
      );
      const data = await res.json();
      dispatch(
        addSpotImages({
          preview: URL.createObjectURL(images[previewInd]),
          id: spotId,
        })
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
    case actionTypes.EDIT_REVIEW: {
      const newState = { ...state };
      newState.Reviews = [...newState.Reviews];
      let reviewIdx = newState.Reviews.findIndex(
        (rev) => rev.id === action.payload.id
      );
      newState.Reviews[reviewIdx] = action.payload;

      return newState;
    }
    default:
      return state;
  }
};
