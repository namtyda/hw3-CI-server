import { getDetailsBuild, postBuildInQueue, DetailsActionsTypes } from '../../redux/detailsReducer';
import { rootReducerTypes } from '../../redux/root-reducer';
import { ThunkDispatch } from 'redux-thunk';
import { History } from 'history';
import { addQueue } from '../../api/api';

export const mapStateToProps = ({ details }: rootReducerTypes) => ({
  isLoading: details.isLoading,
  repoName: details.repoName,
  buildInfo: details.buildInfo,
  logs: details.logs
});

export const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, DetailsActionsTypes>) => ({
  getDetailsBuild: (match: string, history: History) => dispatch(getDetailsBuild(match, history)),
  postBuildInQueue: (obj: addQueue, history: History) => dispatch(postBuildInQueue(obj, history))
});