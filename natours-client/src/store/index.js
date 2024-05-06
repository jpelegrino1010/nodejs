import { compose, createStore, applyMiddleware } from 'redux';
import rootReducer from './reducer/reducers';
import thunk from 'redux-thunk';

const configureStore = () => {
  const componseEnhancers = window.__REDUX_DEVTOOLS_COMPOSE__ || compose;

  return createStore(rootReducer, applyMiddleware(thunk));
};

export default configureStore;
