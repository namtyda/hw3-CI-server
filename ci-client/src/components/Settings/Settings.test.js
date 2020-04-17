import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';

import { renderWithStore } from '../../redux/test/testUtils';
import { SettingsConnect } from './Settings';

describe('Тесты компонента Settings', () => {

  it('Компонент рендерится', () => {
    const history = createMemoryHistory();
    const { container } = renderWithStore(
      <Router history={history}>
        <SettingsConnect />
      </Router>
    );
    expect(container.querySelector('.settings__form')).toBeInTheDocument();
  });

  it('Навигация по кнопке cancel', () => {
    const history = createMemoryHistory();
    history.push('/');
    const { getByText } = renderWithStore(
      <Router history={history}>
        <SettingsConnect />
      </Router>
    );
    history.push('/settings');

    const button = getByText('Cancel');
    fireEvent.click(button);
    expect(history.location.pathname).toBe('/');
  });
});