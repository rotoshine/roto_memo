import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'

import configureStore from './store/configureStore';

import App from './App';

// initialize store
const store = configureStore();

ReactDOM.render(
  (    
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  ), document.getElementById('app-root'));
