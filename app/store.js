// Main Libs
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
// Middleware
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
// Reducers
import reducer from "./reducers";

const loggerMiddleware = createLogger({
  predicate: (getState, action) => __DEV__
});

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      loggerMiddleware
    )
  );
  return createStore(reducer, initialState, enhancer);
}

export const store = configureStore({});
