import { api, getBuilds, Status, addQueue } from '../api/api';
import { Dispatch } from 'react';
import { History } from 'history';

export interface initialStateHistory {
  isLoading: boolean;
  buildList: [];
  repoName: string;
  runNewBuild: boolean;
  errorPostReq: boolean;
}
export const initialState: initialStateHistory = {
  isLoading: false,
  buildList: [],
  repoName: '',
  runNewBuild: false,
  errorPostReq: false
}
enum actionTypes {
  GET_BUILD_LIST = 'GET_BUILD_LIST',
  LOAD_TOGGLE = 'LOAD_TOGGLE',
  GET_REPONAME = 'GET_REPONAME',
  RUN_NEW_BUILD = 'RUN_NEW_BUILD',
  ERROR_POST_REQ = 'ERROR_POST_REQ'
}

interface historyPayload {
  isLoading: boolean,
  buildList: Array<getBuilds<Status>>,
  repoName: string,
  runNewBuild: boolean,
  errorPostReq: boolean
}
interface historyActions<T, D> {
  type: T,
  payload: D[];
}
export function historyReducer(state = initialState, action: historyActions<actionTypes, historyPayload>) {
  switch (action.type) {
    case 'GET_BUILD_LIST':
      return { ...state, buildList: [...action.payload] };
    case 'LOAD_TOGGLE':
      return { ...state, isLoading: action.payload };
    case 'GET_REPONAME':
      return { ...state, repoName: action.payload };
    case 'RUN_NEW_BUILD':
      return { ...state, runNewBuild: action.payload };
    case 'ERROR_POST_REQ':
      return { ...state, errorPostReq: action.payload };
    default:
      return state;
  }
}

interface actionGetBuilds {
  type: 'GET_BUILD_LIST'
  payload: Array<getBuilds<Status>>;
}

interface loading {
  type: 'LOAD_TOGGLE';
  payload: boolean;
}
interface getRepoName {
  type: 'GET_REPONAME';
  payload: string;
}

interface addBuildInQueue {
  type: 'RUN_NEW_BUILD';
  payload: boolean;
}
interface errorOnRequestNewBuild {
  type: 'ERROR_POST_REQ';
  payload: boolean;
}

export type HistoryActionTypes =
  actionGetBuilds |
  loading |
  getRepoName |
  addBuildInQueue |
  errorOnRequestNewBuild


export const actionGetBuilds = (data: Array<getBuilds<Status>>): HistoryActionTypes => ({
  type: 'GET_BUILD_LIST',
  payload: data
});

export const loading = (data: boolean): HistoryActionTypes => ({
  type: 'LOAD_TOGGLE',
  payload: data
});

export const getRepoName = (data: string): HistoryActionTypes => ({
  type: 'GET_REPONAME',
  payload: data
});

export const addBuildInQueue = (status: boolean): HistoryActionTypes => ({
  type: 'RUN_NEW_BUILD',
  payload: status
});

export const errorOnRequestNewBuild = (data: boolean): HistoryActionTypes => ({
  type: 'ERROR_POST_REQ',
  payload: data
});


export const getBuildListThunk = (data: number) => (dispatch: Dispatch<HistoryActionTypes>) => {
  dispatch(loading(true));
  api.getBuildsList(data)
    .then(res => {
      dispatch(actionGetBuilds(res.data));
      dispatch(loading(false));
    }).catch(err => console.log(err));


  api.getConfig()
    .then(res => {
      if (res.status === 200) {
        dispatch(getRepoName(res.data.repoName));
      } else {
        dispatch(getRepoName('No settings in the config'));
      }
    }).catch(err => console.log(err));
}

export const postNewBuildQueue = (data: addQueue, history: History) => (dispatch: Dispatch<HistoryActionTypes>) => {
  dispatch(addBuildInQueue(true));
  api.postAddQueue(data)
    .then(res => {
      if (res.data.id) {
        history.push(`/build/${res.data.id}`);
        dispatch(addBuildInQueue(false));
      } else {
        dispatch(errorOnRequestNewBuild(true));
        dispatch(addBuildInQueue(false));
      }
    }).catch(err => {
      dispatch(errorOnRequestNewBuild(true));
      dispatch(addBuildInQueue(false));
      console.log(err);
    });
}
