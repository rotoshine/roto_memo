import './Labels.css';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ActionButton from './ActionButton';
import List from './List';

export default class Labels extends PureComponent {
  static propTypes = {
    isNowFetching: PropTypes.bool,
    labels: PropTypes.array,
    selectedLabel: PropTypes.object,
    totalMemoCount: PropTypes.number,
    onSelectLabel: PropTypes.func.isRequired,
    onCreateLabel: PropTypes.func.isRequired,
    onRemoveLabel: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      editLabel: null
    };
  }

  handleLabelCreateClick = () => {
    this.props.onCreateLabel((createdLabel) => {
      this.setState({ editLabel: createdLabel }, () => {
        this.editLabelInput.focus();
      });
    });
  };

  handleLabelEditClick = (editLabel, e) => {
    e.stopPropagation();
    this.setState({
      editLabel: Object.assign({}, editLabel)
    }, () => {
      this.editLabelInput.focus();
    });
  };

  handleLabelRemoveClick = (label, e) => {
    e.stopPropagation();
    this.props.onRemoveLabel(label);
  }

  handleLabelUpdate = () => {
    const { editLabel } = this.state;

    this.props.onUpdateLabel(editLabel);
  
    this.setState({
      editLabel: null
    });
  }

  renderLabelComponent(label) {
    const labelName = label.name.length > 0 ? label.name : '새로운 Label';
    return (
      <div>
        <span>{labelName}</span>
        <span>({label.memoCount})</span>
      </div>
    );
  }

  render() {
    const { editLabel } = this.state;
    const { isNowFetching, labels, selectedLabel, totalMemoCount, onSelectLabel, onCreateLabel } = this.props;

    const allLabelComponent = (
      <li className={`label ${selectedLabel === null && 'selected'}`} onClick={() => onSelectLabel(null)}>
        <div className="label-text">
          <span>전체메모</span>
          <span>({totalMemoCount})</span>
        </div>
        <div className="label-actions" />
      </li>
    );


    const headerActions = (
      <div className="label-actions">
        <ActionButton primary iconName="fa-plus" onClick={onCreateLabel} />
      </div>
    );

    const editLabelComponent = editLabel ? (
      <div>
        <input ref={(ref) => this.editLabelInput = ref}
          value={editLabel.name}
          onChange={(e) => {
            const nextEditLabel = Object.assign({}, this.state.editLabel);
            nextEditLabel.name = e.target.value;
            this.setState({ editLabel: nextEditLabel });
          }}
          onBlur={() => this.handleLabelUpdate()}
          onKeyDown={(e) => {
            const ENTER_KEYCODE = 13;
            const ESC_KEYCODE = 27;
            if (e.keyCode === ENTER_KEYCODE) {
              this.handleLabelUpdate();
            }

            if (e.keyCode === ESC_KEYCODE) {
              this.setState({
                editLabel: null
              });
            }
          }}
        />
      </div>
    ) : null;

    return (
      <div className="Labels">
        <List header="Label"
          headerActions={headerActions}
          isNowFetching={isNowFetching}
          items={labels}
          extraListItems={allLabelComponent}
          renderItem={(label, i) => {
            const isEditMode = editLabel && editLabel._id === label._id;
            return (
              <li key={i} className={`label ${selectedLabel && selectedLabel._id === label._id && 'selected'}`} onClick={() => onSelectLabel(label)}>
                {isEditMode ? editLabelComponent : this.renderLabelComponent(label)}
                <div className="label-actions">
                  <ActionButton style={{ marginTop: -10 }}
                    info
                    iconName="fa-edit"
                    onClick={this.handleLabelEditClick.bind(this, label)} />
                  <ActionButton style={{ marginTop: -10 }}
                    danger
                    iconName="fa-remove"
                    onClick={this.handleLabelRemoveClick.bind(this, label)} />
                </div>
              </li>
            );
          }}
        />
      </div>
    );
  }
};
