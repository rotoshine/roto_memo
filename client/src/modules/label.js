import { call, put, takeLatest, select } from 'redux-saga/effects';
import update from 'immutability-helper';

import { fetchLabels, createLabel, updateLabel, removeLabel } from '../api/labels';
import { fetchTotalMemoCount } from '../api/memos';
import { INITIALIZE_MEMO } from './memo';

// actions
export const INITIALIZE_LABEL = '@labels/INITIALIZE_LABEL';
export const INITIALIZE_LABEL_SUCCESS = '@labels/INITIALIZE_LABEL_SUCCESS';
export const INITIALIZE_LABEL_FAIL = '@labels/INITIALIZE_LABEL_FAIL';

export const FETCH_LABELS = '@labels/FETCH_LABELS';
export const FETCH_LABELS_SUCCESS = '@labels/FETCH_LABELS_SUCCESS';
export const FETCH_LABELS_FAIL = '@labels/FETCH_LABELS_FAIL';

export const CREATE_LABEL = '@labels/CREATE_LABEL';
export const CREATE_LABEL_SUCCESS = '@labels/CREATE_LABEL_SUCCESS';
export const CREATE_LABEL_FAIL = '@labels/CREATE_LABEL_FAIL';

export const UPDATE_LABEL = '@labels/UPDATE_LABEL';
export const UPDATE_LABEL_SUCCESS = '@labels/UPDATE_LABEL_SUCCESS';
export const UPDATE_LABEL_FAIL = '@labels/UPDATE_LABEL_FAIL';

export const REMOVE_LABEL = '@labels/REMOVE_LABEL';
export const REMOVE_LABEL_SUCCESS = '@labels/REMOVE_LABEL_SUCCESS';
export const REMOVE_LABEL_FAIL = '@labels/REMOVE_LABEL_FAIL';

export const SET_LABELS = '@labels/SET_LABELS';
export const SELECT_LABEL = '@labels/SELECT_LABEL';
export const CANCEL_SELECT_LABEL = '@labels/CANCEL_SELECT_LABEL';

const initialState = {
  initialize: false,
  isNowFetching: false,
  hasError: false,
  labels: null,
  totalMemoCount: 0,
  selectedLabel: null,
  editingLabel: null
};

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_LABEL_SUCCESS:
      return update(state, {
        initialize: { $set: true }
      });
    case FETCH_LABELS:
      return update(state, {
        isNowFetching: { $set: true }
      });      
    case FETCH_LABELS_SUCCESS:
      return update(state, {
        isNowFetching: { $set: false },
        hasError: { $set: false },
        labels: { $set: action.payload.labels },
        totalMemoCount: { $set: action.payload.totalMemoCount }
      });      
    case FETCH_LABELS_FAIL:
      return update(state, {
        isNowFetching: { $set: false },
        hasError: { $set: false },
        labels: { $set: action.payload.labels }
      });
    case SET_LABELS:
      return update(state, {
        labels: { $set: action.payload.labels }
      });
    case SELECT_LABEL:
      return update(state, {
        selectedLabel: { $set: action.payload.selectedLabel }
      });
    case CANCEL_SELECT_LABEL:
      return update(state, {
        selectedLabel: { $set: null }
      });
    default:
      return state;
  }
}

// saga
function* initializeLabelTask ({ payload: { selectedLabelId = null, selectedMemoId = null} = {}}) {
  try {
    yield fetchLabelsTask({ payload: { selectedLabelId }});
    
    yield put({
      type: INITIALIZE_LABEL_SUCCESS
    });

    
    yield put({ 
      type: INITIALIZE_MEMO,
      payload: { selectedMemoId }
    });
    
  } catch (e) {
    yield put({
      type: INITIALIZE_LABEL_FAIL,
      payload: {
        message: e.message
      }
    });
  }
}

