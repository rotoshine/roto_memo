import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { CREATE_MEMO, REMOVE_MEMOS } from '../modules/memo';

import Panel from '../components/Panel';
import MemoItems from '../components/MemoItems';

class MemoContainer extends PureComponent {  
  handleCreateMemo = () => {
    const { selectedLabel, dispatch } = this.props;
    
    dispatch({
      type: CREATE_MEMO,
      payload: {
        labelId: selectedLabel._id
      }
    });
  };

  handleMemoClick = (selectedMemo) => {
    const { selectedLabel, history } = this.props;

    const selectedLabelId = selectedLabel ? selectedLabel._id : 'all';
    history.push(`/labels/${selectedLabelId}/memo/${selectedMemo._id}`);
  };

  handleMemosRemove = (memoIds) => {
    const { dispatch } = this.props;

    dispatch({
      type: REMOVE_MEMOS,
      payload: {
        memoIds
      }
    });
  }
  render() {
    const { isNowFetching, selectedLabel, selectedMemo, memos, onShowLabelMappingModal } = this.props;
    return (
      <Panel className="memos-wrapper">
        {
          <MemoItems isNowFetching={isNowFetching}
            selectedLabel={selectedLabel}
            selectedMemo={selectedMemo}
            memos={memos}
            onShowLabelMappingModal={onShowLabelMappingModal}
            onClick={this.handleMemoClick}
            onCreateMemo={this.handleCreateMemo}
            onRemoveMemo={this.handleMemosRemove}
          />
        }
      </Panel>
    );
  }
}

const mapStateToProps = (state) => {
  const { label, memo } = state;

  const { selectedLabel } = label;
  const { isNowFetching, selectedMemo, memos } = memo;

  return {
    isNowFetching,
    selectedLabel,
    selectedMemo,
    memos
  };
};

export default withRouter(connect(mapStateToProps)(MemoContainer));