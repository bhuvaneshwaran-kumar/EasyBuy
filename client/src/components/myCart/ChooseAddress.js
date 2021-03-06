// import { get } from 'mongoose'
import React, { useEffect, useRef, useState } from 'react'
import {useCartValue} from '../../contexts/CartProvider'
import BASE_URL from '../../utils/BASE_URL'



function ChooseAddress() {


    const [Address,setAddress] = useState()
    useEffect(()=>{
        const getAddress = async()=>{
            const result = await fetch(`${BASE_URL}/cart/get-user-address`,{
            mode:'cors',
            credentials:'include'
            })
            const data = await result.json() 
            setAddress(data.address)
        }
        getAddress()
    },[])


    
    const [cart,dispatch] = useCartValue()
    const form = useRef()
    let i = 0 
    const formSubmit = async(e)=>{
        e.preventDefault()

        const placeOrder = async ()=>{
            
           

            const Data = {
                data : cart.productDetials,
                address : form.current.Address.value
            }
            
            const result =  await fetch(`${BASE_URL}/place-order/`,{
                mode:"cors",
                credentials : "include",
                method : "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify(Data)        
            })
            if(result.status === 200){
                i++;
                // alert("order placed successfully 😁😁")
                dispatch({
                    type : "SET_CART",
                    payload : undefined
                })
            }
        }

        if(i===0){
            placeOrder()
        }


      
    } 

    return (
        <>
        { cart && 
            <div className="selectAddress">
            <p>Select Address :</p>
            <form ref={form} onSubmit={(e)=>formSubmit(e)}>
                {
                    Address &&
                    Address.map((data,index)=>(
                        <div key={index} className="select-address">
                        <input value={data.uAddress} required type="radio" name="Address" id={index}/> <label for={index} >{data.uAddress}</label>
                        </div>
                    ))
                    
                }
                <button className="confirm-order">Confirm Order</button>
            </form>
        </div>
        }
        { !cart &&
            <div className="success-order">
                <h1>Order placed successfully..</h1>
            </div>
        }
        </>
    )
}

export default ChooseAddress
