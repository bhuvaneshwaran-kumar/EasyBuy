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
import Home from './components/Home.js'
import AddProduct from './components/seller/AddProduct'
import MyProduct from './components/seller/MyProduct'

import useAuth from '../src/hooks/useAuth' 
import { useEffect, useState } from 'react';
import {useUserValue} from '../src/contexts/UserProvider'

function App() {
  const [loader,setLoader] = useState(true)
  const [user,dispatch] = useUserValue()
  const {checkLoggedIn} = useAuth() 
  
  
  useEffect(async ()=>{
    let res = await checkLoggedIn()
    dispatch({
      type : "SET_USER",
      payload : res
    })
    setTimeout(() => {
      setLoader(false)
    }, 100);
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
          <Home/>  
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
