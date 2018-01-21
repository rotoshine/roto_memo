import 'font-awesome/css/font-awesome.css';

import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ActionButton from '../components/ActionButton';
import Panel from '../components/Panel';
import Labels from '../components/Labels';
import List from '../components/List';
import MemoItems from '../components/MemoItems';
import MemoItem from '../components/MemoItem';

storiesOf('ActionButton', module)
  .add('default', () => <ActionButton iconName="fa-twitter" onClick={action('clicked')}/>)
  .add('primary', () => <ActionButton primary iconName="fa-twitter" onClick={action('clicked')}/>)
  .add('info', () => <ActionButton info iconName="fa-twitter" onClick={action('clicked')}/>)
  .add('danger', () => <ActionButton danger iconName="fa-twitter" onClick={action('clicked')}/>);

storiesOf('Panel', module)
  .add('default', () => <Panel>Hello! Memo</Panel>)
  .add('with style', () => <Panel style={{padding:20}}>with style</Panel>);

const dummyLabels = [
  {
    _id: 'aa',
    name: '지인들',
    memoCount: 3
  },
  {
    _id: 'bb',
    name: 'Coupang 지인들',
    memoCount: 10
  }
];

/* Labels 
  isNowFetching: PropTypes.bool,
  labels: PropTypes.array,
  selectedLabel: PropTypes.object,
  totalMemoCount: PropTypes.number,
  onSelectLabel: PropTypes.func.isRequired,
  onCreateLabel: PropTypes.func.isRequired,
  onRemoveLabel: PropTypes.func.isRequired
 */

storiesOf('Labels', module)
  .add('default', () => 
    <div style={{width: 300}}>    
      <Labels labels={dummyLabels} 
        totalMemoCount={13} 
        onSelectLabel={action('label click')}
        onCreateLabel={action('create label click')}
        onRemoveLabel={action('remove click')}
      />
    </div>
  )
  .add('with <Panel/>', () => 
    <Panel style={{width: 300}}>    
      <Labels labels={dummyLabels} 
        totalMemoCount={13} 
        onSelectLabel={action('label click')}
        onCreateLabel={action('create label click')}
        onRemoveLabel={action('remove click')}
      />
    </Panel>
  )
  .add('isNowFetching', () => 
    <Panel style={{width: 300}}>    
      <Labels isNowFetching={true}
        labels={null} 
        totalMemoCount={3} 
        onSelectLabel={action('label click')}
        onCreateLabel={action('create label click')}
        onRemoveLabel={action('remove click')}
      />
    </Panel>
  );
/*
  isNowFetching: PropTypes.bool,
  header: PropTypes.string.isRequired,
  headerActions: PropTypes.element,
  items: PropTypes.array,
  extraListItems: PropTypes.element,
  renderItem: PropTypes.func.isRequired
*/
storiesOf('List', module)
  .add('default', () => 
    <List header="List" 
      items={[{ nickname: '로토' }]}
      renderItem={(item) => <div>{item.nickname}</div>}
    />
  )
  .add('with <Panel />', () => 
    <Panel style={{width:200}}>
      <List header="List" 
        items={[{ nickname: '로토' }]}
        renderItem={(item) => <div>{item.nickname}</div>}
      />
    </Panel>
  )
  .add('change header', () =>
    <Panel style={{width:200}}>
      <List header="리스트 헤더 바꾸기" 
        items={[{ nickname: '로토' }]}
        renderItem={(item) => <div>{item.nickname}</div>}
      />
    </Panel>
  )
  .add('many items', () =>
    <Panel style={{width:200}}>
      <List header="List" 
        items={
          [
            { nickname: '로토' }, 
            { nickname: 'winterwolf0412' },
            { nickname: 'bluewind2208' },
            { nickname: 'bluemoon' } 
          ]
        }
        renderItem={(item) => <div>{item.nickname}</div>}
      />
    </Panel>
  )
  .add('with header actions', () =>
    <Panel style={{width:200}}>
      <List header="List" 
        items={[{ nickname: '로토' }]}
        headerActions={<ActionButton iconName="fa-facebook" onClick={action('List Header Action Click')} />}
        renderItem={(item) => <div>{item.nickname}</div>}
      />
    </Panel>   
  )
  .add('with extraListItems', () => 
    <Panel style={{width:200}}>
      <List header="List" 
        items={[{ nickname: '로토' }]}
        extraListItems={<div style={{textAlign:'center'}}>E X T R A</div>}
        renderItem={(item) => <div>{item.nickname}</div>}
      />
    </Panel>   
  )
  /* MemoItems
    isNowFetching: PropTypes.bool.isRequired,
    memos: PropTypes.array,
    selectedMemo: PropTypes.object,
    selectedLabel: PropTypes.object,
    onShowLabelMappingModal: PropTypes.func.isRequired,
    onCreateMemo: PropTypes.func.isRequired,
    onRemoveMemo: PropTypes.func.isRequired
  */
  const dummyMemos = [
    {
      _id: 'aa',
      title: '메모 1',
      content: '내용 1',
      updatedAt: new Date()
    },
    {
      _id: 'ab',
      title: '메모 2',
      content: '내용 2',
      updatedAt: new Date()
    }
  ];

storiesOf('MemoItem', module)
  .add('default', () =>
    <div style={{width: 200}}>
      <MemoItem memo={dummyMemos[0]} 
        isSelected={false} 
        isChecked={false} 
        onChecked={action('check click')}
        onClick={action('memo click')}
      />
    </div>
  )
  .add('selected memo', () =>
    <div style={{width: 200}}>
      <MemoItem memo={dummyMemos[0]} 
        isSelected={true} 
        isChecked={false} 
        onChecked={action('check click')}
        onClick={action('memo click')}
      />
    </div>
  )
  .add('checked memo', () =>
    <div style={{width: 200}}>
      <MemoItem memo={dummyMemos[0]} 
        isSelected={false} 
        isChecked={true} 
        onChecked={action('check click')}
        onClick={action('memo click')}
      />
    </div>
  );

storiesOf('MemoItems', module)
  .add('default', () =>
    <div style={{width:300}}>
      <MemoItems isNowFetching={false}
        memos={dummyMemos}
        selectedMemo={null}
        selectedLabel={null}
        onShowLabelMappingModal={action('label mapping button click')}
        onCreateMemo={action('memo create click')}
        onRemoveMemo={action('memo remove click')}
      />
    </div>
  )
  .add('with <Panel />', () => 
    <Panel style={{width:300}}>
      <MemoItems isNowFetching={false}
        memos={dummyMemos}
        selectedMemo={null}
        selectedLabel={null}
        onShowLabelMappingModal={action('label mapping button click')}
        onCreateMemo={action('memo create click')}
        onRemoveMemo={action('memo remove click')}
      />
    </Panel>
  )
  .add('memo selected', () =>
    <Panel style={{width:300}}>
      <MemoItems isNowFetching={false}
        memos={dummyMemos}
        selectedMemo={dummyMemos[0]}
        selectedLabel={null}
        onShowLabelMappingModal={action('label mapping button click')}
        onCreateMemo={action('memo create click')}
        onRemoveMemo={action('memo remove click')}
      />
    </Panel>
  )
  .add('isNowFetching', () =>
    <Panel style={{width:300}}>
      <MemoItems isNowFetching={true}
        memos={null}
        selectedMemo={null}
        selectedLabel={null}
        onShowLabelMappingModal={action('label mapping button click')}
        onCreateMemo={action('memo create click')}
        onRemoveMemo={action('memo remove click')}
      />
    </Panel>
  )
