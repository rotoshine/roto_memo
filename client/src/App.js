import 'font-awesome/css/font-awesome.css';
import './App.css';
import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import NotificationSystem from 'react-notification-system';

import AppContainer from './containers/AppContainer';

import Headers from './components/Header';

class App extends Component {
  componentDidMount () {
    // 에러 팝업 사용 편의를 위해 전역 변수에 추가함
    window.addNotification = (notify) => {
      this.notificationSystem.addNotification(Object.assign({}, {
        position: 'tc',
        level: 'info'
      }, notify));
    };

    window.addErrorNotification = (message) => {
      window.addNotification({
        message,
        level: 'error'
      });
    }
  }

  render() {
    return (
      <div className="App">
        <Headers />
        <Switch>                    
          <Route exact path="/labels/all/memo/:memoId" component={AppContainer} />
          <Route exact path="/labels/all" component={AppContainer} />            
          <Route path="/labels/:labelId/memo/:memoId" component={AppContainer} />                      
          <Route path="/labels/:labelId" component={AppContainer} />            
          <Route path="*" component={AppContainer} />             
        </Switch>
        <NotificationSystem ref={(ref) => this.notificationSystem = ref} />
      </div>
    );
  }
}

export default App;