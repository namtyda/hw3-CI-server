import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './root-reducer';

export const createClientStore = () => {

  const middleWare = applyMiddleware(thunk);

  return createStore(rootReducer, middleWare);
};
export type AppState = ReturnType<typeof rootReducer>;