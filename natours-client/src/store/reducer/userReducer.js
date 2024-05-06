import { type } from './../types';

const initialState = { users: [], login: { user: '', success: false } };

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case type.AUTHENTICATE_SUCCESS:
      return { ...state, login: action.user };
  }
  return state;
};

export default userReducer;
