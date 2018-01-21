import './MemoItems.css';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import List from './List';
import MemoItem from './MemoItem';
import ActionButton from './ActionButton';

import { formatLabel, cutter } from '../utils/stringUtils';

export default class MemoItems extends PureComponent {
  static propTypes = {
    isNowFetching: PropTypes.bool.isRequired,
    memos: PropTypes.array,
    selectedMemo: PropTypes.object,
    selectedLabel: PropTypes.object,
    onShowLabelMappingModal: PropTypes.func.isRequired,
    onCreateMemo: PropTypes.func.isRequired,
    onRemoveMemo: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);

    this.state = {
      checkedMemos: [],
      filterKeyword: ''
    };

    this.lastInputTime = null;
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.memos !== this.props.memos) {
      this.setState({
        checkedMemos: []
      });
    }
  }

  isSelected(memo) {
    const { selectedMemo } = this.props;

    return selectedMemo && selectedMemo._id === memo._id;
  }

  handleCheck = (memoId) => {
    let checkedMemos = [...this.state.checkedMemos];
    const index = checkedMemos.indexOf(memoId);

    if (index === -1) {
      this.setState({
        checkedMemos: [...checkedMemos, memoId]  
      });
    } else {
      checkedMemos.splice(index, 1);
      this.setState({
        checkedMemos
      });
    }
  }

  handleRemove = ()=> {
    const { checkedMemos } = this.state;
    if (window.confirm(`${checkedMemos.length}개의 메모를 삭제하시겠습니까?`)){
      this.props.onRemoveMemo(checkedMemos);
    }
  };

  render() {
    const { checkedMemos, filterKeyword } = this.state;
    const { isNowFetching, selectedLabel, onCreateMemo, memos, onClick, onShowLabelMappingModal } = this.props;
    
    const isMemoSelected = checkedMemos.length > 0;

    const memoActions = (
      <div className="memo-actions">
        <ActionButton iconName="fa-remove" danger disabled={!isMemoSelected} onClick={this.handleRemove}/>
        <ActionButton iconName="fa-tag" disabled={!isMemoSelected} onClick={() => {
          const { checkedMemos } = this.state;
          const { memos } = this.props;
          onShowLabelMappingModal({ memos: memos.filter((memo) => checkedMemos.includes(memo._id)) });
        }}/>        
        {
          selectedLabel &&
          <ActionButton primary iconName="fa-pencil-square-o" onClick={onCreateMemo} />
        }
      </div>
    );

    const useFilterCondition = filterKeyword.length > 1;
    let filteredMemos = useFilterCondition ?
      memos.filter((memo) => {
        const { title, content } = memo;
        return title.includes(filterKeyword) || content.includes(filterKeyword);
      }) :
      memos;

    if (useFilterCondition) {
      // text hightlight 처리
      filteredMemos = filteredMemos.map((memo) => {
        const { title, content } = memo;
        const hightlightingMemo = Object.assign({}, memo);
        hightlightingMemo.title = formatLabel(cutter(title, 10), filterKeyword);
        hightlightingMemo.content = formatLabel(cutter(content, 30), filterKeyword);
        
        return hightlightingMemo;
      });
    }

    const extraListItems = (
      <form className="memo-filter">
        <input type="text"
          placeholder="검색할 메모 제목을 입력하세요."
          value={filterKeyword}
          onChange={(e) => this.setState({ filterKeyword: e.target.value })}
        />
      </form>
    );

    const selectedLabelName = selectedLabel && selectedLabel.name.length > 0 ? selectedLabel.name : '새로운 Label';
    return (
      <div className="MemoItems">
        <List isNowFetching={isNowFetching}
          header={selectedLabel ? selectedLabelName : '전체메모'}
          headerActions={memoActions}
          items={filteredMemos}
          extraListItems={extraListItems}
          itemsEmptyText="메모가 없습니다."
          renderItem={(memo, i) => {
            return (
              <MemoItem key={i}
                memo={memo}
                isSelected={this.isSelected(memo)}
                isChecked={checkedMemos.indexOf(memo._id) > -1}
                onChecked={this.handleCheck}
                onClick={onClick}
              />
            );
          }}
        />
      </div>
    );
  }
}