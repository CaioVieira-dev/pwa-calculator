import {omit} from 'redux-offline'
import api from '../../services/api'
const initialState = {
    val1:"1",
    val2:"1",
    sign:"+",
    result:"2",
    equal:" =",
    memory:[]
}

export default function calculatorReducer(state=initialState,action) {
    switch (action.type) {
        case "calc/all-clear":return{
            ...state,
            val1:"",
            val2:"",
            sign:"",
            result:"",
            equal:""
        }
        case "calc/change-all":return{
            ...state,
            val1:action.payload.val1,
            val2:action.payload.val2,
            sign:action.payload.sign,
            result:action.payload.result,
            equal:" =", 
        }
        case "calc/press-val":
            if(state.result !== ""){
                //if state has a result, clear all values
                return{
                    ...state,
                    val1:action.payload.val,
                    val2:"",
                    sign:"",
                    result:"",
                    equal:""
                }
            }else{
                if(!state.sign){//if sign is not set
                    return{
                        ...state,
                        val1: state.val1? state.val1 + action.payload.val:action.payload.val
                    }
                }else{
                    return{
                        ...state,
                        val2:state.val2?state.val2 + action.payload.val:action.payload.val
                    }
                }
            }
        case "calc/add-dot":{
            if(state.result !== ""){
                //if state has a result, clear all values
                return{
                    ...state,
                    val1:"0.",
                    val2:"",
                    sign:"",
                    result:"",
                    equal:""
                }
            }else if(!state.sign){//if sign is not set
                return{
                    ...state,
                    val1: state.val1? state.val1 + ".":"0."
                    }
                }else{
                    return{
                        ...state,
                        val2:state.val2?state.val2 + ".":"0."
                    }
                }
        }        
        case "calc/press-sign":
        if(state.result!==""){
            //if state has a result, change the result to val1, 
            //set the sign and reset result, val2 and equal
            return{
                ...state,
                sign:action.payload.sign,
                val1 : state.result,
                result:"", 
                val2 : "",
                equal : ""
            }
        }else{
            return{
                ...state,
                sign:action.payload.sign
            }
        }
        case "calc/calculate":
            if(state.val1 !== "" && state.val2 !== ""){
            let res;
            switch(state.sign){
                case "+":
                    res = Number(state.val1) + Number(state.val2);
                break;
                case "-":
                    res = Number(state.val1) - Number(state.val2);
                    break;
                case "/":
                    res = Number(state.val1) / Number(state.val2);
                    break;
                case "*":
                    res = Number(state.val1) * Number(state.val2);
                    break;
                default:res=0;
            }    
            return{
                ...state, 
                equal:" =",
                result:res.toString()
            }
            }else{return state}
        case "calc/change-memory":
        return state
        case "calc/change-memory-commit":
        return{
            ...state,
            memory:[...action.payload]
        }
        case "change-memory-rollback":  
        return omit(state, action.payload)
        case "calc/add-memory":return{
            ...state, 
            memory:[...state.memory,action.payload.memory]//optimistic way, set UI while sending the request
        }
        case "calc/add-memory-commit":
            return state
        // return{
        //     ...state, 
        //     memory:[...state.memory,action.payload]//action.payload from commit is the server response
        // }
        case "calc/add-memory-rollback":
            return omit(state, action.payload.memory)//if the server response is an error, revert the state
        
         //if this reducer doesn't recognize the action type
        //or doesn't care about it, return the state unchanged
        default: return state
    }
}


// Thunk function
export async function getServerMemory(dispatch, getState) {  
    try{
        const response = await api.get('/api/memory')  
        dispatch({ type: "calc/change-memory-commit", payload: response.data })
    }catch(err){
        console.error({message: "Erro: ",err})
    }

}

//Side effect middleware
export const addMemoryOnCalculate = storeAPI => next => action =>{
    console.log(storeAPI)
    if(action.type==="calc/calculate"){
        let result = next(action)
        const updatedStore = storeAPI.getState()
        if(updatedStore.calc.result!==""){
            storeAPI.dispatch({
                type:"calc/add-memory",
                payload:{memory:`${updatedStore.calc.val1} ${updatedStore.calc.sign} ${updatedStore.calc.val2}${updatedStore.calc.equal} ${updatedStore.calc.result}`},
                meta:{
                  offline:{
                    effect:{
                      url:"http://localhost:4000/api/add-memory",
                      method: 'POST',
                      body: JSON.stringify({memory:`${updatedStore.calc.val1} ${updatedStore.calc.sign} ${updatedStore.calc.val2}${updatedStore.calc.equal} ${updatedStore.calc.result}`})
                    },
                    commit:{ type:"calc/add-memory-commit",payload:{memory:`${updatedStore.calc.val1} ${updatedStore.calc.sign} ${updatedStore.calc.val2}${updatedStore.calc.equal} ${updatedStore.calc.result}`},},
                    rollback:{
                      type: "calc/add-memory-rollback",
                      meta:{memory:`${updatedStore.calc.val1} ${updatedStore.calc.sign} ${updatedStore.calc.val2}${updatedStore.calc.equal} ${updatedStore.calc.result}`}
                    }
                  }
                }
              })
        }
        return result;
    }else{
        return next(action)
    }

}