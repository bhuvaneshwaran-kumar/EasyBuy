import React,{useContext,createContext,useReducer } from 'react'

const UserContext = createContext()

function UserProvider({children,intialState,reducer}) {
    return (
        <UserContext.Provider value={useReducer(reducer,intialState)}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserValue = () => useContext(UserContext)

export default UserProvider

