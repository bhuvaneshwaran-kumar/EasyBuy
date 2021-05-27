export const CompareInitialState = []

export const CompareReducer = (state = CompareInitialState,action)=>{
    switch(action.type){
        case "SET_COMPARELIST" : 
            return action.payload
        default :
            return state
    }
}