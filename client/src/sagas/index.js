import { all } from 'redux-saga/effects';
import { labelSagas } from '../modules/label';
import { memoSagas } from '../modules/memo';

export default function* () {
  yield all([
    labelSagas(),
    memoSagas()
  ]);
}