function* fetchLabelsTask ({ payload: { selectedLabelId } = {}}) { 
  try {
    const labels = yield call(fetchLabels);
    const totalMemoCount = yield call(fetchTotalMemoCount);
    
    yield put({
      type: FETCH_LABELS_SUCCESS,
      payload: {
        labels,
        totalMemoCount
      }
    });

    if (selectedLabelId) {
      const selectedLabel = labels.find((label) => label._id === selectedLabelId);
      
      if (selectedLabel) {
        yield put({
          type: SELECT_LABEL,
          payload: {
            selectedLabel
          }
        });
      }
    } 
  } catch (e) {
    yield put({
      type: FETCH_LABELS_FAIL,
      payload: {
        message: e.message
      }
    });
  }
}

function* createLabelTask ({ payload: { onComplete }}) {
  try {
    const createdLabel = yield call(createLabel);

    yield put({
      type: CREATE_LABEL_SUCCESS
    });

    window.addNotification(
      {
        message: '새로운 Label이 생성 되었습니다.',
        level: 'success'
      }
    )
    const labels = yield select((state) => state.label.labels);

    yield put({
      type: SET_LABELS,
      payload: {
        labels: [createdLabel, ...labels]
      }
    });

    typeof onComplete === 'function' && onComplete(createdLabel);
  } catch (e) {
    yield put({
      type: CREATE_LABEL_FAIL,
      payload: {
        message: e.message
      }
    });
  }
}

function* updateLabelTask ({ payload: { label }}) {
  try {
    // 낙관적 업데이트
    const labels = yield select((state) => state.label.labels);
    const updatedLabels = labels.map((looper) => {
      return label._id === looper._id ? label : looper;
    });

    yield put({
      type: SET_LABELS,
      payload: {
        labels: updatedLabels
      }
    });

    yield put({
      type: SELECT_LABEL,
      payload: {
        selectedLabel: label
      }
    });

    yield call(updateLabel, label);

    yield put({
      type: UPDATE_LABEL_SUCCESS
    });
    
  } catch (e) {
    yield put({
      type: UPDATE_LABEL_FAIL,
      payload: {
        message: e.message
      }
    });
  }
}

function* removeLabelTask({ payload: { label }}) {
  try {
    const result = yield call(removeLabel, label._id);
    if (result) {
      yield put({
        type: REMOVE_LABEL_SUCCESS
      });

      window.addNotification({
        message: `Label이 설정적으로 삭제되었습니다.`,
        level: 'success'
      });

      // 선택된 라벨이 지워진 거면 선택 취소 시킴
      const selectedLabel = yield select((state) => state.label.selectedLabel);

      if (selectedLabel && selectedLabel._id === label._id) {
        yield put({
          type: CANCEL_SELECT_LABEL
        });

        yield fetchLabelsTask();
      } else {
        yield fetchLabelsTask({ payload: { selectedLabelId: label._id }});
      }      
    }
  } catch (e) {
    yield put({
      type: REMOVE_LABEL_FAIL,
      payload: {
        message: e.message
      }
    });
  }
}

function handleErrorTask({ payload: { message = '오류가 발생했습니다.'} = {}}) {
  window.addErrorNotification(message);
}

export function* labelSagas() {
  return [
    yield takeLatest(INITIALIZE_LABEL, initializeLabelTask),
    yield takeLatest(FETCH_LABELS, fetchLabelsTask),
    yield takeLatest(CREATE_LABEL, createLabelTask),
    yield takeLatest(UPDATE_LABEL, updateLabelTask),
    yield takeLatest(REMOVE_LABEL, removeLabelTask),
    yield takeLatest(FETCH_LABELS_FAIL, handleErrorTask),
    yield takeLatest(CREATE_LABEL_FAIL, handleErrorTask),
    yield takeLatest(UPDATE_LABEL_FAIL, handleErrorTask),
    yield takeLatest(REMOVE_LABEL_FAIL, handleErrorTask)
  ];
}