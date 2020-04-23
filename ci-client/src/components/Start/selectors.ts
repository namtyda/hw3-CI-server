import { getConfigThunk, settingsActionTypes } from '../../redux/settingsReducer';
import { rootReducerTypes } from '../../redux/root-reducer';
import { ThunkDispatch } from 'redux-thunk';
import { History } from 'history';
export const mapStateToProps = (store: rootReducerTypes) => {
  const { isLoad } = store.settings
  return { isLoad }
}
export const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, settingsActionTypes>) => ({
  getConfigThunk: (history: History) => dispatch(getConfigThunk(history))
})