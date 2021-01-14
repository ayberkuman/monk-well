import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';
const { createStore, applyMiddleware } = require("redux");
const { default: rootReducer } = require("./rootReducer");
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
