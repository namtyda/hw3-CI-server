import { api } from '../api/api';
const initialState = {
  isLoading: false,
  buildList: []
}

export function historyReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_BUILD_LIST':
      return { ...state, buildList: [...action.payload] };
    case 'LOAD_TOGGLE':
      return { ...state, isLoading: action.payload };
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

export const getBuildListThunk = () => (dispatch) => {
  dispatch(loading(true));
  api.getBuildsList()
    .then(res => {
      dispatch(actionGetBuilds(res.data));
      dispatch(loading(false));
    });
}