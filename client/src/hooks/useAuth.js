import { useUserValue } from "../contexts/UserProvider";


const BASE_URL = 'http://localhost:8080'

function useAuth() {
    
    const signup = async (user) => {
        
        try{
            const res = await fetch(`http://localhost:8080/authenticate/signup`,{
                method : "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify(user)
            })
            if(res.status === 201){
                let message = await res.json()
                let response = {
                    "status" : false,
                    "message" :  message.message
                }
                return await response
            }
            if(res.status === 202){
                let message = await res.json()
                let response = {
                    "status" : true,
                    "message" :  message.message
                }
                return await response
            }
        }
        catch(err){
            console.warn(err)
        }

    }

    const verifyOtp = async (user) =>{
        try{
            const res = await fetch("http://localhost:8080/authenticate/signup-otp",{
                method : "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify(user)
            })  
            if(res.status === 201){
                const data = await res.json()
                console.log(data.message)
                let response = {
                    status : true,
                    message : data.message
                }
                return response
            }
            if(res.status === 202){
                const data = await res.json()
                let response = {
                    status : false,
                    message : data.message
                }
                return response
            }
            if(res.status === 203){
                const data = await res.json()
                let response = {
                    status : false,
                    message : data.message
                }
                return response

            }

        }
        catch(err){
            console.log(err)
        }

    }

    const login = async (user) => {

        try{
            const response = await fetch(`${BASE_URL}/authenticate/login`,{
                mode:"cors",
                credentials : "include",
                method : "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify(user)        
            })
            let data = await response.json()   
            console.log("--->you try's to login",data)        
            return data
        }
        catch(err){
            console.warn(err)
        }
    }

    const checkLoggedIn = async () => {
        const res = await fetch(`${BASE_URL}/authenticate/islogged`,{
            method : "post",
            credentials : "include"
        })
        const data = await res.json()
        return data
    }

    const logout = async ()=> {
        let res = await fetch(`${BASE_URL}/authenticate/logout`,{
            method : "post",
            credentials : "include"
        })
        let data = await res.json() 
        console.log("-->from useAuth",data.value)
        return data.value
    }
    
    const switchToSellerAccount = async () =>{
        const response = await fetch(BASE_URL+'/authenticate/switchtoseller',{
            credentials : "include",
            method : "post"
        })
        const data = await response.json()
        return data
    }
    return { signup, login, checkLoggedIn, logout, verifyOtp, switchToSellerAccount }
}

export default useAuth
