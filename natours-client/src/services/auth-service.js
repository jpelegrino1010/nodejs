import axios from 'axios';

export const login = (email, password) => {
  return axios.post('/api/v1/users/login', {
    email,
    password
  });
};

export const isLogedIn = () => {
  return axios.get('api/v1/users/logedin');
};

export const logout = () => {
  return axios.get('/api/v1/users/logout');
};
