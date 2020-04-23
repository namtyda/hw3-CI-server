import { api, getBuilds, Status, responseAddQueue, addQueue } from '../api/api';
import { Dispatch } from 'react';
import { History } from 'history';
export interface initianStateDetails {
  isLoading: boolean;
  repoName: string;
  buildInfo: {};
  rebuildInfo: {};
  logs: string
}

export const initianState: initianStateDetails = {
  isLoading: false,
  repoName: '',
  buildInfo: {},
  rebuildInfo: {},
  logs: ''
};

interface detailsAction<T, D> {
  type: T;
  payload: D;
}

enum actionType {
  GET_BUILD_INFO = 'GET_BUILD_INFO',
  LOAD_TOGGLE = 'LOAD_TOGGLE',
  GET_REPONAME = 'GET_REPONAME',
  GET_REBUILD_INFO = 'GET_REBUILD_INFO',
  GET_LOGS = 'GET_LOGS'
}

interface detailsPayload {
  isLoading: boolean;
  repoName: string;
  buildInfo: getBuilds<Status>
  rebuildInfo: responseAddQueue,
  logs: string;
}

export function detailsReducer(state = initianState, action: detailsAction<actionType, detailsPayload>) {
  switch (action.type) {
    case 'GET_BUILD_INFO':
      return { ...state, buildInfo: { ...action.payload } };
    case 'LOAD_TOGGLE':
      return { ...state, isLoading: action.payload };
    case 'GET_REPONAME':
      return { ...state, repoName: action.payload };
    case 'GET_REBUILD_INFO':
      return { ...state, rebuildInfo: { ...action.payload } };
    case 'GET_LOGS':
      return { ...state, logs: action.payload };
    default:
      return state;
  }
}
interface actionLoading {
  type: 'LOAD_TOGGLE';
  payload: boolean;
}
interface actionGetInfo {
  type: 'GET_BUILD_INFO';
  payload: getBuilds<Status>;
}
interface actionGetRepoName {
  type: 'GET_REPONAME';
  payload: string;
}

interface actionGetLogs {
  type: 'GET_LOGS';
  payload: string;
}
interface actionGetRebuildInfo {
  type: 'GET_REBUILD_INFO';
  payload: getBuilds<Status>[] | string;
}

export type DetailsActionsTypes =
  actionLoading |
  actionGetLogs |
  actionGetInfo |
  actionGetRebuildInfo |
  actionGetRepoName

export const loading = (data: boolean): DetailsActionsTypes => ({
  type: 'LOAD_TOGGLE',
  payload: data
});

export const getInfo = (data: getBuilds<Status>): DetailsActionsTypes => ({
  type: 'GET_BUILD_INFO',
  payload: data
});

export const getRepoName = (data: string): DetailsActionsTypes => ({
  type: 'GET_REPONAME',
  payload: data
});

export const getRebuildInfo = (data: string): DetailsActionsTypes => ({
  type: 'GET_REBUILD_INFO',
  payload: data
});

export const getLogs = (data: string): DetailsActionsTypes => ({
  type: 'GET_LOGS',
  payload: data
});

export const getDetailsBuild = (data: string, history: History) => (dispatch: Dispatch<DetailsActionsTypes>) => {
  dispatch(loading(true));
  api.getDetailsBuild(data)
    .then(res => {
      dispatch(getInfo(res.data));

      if (res.data.status === 'Success') {
        return api.getLogs(res.data.id)
          .then(res => {
            dispatch(getLogs(res.data));
            dispatch(loading(false));
          }).catch(err => console.log(err));
      }
      dispatch(getLogs(''));
      dispatch(loading(false));
      return;
    }).catch(err => {
      dispatch(loading(false));
      console.log(err);
    });

  api.getConfig()
    .then(res => {
      if (res.status === 200) {
        dispatch(getRepoName(res.data.repoName));
      } else {
        history.push('/history');
        dispatch(getRepoName('No settings in the config'));
      }
    }).catch(err => console.log(err));
}

export const postBuildInQueue = (data: addQueue, history: History) => (dispatch: Dispatch<DetailsActionsTypes>) => {
  dispatch(loading(true));
  api.postAddQueue(data)
    .then(res => {
      console.log(res)
      dispatch(getRebuildInfo(res.data));
      history.push(`${res.data.id}`);
      dispatch(loading(false));
    })
    .catch(err => {
      console.log(err)
      dispatch(loading(false));
    });
}
