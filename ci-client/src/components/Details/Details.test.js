import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';

import { renderWithStore } from '../../redux/test/testUtils';
import { DetailsConnect } from './Details';

jest.mock('./selectors', () => ({
  __esModule: true,
  mapStateToProps: () => ({
    isLoading: false,
    buildInfo:
    {
      id: "b45340e9-c3f5-432d-b92f-3099c3f67c05",
      configurationId: "8e92be6a-56d2-40d2-a73b-f69da07128cd",
      buildNumber: 11,
      commitMessage: "reference commit for UI test",
      commitHash: "d36019c43edf53686e07686fc8d5ed78978753ac",
      branchName: "master",
      authorName: "Andrey Pogorelov",
      status: "Waiting",
    },
    repoName: 'namtyda/reference',
    runNewBuild: false,
    errorPostReq: false
  }),
  mapDispatchToProps: () => ({
    getDetailsBuild: jest.fn(),
    postBuildInQueue: jest.fn()
  })
}));

describe('Тесты компонента Details', () => {
  it('Компонент Details рендерится', () => {
    const history = createMemoryHistory();
    const { container } = renderWithStore(
      <Router history={history}>
        <DetailsConnect />
      </Router>
    );
    expect(container.querySelector('.card')).toBeInTheDocument();
  });

  test('При клике на кнопку настройки url меняется на /settings', () => {
    const history = createMemoryHistory();
    const { container } = renderWithStore(
      <Router history={history}>
        <DetailsConnect />
      </Router>
    );
    const btn = container.querySelector('.header__button_history');
    fireEvent.click(btn);
    expect(history.location.pathname).toBe('/settings');
  });
});