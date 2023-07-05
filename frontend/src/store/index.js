import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { sessionReducer } from "./session";
import { spotsReducer } from "./spots";
import { singleSpotReducer } from "./singleSpot";

const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotsReducer,
  singleSpot: singleSpotReducer,
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = await import("redux-logger");
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger.createLogger()));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export { configureStore };
