import './LabelMappingModal.css'

import React, { PureComponent } from 'react';

import Modal from './Modal';
import Panel from './Panel';
import ActionButton from './ActionButton';

import { defaultLabelName } from '../utils/stringUtils';

export class LabelMappingModal extends PureComponent {
  constructor(props) {
    super(props);

    const { labels, selectedMemo } = this.props;  
    
    const checkableLabels = labels.map((label) => {      
      const isChecked = selectedMemo && selectedMemo.labels.findIndex((l) => {        
        return l._id === label._id;
      }) > -1;

      return Object.assign({}, label, {
        isChecked
      });
    });

    this.state = {
      checkableLabels
    };
  }

  handleSave = (e) => {
    const { checkableLabels } = this.state;
    const { selectedMemo, memos } = this.props;

    const memoIds = selectedMemo ? [selectedMemo._id] : 
      memos.map((memo) => memo._id);
    
    this.props.onSave({
      memoIds,
      labelIds: checkableLabels.filter((label) => label.isChecked).map((label) => label._id)
    });
  };

  handleChecked = (index) => {    
    const checkableLabels = [...this.state.checkableLabels];

    checkableLabels[index].isChecked = !checkableLabels[index].isChecked;

    this.setState({
      checkableLabels
    });
  };

  render() {
    const { checkableLabels } = this.state;
    const {  selectedMemo, memos, onClose } = this.props;

    return (
      <Modal width={500} height={300}>
        <Panel className="LabelMappingModal">
          <header className="modal-header">
            <h3>Label 지정</h3>
          </header>
          <div className="modal-content">
            {
              selectedMemo && 
              <div>{
                selectedMemo.title.length === 0 ? '새로운 메모' : 
                selectedMemo.title}의 Label을 지정합니다.</div>
            }
            {
              memos && memos.length > 1 &&
              <div>
                <div>{memos.length} 개의 메모의 Label을 지정합니다.</div>
                <div>
                  {memos.map((memo) => <div key={memo._id}>{memo.title}</div> )}
                </div>
              </div>
            }
            <ul className="labels">              
              {checkableLabels.map((label, i) => {
                const elementId = `label${i}`;
                return (
                  <li key={elementId}>
                    <input id={elementId} 
                      type="checkbox" 
                      defaultChecked={label.isChecked}
                      checked={label.isChecked} 
                      onChange={() => this.handleChecked(i)}
                    />
                    <label htmlFor={elementId}>{defaultLabelName(label.name)}</label>
                  </li>
                );                
              })}
            </ul>
          </div>          
          <footer className="buttons">
            <ActionButton primary iconName="fa-save" onClick={this.handleSave} />
            <ActionButton iconName="fa-close" onClick={onClose} />
          </footer>
        </Panel>
      </Modal>
    );
  }
}

export default LabelMappingModal;