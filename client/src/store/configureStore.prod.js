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
    )
  );

  sagaMiddleware.run(rootSaga);

  return store;
}