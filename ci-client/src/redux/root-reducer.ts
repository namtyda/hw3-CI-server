import { combineReducers } from 'redux';
import { settingsReducer, initialStateSettings } from './settingsReducer';
import { historyReducer, initialStateHistory } from './historyReducer';
import { detailsReducer, initianStateDetails } from './detailsReducer';

export interface rootReducerTypes {
  settings: initialStateSettings;
  history: initialStateHistory;
  details: initianStateDetails;
}

export default combineReducers({
  settings: settingsReducer,
  history: historyReducer,
  details: detailsReducer
});