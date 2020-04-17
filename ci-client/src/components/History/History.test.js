import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';

import { renderWithStore } from '../../redux/test/testUtils';
import { HistoryConnect } from './History';

jest.mock('./selectors', () => ({
  __esModule: true,
  mapStateToProps: () => ({
    isLoading: false,
    buildList: [{
      id: "b39a1fa3-8f19-4190-9c9a-1642b69ca0c7",
      configurationId: "8e92be6a-56d2-40d2-a73b-f69da07128cd",
      buildNumber: 12,
      commitMessage: "reference commit for UI test",
      commitHash: "d36019c43edf53686e07686fc8d5ed78978753ac",
      branchName: "master",
      authorName: "Andrey Pogorelov",
      status: "Waiting"
    }],
    repoName: 'namtyda/reference',
    runNewBuild: false,
    errorPostReq: false
  }),
  mapDispatchToProps: () => ({
    getBuildListThunk: jest.fn(),
    postNewBuildQueue: jest.fn(),
    getConfigThunk: jest.fn()
  }),
}));

describe('Тесты компонента History', () => {
  window.scrollTo = jest.fn();
  it('Компонент history рендерится', () => {
    const history = createMemoryHistory();
    const { container } = renderWithStore(
      <Router history={history}>
        <HistoryConnect />
      </Router>
    );

    expect(container.querySelector('.history__list')).toBeInTheDocument();
    expect(container.querySelector('.card')).toBeInTheDocument();
  });

  it('При клике на Run Build, открывается модальное окно', () => {
    const history = createMemoryHistory();
    const { container } = renderWithStore(
      <Router history={history}>
        <HistoryConnect />
      </Router>
    );
    const btn = container.querySelector('.button__header')
    fireEvent.click(btn);
    expect(container.querySelector('.popup')).toBeVisible();
  });

  it('При клике на настройки, меняется url на /settings', () => {
    const history = createMemoryHistory();
    const { container } = renderWithStore(
      <Router history={history}>
        <HistoryConnect />
      </Router>
    );
      const btn = container.querySelector('.header__button_history');
    fireEvent.click(btn);
    expect(history.location.pathname).toBe('/settings');
  });
});