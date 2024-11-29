//context
import { useAppUniidContext, UniidProvider } from "./context";

//actions
import {
  //post
  registerStudent,
  registerStaff,
  postAnnounce,
  logInuser,
  recordEntry,
  //validate
  validateUsers,
  checkUserExists,
  fetchProfile,
  checkPostExists,
  //update
  updateStudent,
  updateStaff,
  updateAnno,
  reqQrreset,
  updateQrrequest,
} from "./actions";

//reducer
import {
  //main
  ROUTE_INSERT,
  USER_ACTION,
  FORGOT_PASSWORD,
  SET_ACTIVE_PAGE,
  initialState,
  reducer,
} from "./reducer";

//exports
export {
  //context provider
  useAppUniidContext,
  UniidProvider,

  //actions
  registerStudent,
  registerStaff,
  postAnnounce,
  logInuser,
  validateUsers,
  fetchProfile,
  recordEntry,
  checkUserExists,
  checkPostExists,
  updateStudent,
  updateStaff,
  updateAnno,
  reqQrreset,
  updateQrrequest,

  //reducer
  //test

  //main
  USER_ACTION,
  ROUTE_INSERT,
  FORGOT_PASSWORD,
  SET_ACTIVE_PAGE,

  //reducer app initial state
  reducer,
  initialState,
};
