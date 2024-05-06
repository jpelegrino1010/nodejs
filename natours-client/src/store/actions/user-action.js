import { login, isLogedIn, logout } from './../../services/auth-service';
import { type } from './../types';

const authenticateSuccess = (user) => {
  return {
    type: type.AUTHENTICATE_SUCCESS,
    user
  };
};

export const logIn = (email, password) => {
  return async (dispatch) => {
    const loginUser = async () => {
      const response = await login(email, password);
      return response.data;
    };

    try {
      const userResult = await loginUser();
    } catch (err) {
      console.error(err);
    }
  };
};

export const logedIn = () => {
  return async (dispatch) => {
    const getSession = async () => {
      const response = await isLogedIn();
      return response.data;
    };

    try {
      const session = await getSession();
      dispatch(
        authenticateSuccess({ user: session.email, success: session.valid })
      );
    } catch (err) {
      console.log(err);
    }
  };
};

export const logingOut = () => {
  return async (dispatch) => {
    const destroySession = async () => {
      const response = await logout();
      return response.data;
    };

    try {
      const session = await destroySession();
      dispatch(authenticateSuccess({ success: session.valid }));
    } catch (err) {
      console.log(err);
    }
  };
};
