import { getDetailsBuild, postBuildInQueue } from '../../redux/detailsReducer';

export const mapStateToProps = ({ details }) => ({
  isLoading: details.isLoading,
  repoName: details.repoName,
  buildInfo: details.buildInfo,
  logs: details.logs
});

export const mapDispatchToProps = (dispatch) => ({
  getDetailsBuild: (match, history) => dispatch(getDetailsBuild(match, history)),
  postBuildInQueue: (obj, history) => dispatch(postBuildInQueue(obj, history))
});