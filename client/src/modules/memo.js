import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { 
  fetchMemos, 
  createMemo, 
  updateMemo, 
  updateMemosAndLabels, 
  removeMemo,
  removeMemoLabel 
} from '../api/memos';
import update from 'immutability-helper';
import { FETCH_LABELS } from './label';

// actions
export const INITIALIZE_MEMO = '@memos/INITIALIZE_MEMO';
export const INITIALIZE_MEMO_SUCCESS = '@memos/INITIALIZE_MEMO_SUCCESS';
export const INITIALIZE_MEMO_FAIL = '@memos/INITIALIZE_MEMO_FAIL';

export const FETCH_MEMOS = '@memos/FETCH_MEMOS';
export const FETCH_MEMOS_SUCCESS = '@memos/FETCH_MEMOS_SUCCESS';
export const FETCH_MEMOS_FAIL = '@memos/FETCH_MEMOS_FAIL';

export const CREATE_MEMO = '@memos/CREATE_MEMO';
export const CREATE_MEMO_SUCCESS = '@memos/CREATE_MEMO_SUCCESS';
export const CREATE_MEMO_FAIL = '@memos/CREATE_MEMO_FAIL';

export const UPDATE_MEMO = '@memos/UPDATE_MEMO';
export const UPDATE_MEMO_SUCCESS = '@memos/UPDATE_MEMO_SUCCESS';
export const UPDATE_MEMO_FAIL = '@memos/UPDATE_MEMO_FAIL';

export const UPDATE_MEMOS_AND_LABELS = '@memos/UPDATE_MEMOS_AND_LABELS';
export const UPDATE_MEMOS_AND_LABELS_SUCCESS = '@memos/UPDATE_MEMOS_AND_LABELS_SUCCESS';
export const UPDATE_MEMOS_AND_LABELS_FAIL = '@memos/UPDATE_MEMOS_AND_LABELS_FAIL';

export const REMOVE_MEMO = '@memos/REMOVE_MEMO';
export const REMOVE_MEMO_SUCCESS = '@memos/REMOVE_MEMO_SUCCESS';
export const REMOVE_MEMO_FAIL = '@memos/REMOVE_MEMO_FAIL';

export const REMOVE_MEMO_LABEL = '@memos/REMOVE_MEMO_LABEL';
export const REMOVE_MEMO_LABEL_SUCCESS = '@memos/REMOVE_MEMO_SUCCESS_LABEL';
export const REMOVE_MEMO_LABEL_FAIL = '@memos/REMOVE_MEMO_FAIL_LABEL';

export const REMOVE_MEMOS = '@memos/REMOVE_MEMOS';
export const REMOVE_MEMOS_SUCCESS = '@memos/REMOVE_MEMOS_SUCCESS';
export const REMOVE_MEMOS_FAIL = '@memos/REMOVE_MEMOS_FAIL';

export const SELECT_MEMO = '@memos/SELECT_MEMO';
export const CANCEL_SELECT_MEMO = '@memos/CANCEL_SELECT_MEMO';

const initialState = {
  initialize: false,
  isNowFetching: false,
  isNowUpdating: false,
  hasError: false,
  memos: null,
  selectedMemo: null
};

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_MEMO_SUCCESS:
      return update(state, {
        initialize: { $set: true }
      });
    case FETCH_MEMOS:
      return update(state, {
        isNowFetching: { $set: true }
      });      
    case FETCH_MEMOS_SUCCESS:
      return update(state, {
        isNowFetching: { $set: false },
        hasError: { $set: false },
        memos: { $set: action.payload.memos }
      });      
    case FETCH_MEMOS_FAIL:
      return update(state, {
        isNowFetching: { $set: false },
        hasError: { $set: false },
        memos: { $set: action.payload.memos }
      });
    case UPDATE_MEMO:
      return update(state, {
        isNowUpdating: { $set: true }
      });  
    case UPDATE_MEMO_SUCCESS: {
      return update(state, {
        isNowUpdating: { $set: false }
      });
    }
    case UPDATE_MEMO_FAIL: {
      return update(state, {
        isNowUpdating: { $set: false }
      });
    }

    case UPDATE_MEMOS_AND_LABELS: {
      return update(state, {
        isNowUpdating: { $set: true }        
      });
    }
    case UPDATE_MEMOS_AND_LABELS_SUCCESS: {
      return update(state, {
        isNowUpdating: { $set: false }
      });
    }
    case UPDATE_MEMOS_AND_LABELS_FAIL: {
      return update(state, {
        isNowUpdating: { $set: false }
      });
    } 
    case REMOVE_MEMOS: {
      return update(state, {
        isNowUpdating: { $set: true }
      });
    }
    case REMOVE_MEMOS_SUCCESS: {
      return update(state, {
        isNowUpdating: { $set: false }
      });
    }
    case REMOVE_MEMOS_FAIL: {
      return update(state, {
        isNowUpdating: { $set: false }
      });
    }
    case REMOVE_MEMO: {
      return update(state, {
        isNowUpdating: { $set: true }
      });
    }
    case REMOVE_MEMO_SUCCESS: {
      return update(state, {
        isNowUpdating: { $set: false }
      });
    }
    case REMOVE_MEMO_FAIL: {
      return update(state, {
        isNowUpdating: { $set: false }
      });
    }
    case SELECT_MEMO:
      return update(state, {
        selectedMemo: { $set: action.payload.selectedMemo }
      });
    case CANCEL_SELECT_MEMO:
      return update(state, {
        selectedMemo: { $set: null }
      });
    default:
      return state;
  }
}

