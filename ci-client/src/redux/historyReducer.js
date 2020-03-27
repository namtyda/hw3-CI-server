import { api } from '../api/api';
const initialState = {
  isLoading: false,
  buildList: [],
  repoName: '',
  runNewBuild: false
}

export function historyReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_BUILD_LIST':
      return { ...state, buildList: [...action.payload] };
    case 'LOAD_TOGGLE':
      return { ...state, isLoading: action.payload };
    case 'GET_REPONAME':
      return { ...state, repoName: action.payload };
      case 'RUN_NEW_BUILD':
      return { ...state, runNewBuild: action.payload };
    default:
      return state;
  }
}

export const actionGetBuilds = (data) => ({
  type: 'GET_BUILD_LIST',
  payload: data
});

const loading = (data) => ({
  type: 'LOAD_TOGGLE',
  payload: data
});

const getRepoName = (data) => ({
  type: 'GET_REPONAME',
  payload: data
});

const addBuildInQueue = (status) => ({
  type: 'RUN_NEW_BUILD',
  payload: status
});

export const getBuildListThunk = (data) => (dispatch) => {
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

export const postNewBuildQueue = (data, history) => (dispatch) => {
  dispatch(addBuildInQueue(true));
  api.postAddQueue(data)
    .then(res => {
      history.push(`/build/${res.data.id}`);
      dispatch(addBuildInQueue(false));
    }).catch(err => {
      dispatch(addBuildInQueue(false));
      console.log(err);
    });
}
