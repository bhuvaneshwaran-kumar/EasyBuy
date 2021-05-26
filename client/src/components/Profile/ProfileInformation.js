import React from 'react'
import './styles/ProfileInformation.css'
import {useRef,useState} from 'react'
import {useUserValue} from '../../contexts/UserProvider'


function ProfileInformation() {
    const [user,dispatch] = useUserValue()
    const [name,setName] = useState(user.name)
    const [editState,setEditState] = useState(false)
    const form = useRef()

    const changeName = (e)=>{
        setName(e.target.value)
    }

    const submmitForm = async (e)=>{
        e.preventDefault()
        if(editState){
            const result = await fetch("http://localhost:8080/user/edit-name",{
                method:"post",
                credentials : 'include',
                headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                body : JSON.stringify({
                    name : form.current.uname.value
                })  
            })

            if(result.status === 200){
                setEditState(false)
                form.current.uname.setAttribute('disabled','')

            }
        }
        else{
            form.current.uname.removeAttribute('disabled')
            console.log(form.current.uname)
            setEditState(true)
        }
        console.log("hey you")
    }
    
    return (
        <div className="p-inf-main">
            <div className="p-inf-cont">
                <p>Profile information</p>
            </div>
            <form ref={form} onSubmit={submmitForm}>
                <div className="p-inf-cont">
                   <label>User Name:</label>
                   <input type="text" className="input-2" name="uname" value={name} onChange={changeName} disabled/> 
                </div>
                <div className="p-inf-cont">
                   <label>User Email:</label>
                   <input type="text" className="input-2" value = {user.email} disabled/> 
                </div>
                <div className="p-inf-cont button">
                    {
                    
                        <button className="btn">{editState ? "UPDATE" : "EDIT"}</button>
                    
                    }
                </div>
            </form>
            
        </div>
    )
}

export default ProfileInformation
