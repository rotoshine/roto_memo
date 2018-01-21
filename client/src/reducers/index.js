import { combineReducers } from 'redux';
import label from '../modules/label';
import memo from '../modules/memo';

export default combineReducers({
  label,
  memo
});