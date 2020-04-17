import { settingsReducer, initialState, addConfig, loadSettings, cloningRepo, errorWithCloning } from '../settingsReducer';

describe('Тесты редьюсера settingsReducer', () => {
  it('GET_CONFIG', () => {
    const initialStateTest = { ...initialState };
    const action = addConfig({ repoName: 'namtyda/reference', buildCommand: 'npm run build', mainBranch: 'master', period: 10 });

    expect(settingsReducer(initialStateTest, action)).toEqual({ ...initialState, repoName: 'namtyda/reference', buildCommand: 'npm run build', mainBranch: 'master', period: 10 });
  });

  it('LOAD', () => {
    const initialStateTest = { ...initialState };
    const action = loadSettings(true);

    expect(settingsReducer(initialStateTest, action)).toEqual({ ...initialState, isLoad: true });
  });

  it('CLONING', () => {
    const initialStateTest = { ...initialState };
    const action = cloningRepo(true);

    expect(settingsReducer(initialStateTest, action)).toEqual({ ...initialState, isCloning: true });
  });

  it('ERROR_CLONING', () => {
    const initialStateTest = { ...initialState };
    const action = errorWithCloning(true);

    expect(settingsReducer(initialStateTest, action)).toEqual({ ...initialState, cloningWithError: true });
  });
});