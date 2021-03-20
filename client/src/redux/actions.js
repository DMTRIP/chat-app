import { api } from '../api';
import jwtDecode from 'jwt-decode';

import {
  LOGIN_FAILURE,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  REGISTER_FAILURE,
} from './action-types';

export const login = (email, password) => {
  return async (dispatch) => {
    api.Auth.login({ email, password })
      .then(({ data }) => {
        const { accessToken } = data;
        const { userId } = jwtDecode(accessToken);
        localStorage.setItem('accessToken', accessToken);
        api.User.get(userId).then(({ data }) => {
          dispatch({ type: LOGIN_SUCCESS, user: data });
        });
      })
      .catch(({ response }) => {
        dispatch({ type: LOGIN_FAILURE, error: response.data.message });
      });
  };
};

export const register = (input) => {
  return (dispatch) => {
    api.Auth.register(input)
      .then(({ data: { accessToken } }) => {
        const { userId } = jwtDecode(accessToken);
        localStorage.setItem('accessToken', accessToken);
        api.User.get(userId).then(({ data }) => {
          dispatch({ type: REGISTER_SUCCESS, user: data });
        });
      })
      .catch(
        ({
          response: {
            data: { message },
          },
        }) => {
          dispatch({ type: REGISTER_FAILURE, error: message });
        },
      );
  };
};

export const fetchUser = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_USER });

    api.User.me()
      .then(({ data }) => {
        dispatch({ type: FETCH_USER_SUCCESS, user: data });
      })
      .catch(() => {
        dispatch({ type: FETCH_USER_FAILURE, error: 'FETCH_USER_FAILURE' });
      });
  };
};
