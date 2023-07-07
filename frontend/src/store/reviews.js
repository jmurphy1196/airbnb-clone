import { actionTypes } from "./actionTypes";
import { csrfFetch } from "./csrf";

const initalState = {
  user: {},
  userOrder: [],
};

const addUserReview = (review) => ({
  type: actionTypes.CREATE_REVIEW,
  payload: review,
});

const removeUserReview = (id) => ({
  type: actionTypes.REMOVE_REVIEW,
  payload: id,
});

const getUserReviews = (reviews) => ({
  type: actionTypes.GET_USER_REVIEWS,
  payload: reviews,
});

const editUserReview = (review) => ({
  type: actionTypes.EDIT_REVIEW,
  payload: review,
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

export const thunkGetUserReviews = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/reviews/current");
    const data = await res.json();
    console.log("this is the data", data);
    dispatch(getUserReviews(data.Reviews));
    return data;
  } catch (err) {
    console.log("there was an error", err);
    if (err.json) return await err.json();
  }
};

export const thunkEditReview = (data, user) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/reviews/${data.id}`, {
      method: "PUT",
      body: data,
    });

    const jsonData = await res.json();
    dispatch(editUserReview({ ...jsonData, User: user }));
    return data;
  } catch (err) {
    console.log("there was an error", err);
    if (err.json) {
      return await err.json();
    }
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
    case actionTypes.GET_USER_REVIEWS: {
      const newState = { ...state };
      newState.user = { ...newState.user };
      newState.userOrder = [...newState.userOrder];
      const reviews = action.payload;
      for (let review of reviews) {
        newState.user[review.id] = review;
      }
      return newState;
    }
    case actionTypes.GET_SPOT_REVIEWS: {
      const newState = { ...state };
      newState.user = { ...newState.user };
      const { Reviews } = action.payload;
      const { usrId } = action.payload;
      if (Reviews.length) {
        for (let rev of Reviews) {
          if (rev.userId === usrId) {
            newState.user[rev.id] = rev;
          }
        }
      }
      return newState;
    }
    case actionTypes.EDIT_REVIEW: {
      const newState = { ...state };
      newState.user = { ...newState.user };
      newState.user[action.payload.id] = action.payload;
      return newState;
    }
    default:
      return state;
  }
};
