import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { UPDATE_LABEL, CREATE_LABEL, REMOVE_LABEL } from '../modules/label';

import Panel from '../components/Panel';
import Labels from '../components/Labels';

import { defaultLabelName } from '../utils/stringUtils';

class LabelContainer extends PureComponent {
  handleSelectLabel = (selectedLabel) => {
    const { history } = this.props;

    if (selectedLabel) {
      history.push(`/labels/${selectedLabel._id}`);
    } else {
      history.push('/labels/all');
    }
  };

  handleCreateLabel = (onCompleteCallback) => {
    const { history, dispatch } = this.props;

    // 새로운 Label 생성 후 콜백을 실행하기 위해 payload에 callback을 넘김
    dispatch({
      type: CREATE_LABEL,
      payload: {
        onComplete: (createdLabel) => {
          history.push(`/labels/${createdLabel._id}`);
          typeof onCompleteCallback === 'function' && onCompleteCallback(createdLabel);
        }
      }
    });
  }

  handleUpdateLabel = (label) => {
    const { dispatch } = this.props;

    dispatch({
      type: UPDATE_LABEL,
      payload: {
        label
      }
    });
  };

  handleRemoveLabel = (label) => {
    if (window.confirm(`${defaultLabelName(label.name)} Label을 삭제하시겠습니까?`)) {
      const { dispatch } = this.props;

      dispatch({
        type: REMOVE_LABEL,
        payload: {
          label
        }
      });
    }    
  };

  render () {
    const { isNowFetching, labels, selectedLabel, editingLabel, totalMemoCount } = this.props;
    return (
      <Panel className="labels-wrapper">
        <Labels isNowFetching={isNowFetching}
          labels={labels}
          selectedLabel={selectedLabel}
          editingLabel={editingLabel}
          totalMemoCount={totalMemoCount}
          onSelectLabel={this.handleSelectLabel}
          onUpdateLabel={this.handleUpdateLabel}
          onCreateLabel={this.handleCreateLabel}
          onRemoveLabel={this.handleRemoveLabel}
        />
      </Panel>
    )
  }
}

const mapStateToProps = (state) => {
  const { label } = state;
  const {
    isNowFetching,
    labels,
    selectedLabel,
    editingLabel,
    totalMemoCount
  } = label;
  return {
    isNowFetching,
    labels,
    selectedLabel,
    editingLabel,
    totalMemoCount
  };
};

export default withRouter(connect(mapStateToProps)(LabelContainer));