import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { createClientStore } from '../store';


 
export const renderWithStore = (
  ui,
  { store = createClientStore(), ...renderOptions } = {}
) => {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export const mockStoreCreator = () => {
  const middlewares = [thunk];
  const creator = configureMockStore(middlewares);
  return creator;
};