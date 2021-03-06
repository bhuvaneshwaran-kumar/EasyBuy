import './App.css';
import Nav from './components/Nav.js'
import Footer from './components/Footer/Footer.js'
import Login from "./components/Login.js"
import {
  Switch,
  Route,
  Redirect,
  Link
} from 'react-router-dom'
import Signup from './components/Signup.js'
import Profile from './components/Profile.js'
import Product from './components/Product.js'
import Home from './components/home/Home.js'
import AddProduct from './components/seller/AddProduct'
import MyProduct from './components/seller/MyProduct'
import MyCart from './components/myCart/MyCart'
import CompareList from './components/compare/CompareList'
import useAuth from '../src/hooks/useAuth' 
import { useEffect, useState } from 'react';
import {useUserValue} from '../src/contexts/UserProvider'


function App() {
  const [loader,setLoader] = useState(true)
  const [user,dispatch] = useUserValue()
  const {checkLoggedIn} = useAuth() 
  
  
  useEffect(()=>{
    
    const makeReq = async ()=>{
      let res = await checkLoggedIn()
      
      dispatch({
        type : "SET_USER",
        payload : res
      })
    }
    makeReq()
    const timer = setTimeout(() => {
      setLoader(false)
    }, 900);
    return ()=>clearTimeout(timer)

  },[dispatch])
  


  // User has switched back to the tab


  return (
    
    <div className="App">
    { !loader ?
    <>
      <Nav/> 
      <Switch>
        <Route exact path='/login'>
          {
          !user?.loggedStatus? 
            <Login/>  :
            <Redirect to="/"/>
          }
        </Route>
        <Route exact path='/signup'>
        {
          !user?.loggedStatus ? 
            <Signup/>  :
            <Redirect to="/"/>
          }
        </Route>
        <Route path='/product/:id'>

        {
          !user?.loggedStatus ? 
            <Signup/>  :
            <Product/>   
        }
        </Route>
        <Route exact path='/addproduct'>
        {
          user?.isSeller ? 
            <AddProduct/>  :
            <Redirect to="/"/>
        }
        </Route>
        <Route exact path='/myproduct'>
        {
          user?.isSeller ? 
            <MyProduct/>  :
            <Redirect to="/"/>
        }
        </Route>
        <Route exact path='/profile'>
        {
          user?.loggedStatus ? <Profile/> : <Redirect to="/"/> 
        }
        </Route>
        <Route path ='/search/:Searchkeys'>
          <Home/> 
        </Route>
        <Route exact path='/'>
          <Home/>  
        </Route>
        <Route exact path='/my-cart'>
        {
          !user?.loggedStatus ? 
            <Login/>  :
            <MyCart/>
          }
        </Route>
        <Route exact path='/compare'>
        {
          !user?.loggedStatus ? 
            <Login/>  :
            <CompareList/>
          }
        </Route>

        
      </Switch>
         { user?.loggedStatus && <div className="compare-contaier">
            <Link to="/compare">
                Compare
            </Link>
          </div>}
      <Footer/>   
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
