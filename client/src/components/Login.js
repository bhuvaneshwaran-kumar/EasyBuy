import React,{useState, useRef} from 'react'
import "./styles/Login.css"
import useAuth from '../hooks/useAuth'
import {useUserValue} from '../contexts/UserProvider'
import {useHistory,Redirect} from 'react-router-dom'


function Login() {
    const {login,forgotPassword,verifyOtp,resetPassword} = useAuth()
    const formRef = useRef()
    const [,dispatch] = useUserValue()
    const [redirectToLogin,setRedirectToLogin] = useState(false)
    const [email,setEmail] = useState(() => localStorage.getItem('EMAIL') || '')
    const [loader,setLoader] = useState(false)
    const [message,setMessage] = useState('')
    const [error,setError] = useState(false)
    let history = useHistory()
    let [otpStatus,setOtpStatus] = useState(false)
    let [resetPwdStatus,setResetPwdStatus] = useState(false)


    const forgotPwd = async ()=>{
        setLoader(true)
        let email = formRef.current.email.value
        
        const result = await forgotPassword(email)

        if(result.status === 201){
            let data = await result.json()
            setMessage(data.message)
            setError(true)
            setLoader(false)
            return
        }
        if(result.status === 202){
            let data = await result.json()
            setOtpStatus(true)
            setError(false)
            setMessage(data.message)
            setLoader(false)
        }
    }

    const onSubmit = async (event)=>{
        event.preventDefault()
        setLoader(true)

        if(resetPwdStatus){
            let user = {
                email : formRef.current.email.value,
                password : formRef.current.newpwd.value
            }
            let result = await resetPassword(user)
            if(result.status === 201){
                let data = await result.json()
                setOtpStatus(false)
                setResetPwdStatus(false)
                setError(false)
                setMessage(data.message)
                setLoader(false)
                return
            }else{
                let data = await result.json()
                setError(true)
                setMessage(data.message)
                setLoader(false)
            }
        }

        if(otpStatus){
            let user = {
                email : formRef.current.email.value,
                otp : formRef.current.OTP.value
            }
            let result = await verifyOtp(user)
            if(result.status){
                setMessage(result.message)
                setError(false)
                setLoader(false)
                setResetPwdStatus(true)
            }else{
                setMessage(result.message)
                setError(true)
                setLoader(false)
            }
        }else{
            const user = {
                email : formRef.current.email.value,
                password : formRef.current.password.value
            }
            const response = await login(user)
            setLoader(false)
            if(response.loggedStatus){
                await dispatch({
                    type : "SET_USER",
                    payload : response
                })
                setError(false)
                setMessage(response.message)
                localStorage.setItem("email",response.email)
                // setRedirectToLogin(true)
                history.push('/')
            }else{
                setMessage(response.message)
                setError(true)
            }    
        }

    }




    return (
        <div className="login">
            <div className="left">
                 {
                     redirectToLogin && <Redirect to= '/' />
                 }   
                 <h1>Login</h1>
                 <p>Get access to your Orders,</p>
                 <p>WishList and Recommendations.</p>
            </div>
            <div className="right">
                <div className="top">
                <form ref={formRef} onSubmit={onSubmit}>
                    <div className="row form-group">
                        <input type="mail" placeholder="Email" className="input-2" required 
                        name = "email"
                         value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                    { (!otpStatus) && (!resetPwdStatus) &&
                    <div className="row form-group">
                        <input type="password" min={4} max={8} placeholder="Password" className="input-2" required
                        name="password"/>
                    </div> 
                    
                }
                    {   otpStatus && (!resetPwdStatus) &&
                    <div className="row form-group">
                    <input type="text" placeholder="Enter the OTP" className="input-2" required
                    name="OTP"/>
                    </div>
                    }
                    {
                        resetPwdStatus &&
                        <div className="row form-group">
                        <input type="text" placeholder="Enter New Password" className="input-2" required
                        name="newpwd"/>
                        </div>

                    }
                    <div className="row form-group">
                        <p>By continuing, you agree to <span>Easybuy's</span> Terms of Use and Privacy Policy.</p>
                    </div>
                    <div className="row form-group">
                        {(!otpStatus) && (!resetPwdStatus) ?
                        <button type="submit" className="btn btn-blue">
                            Login
                        </button>: (otpStatus) && (!resetPwdStatus) ?
                        <button type="submit" className="btn btn-blue">
                        Verify OTP
                        </button>: 
                        <button type="submit" className="btn btn-blue">
                        change Password
                        </button>
                    }
                    </div>
                    {!otpStatus &&
                        <div className="btn fgpwd form-group " onClick={forgotPwd}>
                        Forgot Password.?
                        </div>
                    }

                    <div className="row form-group">
                        <span className={!error?"message":"red"}>{message}</span>
                    </div>

                    {
                                loader && 
                                <div className=" row form-group">
                                    <div className="loader"></div>
                                </div>
                                }
                </form>
                </div>
                <div className="bottom">
                    <hr/>
                    <p>OR</p>
                   
                        <p onClick={()=>{
                            history.push("/signup")
                        }}>New to Easybuy? Create an account</p>
                   
                </div>
            </div>
        </div>
    )
}

export default Login
