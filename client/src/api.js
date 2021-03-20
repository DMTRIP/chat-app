import axios from 'axios';
import jwtDecode from 'jwt-decode';

const baseUrl = 'http://localhost:3002/';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

const requests = {
  del: (url, body) => axios.delete(`${baseUrl}${url}`, body),
  get: (url, body) => {
    return axios.get(`${baseUrl}${url}`, body);
  },
  put: (url, body) => axios.put(`${baseUrl}${url}`, body),
  patch: (url, body) => axios.patch(`${baseUrl}${url}`, body),
  post: (url, body) => axios.post(`${baseUrl}${url}`, body),
};

const Auth = {
  login: (body) => requests.post('login', body),
  register: (body) => requests.post('register', body),
};

const User = {
  me: async function () {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const { userId } = jwtDecode(token);
      return this.get(userId);
    }

    return Promise.reject();
  },
  get: (id) => requests.get(`users/${id}`),
};

export const api = {
  Auth,
  User,
};
