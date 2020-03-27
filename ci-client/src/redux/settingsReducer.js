import { api } from '../api/api';

const initialState = {
  repoName: '',
  buildCommand: 'npm ci && npm run build',
  mainBranch: 'master',
  period: '',
  isLoad: false,
  isCloning: false,
  cloningWithError: false,
}

export function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_CONFIG':
      return { ...state, ...action.payload };
    case 'LOAD':
      return { ...state, isLoad: action.payload };
    case 'CLONING':
      return { ...state, isCloning: action.payload };
    case 'ERROR_CLONING':
      return { ...state, cloningWithError: action.payload };
    default:
      return state;
  }
}

const addConfig = (data) => ({
  type: 'GET_CONFIG',
  payload: data
});

const loadSettings = (status) => ({
  type: 'LOAD',
  payload: status
});

const cloningRepo = (status) => ({
  type: 'CLONING',
  payload: status
});

const errorWithCloning = (status) => ({
  type: 'ERROR_CLONING',
  payload: status
});

export const getConfigThunk = (history) => (dispatch) => {
  dispatch(loadSettings(true));
  api.getConfig()
    .then(response => {
      if (response.status === 200) {
        history.push('/history');
        dispatch(loadSettings(false));
        dispatch(addConfig(response.data));
      } else {
        history.push('/');
        dispatch(loadSettings(false));
      }
    }).catch(err => console.log(err));
}

export const postSaveSettings = (data, history) => (dispatch) => {
  dispatch(cloningRepo(true));
  api.postSaveSettings(data)
    .then(res => {
      console.log(res)
      if (res.status !== 200) {
        dispatch(errorWithCloning(true));
        dispatch(cloningRepo(false));
      } else {
        dispatch(cloningRepo(false));
        history.push('/history');
      }
    }).catch(err => {
      dispatch(cloningRepo(false));
      dispatch(errorWithCloning(true));
      console.log(err);
    });
}
