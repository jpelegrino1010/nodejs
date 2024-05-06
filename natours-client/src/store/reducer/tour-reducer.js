import { type } from './../types';

const initialState = { tours: [], tour: {} };

const tourReducer = (state = initialState, action) => {
  switch (action.type) {
    case type.LOAD_TOURS_SUCCESS:
      return { ...state, tours: action.tours };
    case type.LOAD_TOUR_BY_SLUG_SUCCESS:
      return { ...state, tour: action.tour };
  }
  return state;
};

export default tourReducer;
