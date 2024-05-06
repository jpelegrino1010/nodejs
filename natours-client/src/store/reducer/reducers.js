import { combineReducers } from 'redux';
import countReducer from './counterReducer';
import tourReducer from './tour-reducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  counter: countReducer,
  tour: tourReducer,
  user: userReducer
});

export default rootReducer;
