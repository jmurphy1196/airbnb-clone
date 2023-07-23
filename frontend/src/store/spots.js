import { actionTypes } from "./actionTypes";
import { csrfFetch } from "./csrf";

const initalState = {
  allSpots: {},
  orderedSpots: [],
  orderedUserSpots: [],
  orderBy: "default",
};

const getSpots = (data) => ({
  type: actionTypes.GET_SPOTS,
  payload: data,
});

const getUserSpots = (data) => ({
  type: actionTypes.GET_USER_SPOTS,
  payload: data,
});

const removeUserSpot = (spotId) => ({
  type: actionTypes.REMOVE_SPOT,
  payload: spotId,
});

export const thunkRemoveUserSpot = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    dispatch(removeUserSpot(spotId));
    return data;
  } catch (err) {
    console.log("there was an error", err);
    if (err.json) return await err.json();
  }
};

export const thunkGetUserSpots = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/spots/current");
    const data = await res.json();
    dispatch(getUserSpots(data));
    return data;
  } catch (err) {
    console.log("there was an err", err);
    if (err.json) return await err.json();
  }
};

export const thunkGetSpots =
  (paginationData = null) =>
  async (dispatch) => {
    try {
      const res = await csrfFetch(
        `/api/spots?size=${paginationData.size}&page=${paginationData.page}`
      );
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
      } else {
        newState.orderedSpots = Object.values(newState.allSpots);
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
      const spotIdx = newState.orderedSpots.findIndex((spot) => spot.id == id);
      if (spotIdx > -1) {
        newState.orderedSpots[spotIdx].preview = preview;
      }
      return newState;
    }
    case actionTypes.GET_USER_SPOTS: {
      const newState = { ...state };
      const { Spots } = action.payload;
      newState.orderedUserSpots = [...Spots];
      return newState;
    }
    case actionTypes.REMOVE_SPOT: {
      const newState = { ...state };
      newState.orderedUserSpots = newState.orderedUserSpots.filter(
        (spot) => spot.id !== action.payload
      );
      newState.orderedSpots = newState.orderedSpots.filter(
        (spot) => spot.id !== action.payload
      );
      delete newState.allSpots[action.payload];
      return newState;
    }
    case actionTypes.EDIT_SPOT: {
      const newState = { ...state };
      newState.allSpots = { ...newState.allSpots };
      newState.orderedSpots = [...newState.orderedSpots];
      newState.allSpots[action.payload.id] = action.payload;
      const spotIdx = newState.orderedSpots.findIndex(
        (spot) => spot.id === action.payload.id
      );
      if (spotIdx) {
        newState.orderedSpots[spotIdx] = action.payload;
      }
      return newState;
    }
    case actionTypes.EDIT_SPOT_IMAGE: {
      const newState = { ...state, orderedSpots: [...state.orderedSpots] };
      const { spotId, url } = action.payload;
      const spotIdx = newState.orderedSpots.findIndex(
        (spot) => spot.id == spotId
      );
      newState.orderedSpots[spotIdx].preview = url;
      return newState;
    }
    default:
      return state;
  }
};
