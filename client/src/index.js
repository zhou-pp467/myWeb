import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App/App'
import rootReducer from './redux/index'
import { Provider } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const myReducer = persistReducer(
  {
    key: 'root',
    storage
  },
  rootReducer
)

// const create = window.devToolsExtension
//   ? window.devToolsExtension()(createStore)
//   : createStore
const store = createStore(myReducer, applyMiddleware(thunk))
const persistor = persistStore(store)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
