import { combineReducers } from "redux";
import appReducer from "./AppReducer";
import zoomReducer from "./ZoomReducer";
import seekerReducer from "./SeekerReducer";

const rootReducer = combineReducers({
  appReducer,
  zoomReducer,
  seekerReducer,
  // Add more reducers as needed
});

export default rootReducer;
