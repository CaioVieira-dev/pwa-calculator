import {combineReducers} from 'redux'

import calculatorReducer from './slices/calculatorSlice' 

const rootReducer = combineReducers({
    calc: calculatorReducer,
})

export default rootReducer