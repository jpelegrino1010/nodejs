import axios from 'axios';

export const getAllTours = () => {
  return axios.get('/api/v1/tours');
};

export const getTourBySlug = (slug) => {
  return axios.get(`/api/v1/tours/details/${slug}`);
};
