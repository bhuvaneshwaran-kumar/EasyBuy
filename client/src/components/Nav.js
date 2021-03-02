import {Link} from 'react-router-dom'
import './styles/Nav.css'
import {useUserValue} from '../contexts/UserProvider'
import {useProductValue} from '../contexts/ProductProvider'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'


function Nav() {
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
    }

    return (
      
            <div className="nav-bar">
                <div className="left">
                   <Link to='/'>
                       <li>Home</li>
                   </Link>
                   {
                       value.isSeller && 
                       <>
                       <Link to='/addproduct'>
                            <li>Add-Product</li>
                        </Link>
                        <Link to='/myproduct'>
                            <li>My-Product</li>
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
                        <li>Login</li>
                    </Link>
                        <li>/</li>
                    <Link to='/signup'>
                        <li>Signup</li>
                    </Link>
                    </> :
                    <>
                     { value.loggedStatus &&
                    <Link to='/profile'>
                       <li>Profile</li>
                    </Link>
                    }
                    <Link>
                        <li onClick={Logout}>Logout</li>
                    </Link>
                    </>
                    }
                </div>


            
            
            </div>
        
      
    )
}

// MVC

export default Nav
