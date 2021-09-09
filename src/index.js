import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import {Provider} from 'react-redux'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';


import store from './store/store'
import {getServerMemory} from './store/slices/calculatorSlice'
store.dispatch(getServerMemory)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} >
    <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