// saga
export function* initializeMemoTask ({ payload: { selectedMemoId = null} = {}}) {  
  try {
    yield fetchMemosTask({ payload: { selectedMemoId }});
    yield put({
      type: INITIALIZE_MEMO_SUCCESS
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: INITIALIZE_MEMO_FAIL,
      paylaod: {
        message: e.message
      }
    });
  }
}

export function* fetchMemosTask ({ payload: { selectedMemoId = null } = {}}) {
  try {
    const selectedLabel = yield select((state) => state.label.selectedLabel);
    const memos = yield call(fetchMemos, selectedLabel ? selectedLabel._id : null);    

    yield put({
      type: FETCH_MEMOS_SUCCESS,
      payload: {
        memos
      }
    });

    if (memos.length > 0) {   
      const selectedMemo = selectedMemoId ? 
        memos.find((memo) => memo._id === selectedMemoId) :
        memos[0];

      yield put({
        type: SELECT_MEMO,
        payload: {
          selectedMemo
        }
      });
    }
  } catch (e) {
    yield put({
      type: FETCH_MEMOS_FAIL,
      payload: {
        message: e.message
      }
    });
  }
}

function* createMemoTask ({ payload: { labelId, onComplete }}) {
  try {
    const memo = yield call(createMemo, labelId);
    yield put({
      type: CREATE_MEMO_SUCCESS,
      payload: {
        memo
      }
    });

    yield put({
      type: FETCH_LABELS
    });

    yield fetchMemosTask({ payload: { labelId }});   

    yield put({
      type: SELECT_MEMO,
      payload: {
        selectedMemo: memo
      }
    });
  } catch (e) {
    yield put({
      type: CREATE_MEMO_FAIL,
      payload: {
        message: e.message
      }
    });
  }
}

function* updateMemosAndLabelsTask ({ payload: { labelIds, memoIds }}) {
  try {
    const result = yield call(updateMemosAndLabels, memoIds, labelIds);
    
    if (result) {
      yield put({
        type: UPDATE_MEMOS_AND_LABELS_SUCCESS
      });

      yield put({
        type: FETCH_LABELS
      });

      const selectedMemoId = memoIds[0];
      yield fetchMemosTask({ 
        payload: {
          selectedMemoId
        }        
      });
    }
  } catch (e) {
    yield put({
      type: UPDATE_MEMOS_AND_LABELS_FAIL,
      payload: {
        message: e.message
      }
    });
  }
}

function* updateMemoTask ({ payload: { memo }}) {
  try {
    const updatedMemo = yield call(updateMemo, memo);

    yield put({
      type: UPDATE_MEMO_SUCCESS,
    });

    yield fetchMemosTask({
      payload: {
        labelId: updatedMemo.label
      }
    });
  } catch (e) {
    yield put({
      type: UPDATE_MEMO_FAIL,
      payload: {
        message: e.message
      }
    });
  }
}

