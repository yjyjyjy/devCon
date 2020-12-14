import { v4 as uuid } from "uuid";
import { REMOVE_ALERT, SET_ALERT } from "./constants";

export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuid();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  // after certain amount of time remove the alert
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
