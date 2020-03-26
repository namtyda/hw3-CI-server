import { api } from '../api/api';
const initialState = {
  repoName: '',
  buildCommand: 'npm ci && npm run build',
  mainBranch: 'master |',
  period: '',
  isLoad: false
}

export function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_CONFIG':
      return { ...state, ...action.payload }
    case 'LOAD':
      return { ...state, isLoad: action.payload }
    default:
      return state;
  }
}

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
    });
}


const addConfig = (data) => ({
  type: 'GET_CONFIG',
  payload: data
});

const loadSettings = (status) => ({
  type: 'LOAD',
  payload: status
});