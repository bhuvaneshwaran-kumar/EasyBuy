import './App.css';
import Nav from './components/Nav.js'
import Login from "./components/Login.js"
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import Signup from './components/Signup.js'
import Profile from './components/Profile.js'
import AddProduct from './components/seller/AddProduct'
import MyProduct from './components/seller/MyProduct'

import useAuth from '../src/hooks/useAuth' 
import { useEffect, useState } from 'react';
import {useUserValue} from '../src/contexts/UserProvider'
import {useProductValue} from './contexts/ProductProvider'

function App() {
  const [loader,setLoader] = useState(true)
  const [user,dispatch] = useUserValue()
  const [product,pDispatch] = useUserValue()
  const {checkLoggedIn} = useAuth() 
  
  console.log(user)
  
  useEffect(async ()=>{
    let res = await checkLoggedIn()
    dispatch({
      type : "SET_USER",
      payload : res
    })
    setTimeout(() => {
      setLoader(false)
    }, 1000);
  },[])
  
  
  return (
    
    <div className="App">
    { !loader ?
    <>
      <Nav/>
      <Switch>
        <Route exact path='/login'>
          {
          !user.loggedStatus ? 
            <Login/>  :
            <Redirect to="/"/>
          }
        </Route>
        <Route exact path='/signup'>
        {
          !user.loggedStatus ? 
            <Signup/>  :
            <Redirect to="/"/>
          }
        </Route>
        <Route exact path='/addproduct'>
        {
          user.isSeller ? 
            <AddProduct/>  :
            <Redirect to="/"/>
        }
        </Route>
        <Route exact path='/myproduct'>
        {
          user.isSeller ? 
            <MyProduct/>  :
            <Redirect to="/"/>
        }
        </Route>
        <Route exact path='/profile'>
        {
          user.loggedStatus ? <Profile/> : <Redirect to="/"/> 
        }
        </Route>
        <Route exact path='/'>
          <h2>Welcome to Home page</h2>
        </Route>
        <Route path='/*'>
          <Redirect to='/login'/>
        </Route>
      </Switch>
          
    </>:
    // Loading Spinner
    <div className="container">
      <div className="loaderApp"></div>
    </div>
    }
    </div>
 );
}

export default App;
