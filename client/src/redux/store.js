import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer';
import thunk from 'redux-thunk';

const stringMiddleware = () => (next) => (action) => {
  if (typeof action === 'string') {
    return next({
      type: action,
    });
  }

  return next(action);
};

const configureStore = () => {
  const middleware = [thunk, stringMiddleware];
  return createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware)),
  );
};

export default configureStore();
