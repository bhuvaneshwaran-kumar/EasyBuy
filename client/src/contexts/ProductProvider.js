import React,{createContext, useContext, useReducer} from 'react'

const ProductContext = createContext()

function ProductProvider({children,initialState,reducer}) {
    return (
        <ProductContext.Provider value={useReducer(reducer,initialState)}>
            {children}
        </ProductContext.Provider>
    )
}


export const useProductValue = ()=> useContext(ProductContext)



export default ProductProvider



