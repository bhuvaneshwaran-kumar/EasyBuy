import {Link} from 'react-router-dom'
import './styles/Nav.css'
import {useUserValue} from '../contexts/UserProvider'
import {useProductValue} from '../contexts/ProductProvider'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'


function Nav() {


    const [active,setActive] = useState(window.location.pathname)
    const {logout} = useAuth()
    const [value,dispatch] = useUserValue()
    const [product,pDispatch] = useProductValue()

    const Logout = async()=>{
        let res = await logout()
        if(res){
            dispatch({
                type : "SET_USER",
                payload : {
                    loggedStatus : false
                }
            })
            pDispatch({
                type : "SET_PRODUCT",
                payload : []
            })
        }
        setActive("/")
    }

    return (
      
            <div className="nav-bar">
                <div className="left">
                   <Link to='/'>
                       <li className={(active === "/")?"active":""}
                       onClick= {()=>setActive("/")} 
                        >Home</li>
                   </Link>
                   {
                       value.isSeller && 
                       <>
                       <Link to='/addproduct'>
                            <li
                            className={(active === "/addproduct")?"active":""}
                            onClick= {()=>setActive("/addproduct")}  
                            >Add-Product</li>
                        </Link>
                        <Link to='/myproduct'>
                            <li
                            className={(active === "/myproduct")?"active":""}
                            onClick= {()=>setActive("/myproduct")}
                            >My-Product</li>
                        </Link>
                       
                       </> 
                   }
                   {value.loggedStatus &&
                        <Link to='/'>
                            <li>My-Cart</li>
                        </Link>
                   }
                </div>
                <div className="right">
                    { !value.loggedStatus ?
                    <>
                    <Link to='/login'>
                        <li
                         className={(active === "/login")?"active":""}
                         onClick= {()=>setActive("/login")}
                        >Login</li>
                    </Link>
                        <li>/</li>
                    <Link to='/signup'>
                        <li
                        className={(active === "/signup")?"active":""}
                        onClick= {()=>setActive("/signup")}
                        >Signup</li>
                    </Link>
                    </> :
                    <>
                     { value.loggedStatus &&
                    <Link to='/profile'>
                       <li
                       className={(active === "/profile")?"active":""}
                       onClick= {()=>setActive("/profile")}
                       >Profile</li>
                    </Link>
                    }
                    <Link>
                        <li onClick={Logout}
                        >Logout</li>
                    </Link>
                    </>
                    }
                </div>


            
            
            </div>
        
      
    )
}

// MVC

export default Nav
