import { actionTypes } from "./actionTypes";
import { csrfFetch } from "./csrf";

const initalState = {
  user: {},
};

const addUserReview = (review) => ({
  type: actionTypes.CREATE_REVIEW,
  payload: review,
});

const removeUserReview = (id) => ({
  type: actionTypes.REMOVE_REVIEW,
  payload: id,
});

export const thunkCreateReview = (spotId, user, review) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      body: review,
    });
    const data = await res.json();
    data.User = user;
    dispatch(addUserReview(data));
    return data;
  } catch (err) {
    console.log("there was an error", err);
    if (err.json) return await err.json();
  }
};

export const thunkRemoveReview = (reviewId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    dispatch(removeUserReview(reviewId));
    return data;
  } catch (err) {
    console.log("there was an err", err);
    if (err.json) return await err.json();
  }
};

export const reviewsReducer = (state = initalState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_REVIEW: {
      const newState = { ...state };
      newState.user[action.payload.id] = action.payload;
      return newState;
    }
    case actionTypes.REMOVE_REVIEW: {
      const newState = { ...state };
      if (newState.user[action.payload]) {
        delete newState.user[action.payload];
      }
      return newState;
    }
    default:
      return state;
  }
};
