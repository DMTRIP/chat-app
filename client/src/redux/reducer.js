import {
  FETCH_USER,
  FETCH_USER_FAILURE,
  FETCH_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_SUCCESS,
} from './action-types';

const initialState = {
  user: null,
  isAuth: false,
  loginError: null,
  userLoading: true,
  userError: null,
  registerError: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        user: action.user,
        isAuth: true,
        loginError: null,
      };
    case LOGIN_FAILURE:
      return {
        user: null,
        isAuth: false,
        loginError: action.error,
      };
    case FETCH_USER:
      return {
        ...state,
        userLoading: true,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        user: action.user,
        userLoading: false,
        isAuth: true,
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        userError: action.error,
        userLoading: false,
      };
    case REGISTER_SUCCESS: {
      return {
        ...state,
        user: action.user,
        isAuth: true,
      };
    }
    case REGISTER_FAILURE:
      return {
        ...state,
        registerError: action.error,
      };
    default:
      return state;
  }
}
