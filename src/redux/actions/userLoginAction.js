import * as actionType from "./actionTypes";

export const loginRequest = (payload) => {
  return {
    type: actionType.LOGIN_REQUEST,
    payload: payload,
  };
};

export const logoutUser = () => {
  return {
    type: actionType.LOGOUT_USER,
  };
};

export const Home = (payload) => {
  return {
    type: actionType.HOME,
    payload: payload,
  };
};
