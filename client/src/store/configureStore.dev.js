
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/index';

export default function () {
  const sagaMiddleware = createSagaMiddleware();  

  const store = createStore(
    rootReducer,
    compose(      
      applyMiddleware(sagaMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f,
    ),
  );


  if ( module.hot ) {
    module.hot.accept( '../reducers', () => {
      const nextRootReducer = require( '../reducers' );
      store.replaceReducer( nextRootReducer );
    } );
  }

  sagaMiddleware.run(rootSaga);
  return store;
};