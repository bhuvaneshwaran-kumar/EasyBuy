export const productInitialState = []

export const productReducer = (state = productInitialState,action) => {

    switch(action.type){
        case 'SET_PRODUCT' : 
            return action.payload
        
        case 'UPDATE_PRODUCT' : 
            return [...state ,...action.payload]

        case 'PREPEND_PRODUCT' : 
            return [action.payload , ...state ]  
        
        case 'UPDATE_ELEMENT' : 
            let index = action.payload.index
            let name = action.payload.name
            let value = action.payload.value
            state[index][name]= value
            return [...state]
        default : 
            return state
    }

}