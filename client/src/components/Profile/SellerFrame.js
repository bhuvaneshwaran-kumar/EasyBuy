import React from 'react'
import './styles/style.css'
import useAuth from '../../hooks/useAuth'
import {useUserValue} from '../../contexts/UserProvider'

function SellerFrame() {
    
    const [value,dispatch] = useUserValue()

    const {switchToSellerAccount} = useAuth()
    const onSubmitForm = async (event)=>{
        event.preventDefault()
        const data = await switchToSellerAccount()
        // console.log(data)
        let updateValue = {
            isSeller :true
        }
        console.log("check value :->",value)
        dispatch({
            type : "UPDATE_USER",
            payload : updateValue
        })
        
    }


    return (
        <div className="container">
            <div className="top">
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reiciendis quas unde voluptate reprehenderit voluptatibus magni accusamus ipsa nemo, itaque perspiciatis quaerat cupiditate repellendus, quidem iste! Fuga molestiae labore explicabo obcaecati?</p>
            </div>
            <div className="bottom">
                <form onSubmit={onSubmitForm}>
                    <div>
                    <label htmlFor="agreed"> Accept & Agree </label>
                    <input type="checkbox" name="agreed" id="agreed" required/>
                    </div>
                    <button className="btn btn-blue">Switch to seller Account</button>
                </form>
            </div>
        </div>
    )
}

export default SellerFrame
