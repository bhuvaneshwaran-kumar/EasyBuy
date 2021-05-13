import './styles/Nav.css'
import {useUserValue} from '../contexts/UserProvider'
import {useProductValue} from '../contexts/ProductProvider'
import {useState,useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { Link, useHistory, useLocation } from "react-router-dom"
import Search from './search/Search'


function Nav() {


    const [active,setActive] = useState(window.location.pathname)
    const {logout} = useAuth()
    const [value,dispatch] = useUserValue()
    const [,pDispatch] = useProductValue()
    const histroy = useHistory()
    const location = useLocation()

    useEffect(() => {
        setActive(location.pathname)
    }, [location.pathname])

    useEffect(() => {
        let unlisten = histroy.listen((location, action) => {
            setActive(location.pathname)
        })
        return unlisten
    }, [histroy])

    const Logout = async()=>{
        let res = await logout(value.email)
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
                   <Search/>
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
                    <Link to="">
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
