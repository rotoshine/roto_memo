import './EditableMemo.css';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ActionButton from '../components/ActionButton';
import Loading from './Loading';

import { format } from '../utils/dateFormat';
import { defaultLabelName } from '../utils/stringUtils';

const ENTER_KEYCODE = 13;
const ESC_KEYCODE = 27;

export default class EditableMemo extends PureComponent {
  static propTypes = {
    isNowUpdating: PropTypes.bool,
    memo: PropTypes.object,
    onShowLabelMappingModal: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onRemoveLabel: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const { memo = {}} = props;
    const { title, content } = memo;

    this.state = {
      title,
      content
    }
  }

  componentDidMount() {
    this.titleInput && this.titleInput.focus();
  }

  componentWillReceiveProps(nextProps) {
    const { memo } = this.props;
    const nextMemo = nextProps.memo;

    if (memo && nextMemo && (memo._id !== nextMemo._id)) {
      this.setState({
        title: nextMemo.title,
        content: nextMemo.content
      }, () => {
        this.titleInput && this.titleInput.focus();
      });
    }
  }

  changeFieldValue(fieldName, value) {
    this.setState({
      editMemo: Object.assign(
        {},
        this.state,
        {
          [fieldName]: value
        }
      )
    });
  }

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  }

  handleContentChange = (e) => {
    this.setState({ content: e.target.value });
  }

  handleUpdate = (e) => {
    const { title, content } = this.state;
    const { memo, onUpdate } = this.props;

    if (memo.title !== title || memo.content !== content) {
      onUpdate({
        _id: memo._id,
        title, 
        content 
      });
    }

  };

  handleRemoveLabel = (labelId, e) => {
    e.preventDefault();
    this.props.onRemoveLabel(labelId);
  };

  render() {
    const { title, content } = this.state;
    const { isNowUpdating, memo, onShowLabelMappingModal, onRemove } = this.props;

    if (!memo) {
      return null;
    }

    const { updatedAt } = memo;

    return (
      <section className="EditableMemo">
        <header className="header">
          <input ref={(ref) => this.titleInput = ref}
            type="text"
            value={title}
            placeholder="새로운 메모"
            tabIndex={1}
            onKeyDown={(e) => {
              if (e.keyCode === ENTER_KEYCODE) {
                this.contentTextArea.focus();
              } else if (e.keyCode === ESC_KEYCODE) {
                this.titleInput.blur();
              }

            }}
            onChange={this.handleTitleChange}
            onBlur={this.handleUpdate} />
          <div className="actions">
            <ActionButton style={{ marginTop: 10 }} 
            iconName="fa-tag" 
            onClick={() => {
              onShowLabelMappingModal({ selectedMemo: this.props.memo });
            }} />
            <ActionButton danger iconName="fa-remove" onClick={() => onRemove(memo._id)} />
          </div>
        </header>
        <div className="info">
          <div className="labels">
            {
              memo.labels.map((label, i) => {                
                return (
                  <div className="label" key={i}>  
                    {defaultLabelName(label.name)}
                    <button className="label-remove-button" onClick={this.handleRemoveLabel.bind(this, label._id)}>
                      <i className="fa fa-remove" />
                    </button>
                  </div>
                );
              })
            }
          </div>
          <div className="updated-at">
            {isNowUpdating && <Loading />}
            {
              !isNowUpdating &&
              <span className="updated-at-text">수정된 시간 : {format(updatedAt)}</span>
            }
          </div>        
        </div>
        <textarea ref={(ref) => this.contentTextArea = ref}
          className="content-editor"
          placeholder="메모 내용을 입력하세요."
          value={content}
          tabIndex={2}
          onKeyDown={(e) => {
            if (e.keyCode === ESC_KEYCODE) {
              this.contentTextArea.blur();
            }
          }}
          onChange={this.handleContentChange}
          onBlur={this.handleUpdate} />
      </section>
    )
  }
}
