import axios from 'axios';

const API = 'http://localhost:3001';

export async function fetchLabels () {
  try {
    const res = await axios.get(`${API}/api/labels`);
    
    return res && res.data && res.data.labels;
  } catch (e) {
    throw e;
  }
}

export async function createLabel () {
  try {
    const res = await axios.post(`${API}/api/labels`, {
      name: ''
    });

    return res && res.data && res.data.createdLabel;
  } catch (e) {
    throw e;
  }
}

export async function updateLabel (label) {
  try {
    const { _id, name } = label;
    const res = await axios.put(`${API}/api/labels/${_id}`, {
      _id,
      name
    });
    
    return res && res.data && res.data.updatedLabel;
  } catch (e) {
    throw e;
  }
}

export async function removeLabel (labelId) {
  try {
    const res = await axios.delete(`${API}/api/labels/${labelId}`);

    return res && res.data && res.data.isRemoved;
  } catch (e) {
    throw e
  }
}