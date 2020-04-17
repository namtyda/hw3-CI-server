import { detailsReducer, initianState, loading, getInfo, getRepoName, getRebuildInfo, getLogs } from '../detailsReducer';

describe('Тесты редьюсера detailsReducer', () => {
  it('LOAD_TOGGLE', () => {
    const initianStateTest = { ...initianState, }
    const action = loading(true);
    expect(detailsReducer(initianStateTest, action)).toEqual({ ...initianState, isLoading: true })
  });

  it('GET_BUILD_INFO', () => {
    const initianStateTest = { ...initianState }
    const action = getInfo({ commitHash: 'test', authorName: 'Andrey Pogorelov' });

    expect(detailsReducer(initianStateTest, action)).toEqual({ ...initianState, buildInfo: { commitHash: 'test', authorName: 'Andrey Pogorelov' } })
  });

  it('GET_REPONAME', () => {
    const initianStateTest = { ...initianState };
    const action = getRepoName('reference');

    expect(detailsReducer(initianStateTest, action)).toEqual({ ...initianState, repoName: 'reference' });
  });

  it('GET_REBUILD_INFO', () => {
    const initianStateTest = { ...initianState }
    const action = getRebuildInfo({ commitHash: 'test', authorName: 'Andrey Pogorelov' });

    expect(detailsReducer(initianStateTest, action)).toEqual({ ...initianState, rebuildInfo: { commitHash: 'test', authorName: 'Andrey Pogorelov' } })
  });

  it('GET_LOGS', () => {
    const initianStateTest = { ...initianState };
    const action = getLogs('reference logs');
    expect(detailsReducer(initianStateTest, action)).toEqual({ ...initianState, logs: 'reference logs' });
  });
});
