import {createContext,useContext,useReducer} from 'react'

const CartContext = createContext()

function CartProvider({children,initialState,reducer}){
    return (
        <CartContext.Provider 
        value = {
            useReducer(reducer,initialState)
        }
        >
        {children}
        </CartContext.Provider>
    )
}

export const useCartValue = ()=> useContext(CartContext)

export default CartProvider