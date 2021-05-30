export const cartInitialState = []


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
            newDelState.productDetials = state.productDetials.filter((data)=>(data.pid !== action.payload) && data)
            return newDelState
        
        case 'PREPANDCART':


            if(state?.productDetials?.length > 0){

                state.productDetials =[action.payload,...state.productDetials] 
            
            } else {
            
                state.productDetials =[action.payload] 
            
            }

            return {...state}

        case 'ADDPRICE':
            state.productDetials[action.payload.index] = {...action.payload.data}
            return {...state}



        default :
            return state
    }

}