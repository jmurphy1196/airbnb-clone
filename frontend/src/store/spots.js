import { actionTypes } from "./actionTypes";
import { csrfFetch } from "./csrf";

const initalState = {
  allSpots: {},
  orderedSpots: [],
  orderBy: "default",
};

const getSpots = (data) => ({
  type: actionTypes.GET_SPOTS,
  payload: data,
});

export const thunkGetSpots =
  (paginationData = null) =>
  async (dispatch) => {
    try {
      const res = await csrfFetch("/api/spots");
      const data = await res.json();
      console.log("this is the data", data);
    } catch (err) {
      console.log(err);
    }
  };

export const spotsReducer = (state = initalState, action) => {
  switch (action.type) {
    case actionTypes.GET_SPOTS: {
      const newState = { ...state };
      const oldSpots = { ...state.allSpots };
      const { Spots } = action.payload;
      newState.allSpots = { ...oldSpots, ...Spots };
      return newState;
    }
    default:
      return state;
  }
};
