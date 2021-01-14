import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { localizeReducer } from "react-localize-redux";
import authReducer from "./Auth/authReducer";
import appReducer from "./App/appReducer";

const rootReducer = combineReducers({
  localize: localizeReducer,
  routing: routerReducer,
  auth: authReducer,
  app: appReducer,
});

export default rootReducer;
