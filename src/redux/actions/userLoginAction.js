import * as actionType from './actionTypes';

export const loginRequest = payload => {
    return {
        type: actionType.LOGIN_REQUEST,
        payload: payload,
    };
};

export const logoutUser = () => {
    return {
      type: actionType.LOGOUT_USER,
    };
  }