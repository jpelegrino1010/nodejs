import { getAllTours, getTourBySlug } from './../../services/tour-service';
import { type } from './../types';

const loadToursSuccess = (tours) => {
  return {
    type: type.LOAD_TOURS_SUCCESS,
    tours
  };
};

const loadTourBySlugSuccess = (tour) => {
  return {
    type: type.LOAD_TOUR_BY_SLUG_SUCCESS,
    tour
  };
};

export const findAllTours = () => {
  return async (dispatch) => {
    const allTours = async () => {
      const response = await getAllTours();
      return response.data.data;
    };

    try {
      const tours = await allTours();
      dispatch(loadToursSuccess(tours));
    } catch (err) {
      console.error(err);
    }
  };
};

export const findTourBySlug = (slug) => {
  return async (dispatch) => {
    const getTour = async () => {
      const response = await getTourBySlug(slug);
      console.log(response);
      return response.data;
    };

    try {
      const tour = await getTour();
      dispatch(loadTourBySlugSuccess(tour));
    } catch (err) {
      console.error(err);
    }
  };
};
