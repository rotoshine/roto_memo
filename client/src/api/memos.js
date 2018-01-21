import axios from 'axios';

const API = 'http://localhost:3001';

export async function fetchMemos (labelId) {
  try {
    const querystring = labelId ? `labelId=${labelId}` : '';

    const res = await axios.get(`${API}/api/memos?${querystring}`);

    return res && res.data.memos;
  } catch (e) {
    throw e;
  }
}

export async function createMemo (labelId) {
  try {
    const res = await axios.post(`${API}/api/memos`, {
      title: '',
      content: '',
      labels: [labelId]
    });

    return res && res.data.createdMemo;
  } catch (e) {
    throw e;
  }
}

export async function updateMemo (memo) {
  try {
    const { _id, title, content } = memo;
    const res = await axios.put(`${API}/api/memos/${_id}`, {
      title,
      content
    });

    return res && res.data && res.data.updatedMemo;
  } catch (e) {
    throw e;
  }
}

export async function updateMemosAndLabels ({ memoIds, labelIds }) {
  const payload = {
    memoIds,
    labelIds
  };

  try {
    const res = await axios.put(`${API}/api/memos`, payload);

    return res && res.data && res.data.isUpdated;
  } catch (e) {
    throw e;
  }
}

export async function fetchTotalMemoCount () {
  try {
    const res = await axios.get(`${API}/api/memos/count`);

    return res && res.data && res.data.count;
  } catch (e) {
    throw e
  }
}

export async function removeMemo (memoId) {
  try {
    const res = await axios.delete(`${API}/api/memos/${memoId}`);

    return res && res.data && res.data.isRemoved;
  } catch (e) {
    throw e;
  }
}

export async function removeMemoLabel (memoId, labelId) {
  try {
    const res = await axios.delete(`${API}/api/memos/${memoId}/labels/${labelId}`);

    return res && res.data && res.data.updatedMemo;
  } catch (e) {
    throw e;
  }
}