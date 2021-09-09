import { createStore, applyMiddleware} from 'redux'
import {  composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from './rootReducer'
import { offline } from 'redux-offline';
import offlineConfig from 'redux-offline/lib/defaults';
import thunk from 'redux-thunk'

import {addMemoryOnCalculate} from './slices/calculatorSlice'


const customConfig= {
    ...offlineConfig,
    
}

const middleware = [thunk,addMemoryOnCalculate]

const enhancer = composeWithDevTools(
    applyMiddleware(...middleware),
    offline(customConfig),
    (createStore) => (reducer, preloadedState, enhancer) => enhancer(createStore)(reducer, preloadedState)
)

const store = createStore(rootReducer,undefined, enhancer);

export default store;