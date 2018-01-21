import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import LabelContainer from './LabelContainer';
import MemoContainer from './MemoContainer';
import MemoViewContainer from './MemoViewContainer';
import { INITIALIZE_LABEL, SELECT_LABEL } from '../modules/label';
import { FETCH_MEMOS, CANCEL_SELECT_MEMO, SELECT_MEMO, UPDATE_MEMOS_AND_LABELS } from '../modules/memo';

import LabelMappingModal from '../components/LabelMappingModal';

class AppContainer extends PureComponent {
  static propTypes = {
    labels: PropTypes.array,
    memos: PropTypes.array,
    match: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showLabelMappingModal: false,
      selectedMemo: null,
      labelMappingMemos: []
    };
  }

  componentDidMount () {
    const { match, dispatch } = this.props;
    const { params } = match;
    const selectedLabelId = params.labelId;
    const selectedMemoId = params.memoId;

    dispatch({
      type: INITIALIZE_LABEL,
      payload: {
        selectedLabelId,
        selectedMemoId
      }
    });
  }

  componentWillReceiveProps (nextProps) {
    const { labels, dispatch } = this.props;
    const { labelId, memoId } = nextProps.match.params;

    if (labelId !== this.props.match.params.labelId) {       
      const selectedLabel = labelId ? labels.find((label) => label._id === labelId) : null;
      
      dispatch({
        type: SELECT_LABEL,
        payload: {
          selectedLabel
        }
      });

      dispatch({
        type: CANCEL_SELECT_MEMO
      });

      // labelId 변경 시 memo 다시 fetch 해오게 하기
      dispatch({
        type: FETCH_MEMOS
      });
    } 

    // 메모 선택 시 select 처리
    if (memoId && memoId !== this.props.match.params.memoId) {            
      const { memos } = this.props;

      let selectedMemo = null;

      if (memos.length > 0) {
        if (memoId) {
          selectedMemo = memos.find((memo) => memo._id === memoId);
        } else {
          selectedMemo = memos[0];
        }

        dispatch({
          type: SELECT_MEMO,
          payload: {
            selectedMemo
          }
        }); 
      }  
    }
  }

  showModal ({ memos, selectedMemo }) {
    this.setState({ 
      showLabelMappingModal: true,      
      selectedMemo,
      labelMappingMemos: memos
    });
  }

  closeModal () {
    this.setState({ 
      showLabelMappingModal: false,
      selectedMemo: null,
      labelMappingMemos: [] 
    });
  }

  handleModalSave = (memoIds, labelIds) => {
    const { dispatch } = this.props;

    dispatch({
      type: UPDATE_MEMOS_AND_LABELS,
      payload: {
        memoIds,
        labelIds
      }
    });

    this.closeModal();
  };

  render () {
    const { showLabelMappingModal, selectedMemo, labelMappingMemos } = this.state;
    const { labels } = this.props;

    return (      
      <section className="container">
        <LabelContainer />
        <MemoContainer onShowLabelMappingModal={(params) => this.showModal(params)} />
        <MemoViewContainer onShowLabelMappingModal={(params) => this.showModal(params)} />  
        { 
          showLabelMappingModal && 
          <LabelMappingModal labels={labels} 
            selectedMemo={selectedMemo}
            memos={labelMappingMemos}      
            onSave={this.handleModalSave} 
            onClose={() => this.closeModal()} />
        }      
      </section>
    );
  }
}

const mapStateToProps = ((state) => {
  const { label, memo } = state;

  return {
    labels: label.labels,
    memos: memo.memos
  }
});

export default withRouter(connect(mapStateToProps)(AppContainer));