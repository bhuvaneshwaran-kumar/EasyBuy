import React,{useEffect, useState, useRef} from 'react'
import "./styles/Login.css"
import useAuth from '../hooks/useAuth'
import {useUserValue} from '../contexts/UserProvider'
import {useHistory} from 'react-router-dom'

function Login({loggedIn,setLoggedIn}) {
    const {login} = useAuth()
    const formRef = useRef()
    const [value,dispatch] = useUserValue()

    const [email,setEmail] = useState(() => localStorage.getItem('EMAIL') || '')
    const [loader,setLoader] = useState(false)
    const [message,setMessage] = useState('')
    const [error,setError] = useState(false)
    let history = useHistory()
    

    const onSubmit = async (event)=>{
        event.preventDefault()

        setLoader(true)
        const user = {
            email : formRef.current.email.value,
            password : formRef.current.password.value
        }
        const response = await login(user)
        setLoader(false)
        console.log("login :->",response)
        if(response.loggedStatus){
            dispatch({
                type : "UPDATE_USER",
                payload : response
            })
            console.log("-->login",value)
            setError(false)
            setMessage(response.message)
            localStorage.setItem("email",response.email)
            history.push('/')
        }else{
            setMessage(response.message)
            setError(true)
        }


    }




    return (
        <div className="login">
            <div className="left">
                    
            </div>
            <div className="right">
                <form ref={formRef} onSubmit={onSubmit}>
                    <div className="row form-group">
                        <input type="mail" placeholder="Email" className="input-2" required 
                        name = "email"
                         value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                    <div className="row form-group">
                        <input type="password" placeholder="Password" className="input-2" required
                        name="password"/>
                    </div>
                    <div className="row ">
                        <button type="submit" className="btn btn-blue">
                            Login
                        </button>
                    </div>

                    <div className="row form-group">
                        <span className={!error?"message":"red"}>{message}</span>
                    </div>

                    {
                                loader && 
                                <div className=" row form-group">
                                    <div class="loader"></div>
                                </div>
                                }
                </form>
            </div>
        </div>
    )
}

export default Login
