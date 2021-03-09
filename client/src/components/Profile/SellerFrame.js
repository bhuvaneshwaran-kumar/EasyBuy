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
                <li>We provide Easybuy fulfilment services through which you can ensure faster delivery of your items, quality check by our experts and a delightful packaging. Combine these with the fastest payments in the industry and you get an excellent seller portal. No wonder Easybuy is India’s favourite place to sell online </li>
                <li>Selling on easybuy.com is easy and absolutely free. All you need is to register, list your catalog and start selling your products.
                </li>
                <li>Easybuy seller membership are subjected to market risks please read all scheme related documents carefully before signing</li>
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