function* removeMemoTask ({ payload: { memoId }}) {
  try {
    const result = yield call(removeMemo, memoId);
    if (result) {
      const selectedLabel = yield select((state) => state.label.selectedLabel);
      const labelId = selectedLabel ? selectedLabel._id : null;
    
      yield put({
        type: REMOVE_MEMO_SUCCESS  
      });
          
      yield put({
        type: CANCEL_SELECT_MEMO
      });
      
      window.addNotification({
        message: '메모가 삭제되었습니다.',
        level: 'success'
      });

      yield put({
        type: FETCH_LABELS
      });

      yield fetchMemosTask({ payload: { labelId }});
    }
  } catch (e) {
    yield put({
      type: REMOVE_MEMO_FAIL,
      payload: {
        message: e.message
      }
    });
  }
}

function* removeMemoLabelTask ({ payload: { memoId, labelId }}) {
  try {
    // 낙관적 업데이트
    const selectedMemo = yield select((state) => state.memo.selectedMemo);

    const removeLabelIndex = selectedMemo.labels.indexOf(labelId);
    
    selectedMemo.labels.splice(removeLabelIndex, 1);

    yield put({
      type: SELECT_MEMO,
      payload: {
        selectedMemo
      }
    });
    
    const updatedMemo = yield call(removeMemoLabel, memoId, labelId);
    if (updatedMemo) {
      yield put({
        type: REMOVE_MEMO_LABEL_SUCCESS
      });

      // update memos
      yield fetchMemosTask({ payload: { labelId }});

      const selectedLabel = yield select((state) => state.label.selectedLabel);
      // update labels
      yield put({
        type: FETCH_LABELS,
        payload: {
          selectedLabelId: selectedLabel._id
        }
      });

      yield put({
        type: SELECT_MEMO,
        payload: {
          selectedMemo: updatedMemo
        }
      });
    }

  } catch (e) {
    yield put({
      type: REMOVE_MEMO_LABEL_FAIL,
      payload: {
        message: e.message  
      }
    });
  }
}

function* removeMemosTask ({ payload: { memoIds }}) {
  try {
    const results = yield all(memoIds.map((memoId) => call(removeMemo, memoId)));
    
    if (results.every((result) => result)) {
      yield put({
        type: REMOVE_MEMOS_SUCCESS
      });
      
      yield put({
        type: CANCEL_SELECT_MEMO
      });
      
      window.addNotification({
        message: `${memoIds.length} 건의 메모가 삭제되었습니다.`,
        level: 'success'
      });
  
      yield put({
        type: FETCH_LABELS
      });
  
      const selectedLabel = yield select((state) => state.label.selectedLabel);
      const labelId = selectedLabel ? selectedLabel._id : null;
    
      yield fetchMemosTask({ payload: { labelId }}); 
    }
  } catch (e) {
    yield put({
      type: REMOVE_MEMOS_FAIL,
      payload: {
        message: e.message
      }
    });
  }
}

function handleErrorTask({ payload: { message = '오류가 발생했습니다.'} = {}}) {
  window.addErrorNotification(message);
}

export function* memoSagas() {
  return [
    yield takeLatest(INITIALIZE_MEMO, initializeMemoTask),
    yield takeLatest(FETCH_MEMOS, fetchMemosTask),
    yield takeLatest(CREATE_MEMO, createMemoTask),
    yield takeLatest(UPDATE_MEMO, updateMemoTask),
    yield takeLatest(UPDATE_MEMOS_AND_LABELS, updateMemosAndLabelsTask),
    yield takeLatest(REMOVE_MEMO, removeMemoTask),
    yield takeLatest(REMOVE_MEMOS, removeMemosTask),
    yield takeLatest(REMOVE_MEMO_LABEL, removeMemoLabelTask),
    yield takeLatest(INITIALIZE_MEMO_FAIL, handleErrorTask),
    yield takeLatest(FETCH_MEMOS_FAIL, handleErrorTask),
    yield takeLatest(CREATE_MEMO_FAIL, handleErrorTask),
    yield takeLatest(UPDATE_MEMO_FAIL, handleErrorTask),
    yield takeLatest(UPDATE_MEMOS_AND_LABELS_FAIL, handleErrorTask),    
    yield takeLatest(REMOVE_MEMO_FAIL, handleErrorTask),
    yield takeLatest(REMOVE_MEMOS_FAIL, handleErrorTask),
    yield takeLatest(REMOVE_MEMO_LABEL_FAIL, handleErrorTask)    
  ];
}