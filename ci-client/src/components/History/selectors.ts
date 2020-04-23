import { getBuildListThunk, postNewBuildQueue, initialStateHistory, HistoryActionTypes } from '../../redux/historyReducer';
import { getConfigThunk } from '../../redux/settingsReducer';
import { rootReducerTypes } from '../../redux/root-reducer';
import { History } from 'history';
import { ThunkDispatch } from 'redux-thunk';


export const mapStateToProps = ({ history }: rootReducerTypes): initialStateHistory => ({
  isLoading: history.isLoading,
  buildList: history.buildList,
  repoName: history.repoName,
  runNewBuild: history.runNewBuild,
  errorPostReq: history.errorPostReq
});

export interface postNewBuild {
  commitHash: string;
}

export const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, HistoryActionTypes>) => ({
  getBuildListThunk: (showLimit: number) => dispatch(getBuildListThunk(showLimit)),
  postNewBuildQueue: (obj: postNewBuild, history: History) => dispatch(postNewBuildQueue(obj, history)),
  getConfigThunk: (history: History) => dispatch(getConfigThunk(history))
});