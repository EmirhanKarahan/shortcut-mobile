import { createContext } from "react";

export const AuthContext = createContext();

export const ACTIONS = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

export const initialAuthState = {
  isLoggedIn: false,
  user: {},
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        isLoggedIn: true,
        user: action.user,
      };
    case ACTIONS.LOGOUT:
      return {
        isLoggedIn: false,
        user: {},
      };
    default:
      return state;
  }
};
