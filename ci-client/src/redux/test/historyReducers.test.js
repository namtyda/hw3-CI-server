import { historyReducer, initialState, actionGetBuilds, loading, getRepoName, addBuildInQueue, errorOnRequestNewBuild } from '../historyReducer';

describe('Тесты редьюсера historyReducer', () => {
  it('GET_BUILD_LIST', () => {
    const initialStateTest = { ...initialState };
    const action = actionGetBuilds([{ commitHash: '123-321', authorName: 'Andrey Pogorelov' }]);

    expect(historyReducer(initialStateTest, action)).toEqual({ ...initialState, buildList: [{ commitHash: '123-321', authorName: 'Andrey Pogorelov' }] });
  });

  it('LOAD_TOGGLE', () => {
    const initialStateTest = { ...initialState };
    const action = loading(true);

    expect(historyReducer(initialStateTest, action)).toEqual({ ...initialState, isLoading: true })
  });

  it('GET_REPONAME', () => {
    const initialStateTest = { ...initialState };
    const action = getRepoName('reference');

    expect(historyReducer(initialStateTest, action)).toEqual({ ...initialState, repoName: 'reference' });
  });

  it('RUN_NEW_BUILD', () => {
    const initialStateTest = { ...initialState };
    const action = addBuildInQueue(true);

    expect(historyReducer(initialStateTest, action)).toEqual({ ...initialState, runNewBuild: true })
  });

  it('ERROR_POST_REQ', () => {
    const initialStateTest = { ...initialState };
    const action = errorOnRequestNewBuild(true);

    expect(historyReducer(initialStateTest, action)).toEqual({ ...initialState, errorPostReq: true })
  });
});
