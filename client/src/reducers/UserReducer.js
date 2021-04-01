import { useState } from "react"

export const initialState = null

export const reducer = (state = initialState, action)=>{

    switch(action.type){
        case 'SET_USER':
            return action.payload

        case 'UPDATE_USER' : 
            return {...state,...action.payload}
        
        case 'UPDATE_USER_ADDRESS':
            state.address.unshift(action.payload) 
            console.log("user reducer->",state)
            return state

        case 'DELETE_USER_ADDRESS':
            let newAddress = state.address.filter((add)=>{
                
                let id = String(add._id)
                let load = String(action.payload)
                console.log(typeof id,typeof load)
            
                if(id !== load){
                    return add
                }
            })
            // let [newState,setNewState] = useState(state)
            state.address = newAddress
            // setNewState(state)
            console.log(state)
            return state

        default :
            return state 
    }

}




/* Mani-code.
export const initialState = 1

export const reducer = (state=initialState,action) =>{
    switch(action.type){
        case 'SET_USER':
            return action.payload
        default :
            return state
    }
}
*/
