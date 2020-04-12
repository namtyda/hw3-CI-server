import { getBuildListThunk, postNewBuildQueue } from '../../redux/historyReducer';
import { getConfigThunk } from '../../redux/settingsReducer';


export const mapStateToProps = ({ history }) => ({
  isLoading: history.isLoading,
  buildList: history.buildList,
  repoName: history.repoName,
  runNewBuild: history.runNewBuild,
  allBuildList: history.allBuildList,
  errorPostReq: history.errorPostReq
});

export const mapDispatchToProps = (dispatch) => ({
  getBuildListThunk: showLimit => dispatch(getBuildListThunk(showLimit)),
  postNewBuildQueue: (obj, history) => dispatch(postNewBuildQueue(obj, history)),
  getConfigThunk: history => dispatch(getConfigThunk(history))
});