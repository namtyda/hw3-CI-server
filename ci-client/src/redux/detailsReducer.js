import { api } from '../api/api';
export const initianState = {
  isLoading: false,
  repoName: '',
  buildInfo: {},
  rebuildInfo: {},
  logs: ''
};

export function detailsReducer(state = initianState, action) {
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

export const loading = (data) => ({
  type: 'LOAD_TOGGLE',
  payload: data
});

export const getInfo = (data) => ({
  type: 'GET_BUILD_INFO',
  payload: data
});

export const getRepoName = (data) => ({
  type: 'GET_REPONAME',
  payload: data
});

export const getRebuildInfo = (data) => ({
  type: 'GET_REBUILD_INFO',
  payload: data
});

export const getLogs = (data) => ({
  type: 'GET_LOGS',
  payload: data
});

export const getDetailsBuild = (data, history) => (dispatch) => {
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

export const postBuildInQueue = (data, history) => (dispatch) => {
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
