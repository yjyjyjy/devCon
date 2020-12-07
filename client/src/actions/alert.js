import uuid from "uuid";
import { SET_ALERT } from "./constants";

export const setAlert = () => (dispatch) => {
  const id = uuid.v4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });
};
