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
        
        case 'POST_EDIT_STATUS' : 
            let i = action.payload.index
            let status = action.payload.status
            state[i].EditStatus = status
            console.log( state[i] )
            return [...state]

        default : 
            return state
    }

}