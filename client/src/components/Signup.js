import React, {  useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import "./styles/Signup.css"
import useAuth from '../hooks/useAuth'
function Signup() {
    const formRef = useRef()
    const {verifyOtp, signup} = useAuth()
    const history = useHistory()
    const [otp,setOtp] = useState(false)
    const [message,setMessage] = useState('')
    const [error,setError] = useState(false)
    const [loader,setLoader] = useState(false)
    
    async function submitForm(event){
        event.preventDefault()

        if(otp){
            setLoader(true)
            console.log(event.target)
            const userData = {
                email : formRef.current.email.value,
                otp : formRef.current.otp.value
            }
          const response =await verifyOtp(userData)
          if(response.status){
              setMessage(response.message)
              localStorage.setItem("EMAIL",formRef.current.email.value)
              setInterval(()=>{
                setLoader(false)
                history.replace('/login')
              },800)
          }else{
              setError(true)
              setLoader(false)
              setMessage(response.message)
          }

        }else{

            const userData = {
                name : event.target.name.value,
                email : event.target.email.value,
                password : event.target.password.value
            }
            setLoader(true)
            const response =await signup(userData)
            if(response.status){
                setError(false)
                setOtp(true)
            }else{
                setError(true)
            }
            setLoader(false)
            setMessage(response.message)    
           
        }

    }



 
    return (
        <div className="signup">
                 <div className="left">
                    
                    </div>
                    <div className="right">
                        <form action="authenticate/signup" onSubmit={submitForm} ref={formRef}>
                           { !otp && <div className="row form-group">
                                <input type="text" placeholder="UserName" 
                                name="name"
                                className="input-2" required autoComplete="off"/>
                            </div>
                            }
                            <div className="row form-group">
                                <input onChange={()=>{
                                    setMessage('')
                                }} type="email" placeholder="Email" 
                                name="email"
                                className="input-2" required/>
                            </div>
                            { 
                            !otp && <div className="row form-group">
                                <input type="password" placeholder="Password" 
                                name="password"
                                className="input-2" required/>
                            </div>
                            }
                            { 
                            otp && <div className="row form-group">
                                <input type="text" placeholder="6-Digit OTP" 
                                name="otp"
                                className="input-2" required autocomplete="off"/>
                            </div>
                            }
                            {
                               !otp && <div className="row">
                                <button type="submit" className="btn btn-blue">
                                    SignUp
                                </button>
                                {
                                loader &&    <div className="loader"></div>
                                }
                                <br/><br/>
                            </div>
                            }
                            {
                               otp && <div className="row">
                                <button type="submit" className="btn btn-blue">
                                    Verify OTP
                                </button>
                                <br/><br/>
                                {
                                loader &&    <div class="loader"></div>
                                }
                            </div>
                            }
                            <div className="row form-group">
                                <span className={!error?"message":"red"}>{message}</span>
                            </div>
                        </form>
                    </div>

             
        </div>
    )
}

export default Signup
