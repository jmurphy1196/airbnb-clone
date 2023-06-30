import { actionTypes } from "./actionTypes";
import { csrfFetch } from "./csrf";

const initalState = {
  user: null,
};

const setSession = (user) => ({
  type: actionTypes.SET_SESSION,
  payload: user,
});
export const removeSession = () => ({
  type: actionTypes.REMOVE_SESSION,
});

export const thunkSetSession =
  ({ credential, password }) =>
  async (dispatch) => {
    try {
      const res = await csrfFetch("/api/session", {
        method: "POST",
        body: { credential, password },
      });
      const data = await res.json();
      dispatch(setSession(data));
      return data;
    } catch (err) {
      return err.json();
    }
  };

export const sessionReducer = (state = initalState, action) => {
  switch (action.type) {
    case actionTypes.SET_SESSION: {
      const newState = { ...state };
      newState.user = action.payload.user;
      return newState;
    }
    case actionTypes.REMOVE_SESSION: {
      const newState = { ...state };
      newState.user = null;
      return newState;
    }
    default:
      return state;
  }
};
