import { combineReducers } from 'redux';
import { settingsReducer } from './settingsReducer';
import { historyReducer } from './historyReducer';
import { detailsReducer } from './detailsReducer';

export default combineReducers({
  settings: settingsReducer,
  history: historyReducer,
  details: detailsReducer
});