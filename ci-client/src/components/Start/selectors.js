import { getConfigThunk } from '../../redux/settingsReducer';
export const mapStateToProps = (store) => {
  const { isLoad } = store.settings
  return { isLoad }
}
export const mapDispatchToProps = (dispatch) => ({
  getConfigThunk: history => dispatch(getConfigThunk(history))
})