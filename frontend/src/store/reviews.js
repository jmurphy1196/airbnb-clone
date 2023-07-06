import { actionTypes } from "./actionTypes";
import { csrfFetch } from "./csrf";

const initalState = {
  user: {},
};

const addUserReview = (review) => ({
  type: actionTypes.CREATE_REVIEW,
  payload: review,
});

export const thunkCreateReview = (spotId, review) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      body: review,
    });
    const data = await res.json();
    console.log("this is the data", data);
    return data;
  } catch (err) {
    console.log("there was an error", err);
  }
};

export const reviewsReducer = (state = initalState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_REVIEW: {
      const newState = { ...state };
      newState.user[action.payload.id] = action.payload.id;
      return newState;
    }
    default:
      return state;
  }
};
