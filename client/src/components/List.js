import './List.css';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';

export default class List extends PureComponent {
  static propTypes = {
    isNowFetching: PropTypes.bool,
    header: PropTypes.string.isRequired,
    headerActions: PropTypes.element,
    items: PropTypes.array,
    extraListItems: PropTypes.element,
    renderItem: PropTypes.func.isRequired
  };


  render() {
    const { 
      isNowFetching, 
      header, items, 
      headerActions, 
      extraListItems, 
      renderItem,
      itemsEmptyText = '데이터가 없습니다' 
    } = this.props;
    
    return (
      <div className="List">        
        <header className="list-header">
          <div className="list-header-text">
            <h3>{header}</h3>
            { isNowFetching && <Loading /> }
          </div>
          <div className="list-actions">
            {headerActions}
          </div>
        </header>
        {extraListItems}   
        <div className="list-container">   
          {
            !isNowFetching && items && items.length === 0 && 
            <div className="items-empty">{itemsEmptyText}</div>
          }
          <ul> 
            {items && items.length > 0 && items.map((item, i) => renderItem(item, i))}
          </ul>
        </div>
      </div>
    );
  }  
}