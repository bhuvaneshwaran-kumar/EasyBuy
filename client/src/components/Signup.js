import React, {  useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import "./styles/Signup.css"
import useAuth from '../hooks/useAuth'
function Signup() {
    const formRef = useRef()
    const {verifyOtp, signup} = useAuth()
    const [otp,setOtp] = useState(false)
    const [message,setMessage] = useState('')
    const [error,setError] = useState(false)
    const [loader,setLoader] = useState(false)
    const history = useHistory()

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
              setMessage(response.message +` 
              \nNow you can navigate to login page.`)
              localStorage.setItem("EMAIL",formRef.current.email.value)
              formRef.current.email.value = ""
              formRef.current.otp.value = ""
              
            //   setInterval(()=>{
                setLoader(false)
            //   },800)
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
                setMessage(response.message)
            }else{
                setError(true)
                setMessage(response.message)
            }
            setLoader(false)
                   
        }

    }



 
    return (
        <div className="signup">
                <div className="left">   
                    <h1>Signup</h1>
                    <p>Get access to your Orders,</p>
                    <p>WishList and Recommendations.</p>
                </div>
                    <div className="right">
                        <div className="top">
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
                                <input type="password" minLength='4' maxLength='8' placeholder="Password" 
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
                                <button type="submit"
                                id="btnc" className="btn btn-blue">
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
                                <button type="submit" 
                                id="btnc"
                                className="btn  btn-blue">
                                    Verify OTP
                                </button>
                                <br/><br/>
                                {
                                loader &&    <div class="loader"></div>
                                }
                            </div>
                            }
                            <div className="row form-group">
                                <span className={!error?"message":"red"}> <pre>{message}</pre> </span>
                            </div>
                         </form>
                        </div>
                        <div className="bottom">
                            <hr/>
                            <p>OR</p>
                            <p onClick={()=>{
                                history.push('/login')
                            }} 
                            >Already have an accout? Click here to login</p>
                        </div>
                    </div>

             
        </div>
    )
}

export default Signup
