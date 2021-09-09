import {useDispatch,useSelector} from 'react-redux'
import {useEffect} from 'react'


import './App.css';

function App() {
  const dispatch = useDispatch()
  const {val1,val2,sign,equal,result,memory} = useSelector(state=>state.calc)

  useEffect(() => {
    console.log("memory: ",memory)
  },[memory])

  function handleButtonClick(event){
    const {target} = event;
    const button = target.value

    const anyNumber = /[0-9]/

    if(button==="AC"){
      dispatch({type:"calc/all-clear",payload:{}})
    }else if(button==="+"){
      dispatch({type:"calc/press-sign",payload:{sign:"+"}})
    }else if(button==="-"){
      dispatch({type:"calc/press-sign",payload:{sign:"-"}})
    }else if(button==="*"){
      dispatch({type:"calc/press-sign",payload:{sign:"*"}})
    }else if(button==="/"){
      dispatch({type:"calc/press-sign",payload:{sign:"/"}})
    }else if(button==="="){
      dispatch({type:"calc/calculate",payload:{}})
    }else if(button.match(anyNumber)){
      dispatch({type:"calc/press-val",payload:{val:button}})
    }else if(button==="."){
      dispatch({type:"calc/add-dot",payload:{}})
    } 
  }  
  
  function handleSelect(event){
    if(event.target.value!=="default"){
      const splittedItem = event.target.value.split(' ')
      console.log(splittedItem)
      dispatch({
        type:"calc/change-all",
        payload:{
          val1:splittedItem[0],
          val2:splittedItem[2],
          sign:splittedItem[1],
          result:splittedItem[4],
        }
      })
      
    }
  }
  
  return (
    <section>
        <p className="display">{`${val1} ${sign} ${val2}${equal} ${result}`}</p>
      <select onChange={handleSelect} defaultValue={"default"}>
        <option disabled value={"default"}>Memoria</option>
        {memory.map((item,index)=><option key={`key_${index}`} value={item}>{item}</option>)}
      </select>
      <div className="buttons">
          
        <div className="btn-grid">

        <button onClick={handleButtonClick} type="button" value="+">+</button>
        <button onClick={handleButtonClick} type="button" value="-">-</button>
        <button onClick={handleButtonClick} type="button" value="*">&times;</button>
          
        <button onClick={handleButtonClick} type="button" value="7">7</button>
        <button onClick={handleButtonClick} type="button" value="8">8</button>
        <button onClick={handleButtonClick} type="button" value="9">9</button>
        
        <button onClick={handleButtonClick} type="button" value="4">4</button>
        <button onClick={handleButtonClick} type="button" value="5">5</button>
        <button onClick={handleButtonClick} type="button" value="6">6</button>
     
        <button onClick={handleButtonClick} type="button" value="1">1</button>
        <button onClick={handleButtonClick} type="button" value="2">2</button>
        <button onClick={handleButtonClick} type="button" value="3">3</button>
            
        <button onClick={handleButtonClick} type="button" value="0">0</button>
        <button onClick={handleButtonClick} type="button" value=".">.</button>
        <button onClick={handleButtonClick} type="button" value="AC">AC</button>


        <button onClick={handleButtonClick} type="button" value="/" className="divide">&divide;</button>
        <button onClick={handleButtonClick} type="button" value="=" className="equal-sign">=</button>

        </div>

      </div>
    </section>
  );
}

export default App;
