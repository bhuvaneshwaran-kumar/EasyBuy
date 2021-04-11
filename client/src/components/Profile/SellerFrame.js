import React,{useRef} from 'react'
import './styles/style.css'
import useAuth from '../../hooks/useAuth'
import {useUserValue} from '../../contexts/UserProvider'
import { useHistory } from 'react-router'

function SellerFrame() {
    const form = useRef()
    const [value,dispatch] = useUserValue()
    let history = useHistory()
    const {switchToSellerAccount} = useAuth()
    const onSubmitForm = async (event)=>{
        event.preventDefault()

        const {uName,uMobNum,uPinNum,uLocality,uAddress,uRegional,uAlMobNum,uState,uLandmark,uAddType} = form.current

        const data = {
        "uName":uName.value,
        "uMobNum":uMobNum.value,
        "uPinNum":uPinNum.value,
        "uLocality":uLocality.value,
        "uAddress":uAddress.value,
        "uRegional":uRegional.value,
        "uAlMobNum":uAlMobNum.value,
        "uState":uState.value,
        "uLandmark":uLandmark.value,
        "uAddType":uAddType.value
        }

        // console.log(data)
        let result = await switchToSellerAccount(data)
        console.log("result after submiting shop address->",result)

        // let updateValue = {
        //     isSeller :true
        // }
        // console.log("check value :->",value)
        dispatch({
            type : "UPDATE_USER",
            payload : result
        })
        history.push("/profile")
    }


    return (
        <div className="container">
            <div className="top">
                <li>Read the Terms and Conditions.</li>
                <li>We provide Easybuy fulfilment services through which you can ensure faster delivery of your items, quality check by our experts and a delightful packaging. Combine these with the fastest payments in the industry and you get an excellent seller portal. No wonder Easybuy is India’s favourite place to sell online </li>
                <li>Selling on easybuy.com is easy and absolutely free. All you need is to register, list your catalog and start selling your products.
                </li>
                <li>Easybuy seller membership are subjected to market risks please read all scheme related documents carefully before signing</li>
                <li>Fill Your Shop Address.</li>
            </div>
            <form  ref={form} onSubmit={onSubmitForm}>
        <div id="addAdd-row">
            <div className="m-inf-cont" id="addAdd-col">
                <label>User Name (Optional) :</label>
                <input type="text" className="input-2" name="uName"/> 
            </div>
            <div className="m-inf-cont" id="addAdd-col">
                <label>10-digit mobile number :</label>
                <input type="text" required className="input-2" name="uMobNum"/> 
            </div>

        </div>
        <div id="addAdd-row">
            <div className="m-inf-cont" id="addAdd-col">
                <label>Pincode :</label>
                <input type="text" required className="input-2" name="uPinNum"/> 
            </div>
            <div className="m-inf-cont" id="addAdd-col">
                <label>Locality :</label>
                <input type="text" required className="input-2" name="uLocality"/> 
            </div>

        </div>
        <div id="addAdd-row">
           
            <div className="m-inf-cont" id="textarea">
                <textarea required className="input-2" name="uAddress" id="" cols="100" rows="06" placeholder="Address(Area and street)"></textarea>
            </div>

        </div>
        <div id="addAdd-row">
            <div className="m-inf-cont" id="addAdd-col">
                <label>City/District/Town :</label>
                <input required type="text" className="input-2" name="uRegional"/> 
            </div>
            <div className="m-inf-cont" id="addAdd-col">
                <label>State :</label>
                <input type="text" required list="State" className="input-2" name="uState"/> 
                <datalist id="State">
                    <option value="Tamilnadu">Tamilnadu</option>
                </datalist>
            </div>

        </div>
        <div id="addAdd-row">
            <div className="m-inf-cont" id="addAdd-col">
                <label>Landmark (Optional) :</label>
                <input type="text" className="input-2" name="uLandmark"/> 
            </div>
            <div className="m-inf-cont" id="addAdd-col">
                <label>Alternate Phone (Optional) :</label>
                <input type="text" list="State" className="input-2" name="uAlMobNum"/> 
            </div>
        </div>
        <div id="radio-btn">
            <label htmlFor="uAddType">Address Type :</label> <br/>
            <input value="Shop Address" type="radio" id= "Home" name="uAddType" defaultChecked/> <label htmlFor="Home">Shop Address</label>
            
        </div>
        
            <div className="bottom">
                
                    <div>
                    <label htmlFor="agreed"> Accept & Agree </label>
                    <input type="checkbox" name="agreed" id="agreed" required/>
                    </div>
                    <button className="btn btn-blue">Switch to seller Account</button>
               
            </div>
            </form>
        </div>
    )
}

export default SellerFrame
