import React,{useState,useEffect} from 'react'
import './styles/Profile.css'
import {useUserValue} from "../contexts/UserProvider"
import useAuth from '../hooks/useAuth'
import {LocalMall,Person,SettingsPower,Business} from '@material-ui/icons'
import SellerFrame from "./Profile/SellerFrame"
import ProfileInformation from "./Profile/ProfileInformation"
import ManageAddress from "./Profile/ManageAddress"
import OrderDetials from "./Profile/OrderDetials"


function Profile() {
  const [display,setDisplay] = useState('my orders')
  const {logout} = useAuth()
  const [value,dispatch] = useUserValue()

  useEffect(()=>{
    setDisplay('my orders')
  },[value])

  const Logout = async()=>{
      let res = await logout(value.email)
      if(res){
          dispatch({
              type : "SET_USER",
              payload : {
                  loggedStatus : false
              }
          })
      }
  }

    return (
        <div className="about">
          <div className="left">
          <div className="top">
            <div className=" row">
              <img className="image" height="50px" width="50px" src="//img1a.flixcart.com/www/linchpin/fk-cp-zion/img/profile-pic-male_4811a1.svg" alt="profile"/>
              <div className="greating">
                <div><p>Hello,</p></div>
                <div>
                  <strong>{value.name}</strong>
                </div>
                </div>
              </div>
            </div>
          
          <div className="bottom">
            <div className="row">
            <LocalMall style={{ color: "teal" }}/>
            <h3 className="head" onClick={()=>setDisplay('OrderDetials')}
            style = {{
              borderRight : display === "OrderDetials" ? '4px solid teal' : ''
            }}
            >MY ORDERS</h3>
            
            </div>
            <div className="row">
            <Person style={{ color: "teal" }}/>
            <h3 className="head" onClick={()=>setDisplay('ProfileInformation')} >ACCOUNT SETTINGS</h3>
            <div>
              <div className="list" onClick={()=>setDisplay('ProfileInformation')}
              style = {{
                borderRight : display === "ProfileInformation" ? '4px solid teal' : ''
              }}
              >Profile Information</div>
              <div className="list" onClick={()=>setDisplay('ManageAddress')}
              style = {{
                borderRight : display === "ManageAddress" ? '4px solid teal' : ''
              }}
              >Manage Addresses</div>
            </div>

            </div>
            <div className="row" onClick={Logout}>
            <SettingsPower style={{ color: "teal" }}/>
            <h3 className="head">LOGOUT</h3>
            </div>

          { !value.isSeller &&
            <div className="row" onClick={()=>setDisplay('sellerframe')}>
            <Business style={{ color: "teal" }}/>
            <h3 className="head">SWITCH TO SELLER ACCOUNT</h3>
            </div> 
          }
          </div>
          

          </div>
          <div className="right">
          {
            display === "ProfileInformation" &&
            <ProfileInformation/>
          }
          {
            display === "sellerframe" &&
            <SellerFrame/>
          }
          {
            display === "ManageAddress" &&
            <ManageAddress/>
          }
          {
            display === "OrderDetials" &&
            <OrderDetials/>
          }
         
          </div>
        </div>
    )
}

export default Profile
