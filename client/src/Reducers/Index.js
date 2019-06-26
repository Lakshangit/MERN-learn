import { combineReducers } from "redux";
import authReducer from "./AuthReducers";
import errorReducer from "./ErrorReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer
});  