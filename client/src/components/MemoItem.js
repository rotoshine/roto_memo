import './MemoItem.css';
import React from 'react';
import PropTypes from 'prop-types';

import { format } from '../utils/dateFormat';

const MemoItem = ({ memo, isSelected = false, isChecked = false, onChecked, onClick }) => (
  <article className={`MemoItem ${isSelected ? 'selected' : ''}`} onClick={() => onClick(memo)}>
    <input type="checkbox" checked={isChecked} onChange={(e) => {
      e.stopPropagation();
      onChecked(memo._id);
    }} />
    <div className="memo-item">
      <div className="head">
        {
          memo.title.length === 0 &&
          <h3 className="empty-tittle">새로운 메모</h3>
        }
        <h3>{memo.title}</h3>
        <div className="updated-at">{format(memo.updatedAt)}</div>
      </div>
      <div className="memo-content">{memo.content}</div>
    </div>    
  </article>
);

MemoItem.propTypes = {
  memo: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  isChecked: PropTypes.bool.isRequired,
  onChecked: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};

export default MemoItem;