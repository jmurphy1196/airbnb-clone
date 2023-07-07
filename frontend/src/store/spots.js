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
      dispatch(getSpots(data));
      return data;
    } catch (err) {
      console.log(err);
    }
  };

export const spotsReducer = (state = initalState, action) => {
  switch (action.type) {
    case actionTypes.GET_SPOTS: {
      const newState = { ...state };
      const { Spots } = action.payload;
      newState.allSpots = { ...state.allSpots };
      for (let spot of Spots) {
        newState.allSpots[spot.id] = spot;
      }
      if (!newState.orderedSpots.length) {
        newState.orderedSpots = [...Spots];
      }
      return newState;
    }
    case actionTypes.CREATE_SPOT: {
      const newState = { ...state };
      newState.allSpots[action.payload.id] = action.payload;
      newState.orderedSpots = [
        newState.allSpots[action.payload.id],
        ...newState.orderedSpots,
      ];
      return newState;
    }
    case actionTypes.CREATE_SPOT_IMAGES: {
      const newState = { ...state };
      const { id, preview } = action.payload;
      newState.allSpots = { ...newState.allSpots };
      newState.allSpots[id] = { ...newState.allSpots[id], preview };
      newState.orderedSpots = [...newState.orderedSpots];
      newState.orderedSpots[0].preview = preview;
      return newState;
    }
    default:
      return state;
  }
};
