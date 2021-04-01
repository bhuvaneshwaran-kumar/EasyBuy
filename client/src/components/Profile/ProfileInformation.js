import React from 'react'
import './styles/ProfileInformation.css'
import {useRef,useState} from 'react'
import {useUserValue} from '../../contexts/UserProvider'


function ProfileInformation() {
    const [user,dispatch] = useUserValue()
    console.log("user -> profile info :",user)

    const submmitForm = async (e)=>{
        e.preventDefault()
    }
    
    return (
        <div className="p-inf-main">
            <div className="p-inf-cont">
                <p>Profile information</p>
            </div>
            <form onSubmit={submmitForm}>
                <div className="p-inf-cont">
                   <label>User Name:</label>
                   <input type="text" className="input-2" value={user.name} disabled name="email"/> 
                </div>
                <div className="p-inf-cont">
                   <label>User Email:</label>
                   <input type="text" className="input-2" value = {user.email} disabled/> 
                </div>
                <div className="p-inf-cont button">
                    <button className="btn">Edit</button>
                    <button className="btn">Update</button>
                </div>
            </form>
            
        </div>
    )
}

export default ProfileInformation
