export const cartInitialState = []

console.log('cartreducer is calling')

export const cartReducer = (state=cartInitialState,action)=>{
    switch(action.type){
        case 'SET_CART' :

            return  action.payload 
        
        case 'INCREASE_QTY' :

            state.productDetials[action.payload.index].quantity =  action.payload.value + 1
            return {...state}

        case 'DECREASE_QTY':
                
            state.productDetials[action.payload.index].quantity =  action.payload.value  - 1
            return {...state}

        case 'DELETECART':

            const newDelState = {...state}
            console.log(action.payload,"need to be deleted")
            newDelState.productDetials = state.productDetials.filter((data)=>(data.pid !== action.payload) && data)
            console.log(newDelState)
            return newDelState
        
        case 'PREPANDCART':

            console.log(state?.productDetials)

            if(state?.productDetials?.length > 0){

                state.productDetials =[action.payload,...state.productDetials] 
            
            } else {
            
                state.productDetials =[action.payload] 
            
            }

            return {...state}
        
        default :
            return state
    }

}