export const productInitialState = []

export const productReducer = (state = productInitialState,action) => {

    switch(action.type){
        case 'SET_PRODUCT' : 
            return action.payload
        
        case 'UPDATE_PRODUCT' : 
            return [...state ,...action.payload]

        case 'PREPEND_PRODUCT' : 
            return [action.payload , ...state ]    
        default : 
            return state
    }

}