import {createContext,useContext,useReducer} from 'react'

const CompareContext = createContext()

function CompareProvider({children,initialState,reducer}){

    return (
        <CompareContext.Provider value={useReducer(reducer,initialState)}>
            {children}
        </CompareContext.Provider>
    )
}

export const useCompareContext = ()=>useContext(CompareContext)

export default CompareProvider