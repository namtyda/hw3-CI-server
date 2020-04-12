import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';

import { renderWithStore } from '../../redux/test/testUtils';
import { StartConnect } from './Start';

jest.mock('./selectors', () => ({
  __esModule: true,
  mapStateToProps: () => ({
    isLoad: false,
  }),
  mapDispatchToProps: () => ({
    getConfigThunk: jest.fn(),
  }),
}));

describe('Тесты компонента Start', () => {
  it('Компонент Start, рендерится', () => {
    const history = createMemoryHistory();
    const { container } = renderWithStore(
      <Router history={history}>
        <StartConnect />
      </Router>
    );

    expect(container.querySelector('.settings-info')).toBeInTheDocument();
  });


  it('При клике на кнопку Open settings, идет переход по урлу /settings', () => {
    const history = createMemoryHistory();
    const { getByText } = renderWithStore(
      <Router history={history}>
        <StartConnect />
      </Router>
    );

    const button = getByText('Open settings');
    fireEvent.click(button);
    expect(history.location.pathname).toBe('/settings');
  });
});