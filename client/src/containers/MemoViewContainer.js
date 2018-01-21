import './MemoViewContainer.css';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { UPDATE_MEMO, REMOVE_MEMO, REMOVE_MEMO_LABEL } from '../modules/memo';

import Panel from '../components/Panel';
import EditableMemo from '../components/EditableMemo';

class MemoViewContainer extends PureComponent {
  static propTypes = {
    isNowUpdating: PropTypes.bool,
    memos: PropTypes.array,
    selectedMemo: PropTypes.object
  };

  handleMemoUpdate = (memo) => {
    const { dispatch } = this.props;
    dispatch({
      type: UPDATE_MEMO,
      payload: {
        memo
      }
    });
  }

  handleRemove = (memoId) => {
    if(window.confirm('메모를 삭제하시겠습니까?')) {
      const { dispatch } = this.props;

      dispatch({
        type: REMOVE_MEMO,
        payload: {
          memoId
        }
      });
    }
  };

  handleRemoveLabel = (labelId) => {
    const { selectedMemo, dispatch } = this.props;

    if (selectedMemo) {
      dispatch({
        type: REMOVE_MEMO_LABEL,
        payload: {
          memoId: selectedMemo._id,
          labelId
        }
      });
    }
  };

  render() {
    const { isNowUpdating, memos, selectedMemo, onShowLabelMappingModal } = this.props;
    return (
      <Panel className="MemoViewContainer selected-memo-view">
        { 
          selectedMemo !== null && 
          <EditableMemo isNowUpdating={isNowUpdating}
            memo={selectedMemo} 
            onShowLabelMappingModal={onShowLabelMappingModal}
            onUpdate={this.handleMemoUpdate} 
            onRemove={this.handleRemove}
            onRemoveLabel={this.handleRemoveLabel}
          />
        }
        {
          memos && memos.length > 0 && selectedMemo === null &&
          <div className="empty-memo">메모를 선택해주세요.</div>
        }
      </Panel>
    );
  }
}

const mapStateToProps = (state) => {
  const { memo } = state;
  const { isNowUpdating, memos, selectedMemo } = memo;

  return {
    isNowUpdating,
    memos,
    selectedMemo
  };
};

export default withRouter(connect(mapStateToProps)(MemoViewContainer));