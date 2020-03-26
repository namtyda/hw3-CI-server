import { combineReducers } from 'redux';
import { settingsReducer } from './settingsReducer';
import { historyReducer } from './historyReducer';

export default combineReducers({
  settings: settingsReducer,
  history: historyReducer
});