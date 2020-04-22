import { api, getConfig, Config } from '../api/api';
import { History } from 'history';
import { Dispatch } from 'react';

interface initialState {
  repoName: string;
  buildCommand: string;
  mainBranch: string;
  period: string;
  isLoad: boolean;
  isCloning: boolean;
  cloningWithError: boolean;
}

export const initialState: initialState = {
  repoName: '',
  buildCommand: 'npm ci && npm run build',
  mainBranch: 'master',
  period: '',
  isLoad: false,
  isCloning: false,
  cloningWithError: false,
}

enum actionType {
  GET_CONFIG = 'GET_CONFIG',
  LOAD = 'LOAD',
  CLONING = 'CLONING',
  ERROR_CLONING = 'ERROR_CLONING'
}

interface settingsPaylod {
  repoName: string;
  buildCommand: string;
  mainBranch: string;
  period: string;
  isLoad: boolean;
  isCloning: boolean;
  cloningWithError: boolean;
}

interface settingsAction<T, D> {
  type: T;
  payload: D;
}
export function settingsReducer(state = initialState, action: settingsAction<actionType, settingsPaylod>) {
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

interface addConfig {
  type: 'GET_CONFIG';
  payload: getConfig;
}

interface loadSettings {
  type: 'LOAD';
  payload: boolean;
}

interface cloningRepo {
  type: 'CLONING';
  payload: boolean;
}

interface errorWithCloning {
  type: 'ERROR_CLONING';
  payload: boolean;
}

type settingsActionTypes = addConfig | loadSettings | cloningRepo | errorWithCloning;

export const addConfig = (data: getConfig): settingsActionTypes => ({
  type: 'GET_CONFIG',
  payload: data
});

export const loadSettings = (status: boolean): settingsActionTypes => ({
  type: 'LOAD',
  payload: status
});

export const cloningRepo = (status: boolean): settingsActionTypes => ({
  type: 'CLONING',
  payload: status
});

export const errorWithCloning = (status: boolean): settingsActionTypes => ({
  type: 'ERROR_CLONING',
  payload: status
});


export const getConfigThunk = (history: History) => (dispatch: Dispatch<settingsActionTypes>) => {
  dispatch(loadSettings(true));
  api.getConfig()
    .then(response => {
      if (response.status === 200) {
        if (history.location.pathname !== '/history') {
          history.push('/history');
          dispatch(loadSettings(false));
          dispatch(addConfig(response.data));
        }
      } else {
        history.push('/');
        dispatch(loadSettings(false));
      }
    }).catch(err => console.log(err));
}

export const postSaveSettings = (data: Config, history: History) => (dispatch: Dispatch<settingsActionTypes>) => {
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
