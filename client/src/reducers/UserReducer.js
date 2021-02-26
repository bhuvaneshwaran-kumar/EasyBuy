export const initialState = null

export const reducer = (state = initialState, action)=>{

    switch(action.type){
        case 'SET_USER':
            return action.payload

        case 'UPDATE_USER' : 
            return {...state,...action.payload}
        
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
