import React, { useState, useEffect } from 'react'
import {Delete,LinkTwoTone} from '@material-ui/icons'
import {Link} from "react-router-dom"
import {useCartValue} from '../../contexts/CartProvider'
import BASE_URL from '../../utils/BASE_URL'


function IndividualCart({data,index}) {


    const [,dispatch] = useCartValue()

    const [price,setPrice] = useState(null)
    const [offer,setOffer] = useState(null)


    const increaseQuantity = ()=>{
     
                dispatch({
                    type : 'INCREASE_QTY',
                    payload : {
                        index:index,
                        value : data.quantity
                    }
                })
           
        }
       
    const decreaseQuantity = ()=>{
     
        if(data.quantity > 1 ){
                dispatch({
                    type : 'DECREASE_QTY',
                    payload : {
                        index:index,
                        value : data.quantity
                    }
                })
            }
           
        }
       

    const deleteCart = ()=>{

        const deleteBackend  =  async()=>{
            let result =await fetch(`${BASE_URL}/cart/delete-cart/?`+new URLSearchParams({
                pid : data.pid
             }),{
                 method:'get',
                 credentials:'include'
             })
            
            if(result.status === 200){
                dispatch({
                    type : 'DELETECART',
                    payload : data.pid
                })
            }

        }

        deleteBackend() 
    }

    useEffect(() => {
        const getPriceAndOffer = async()=>{
            let result =await fetch(`${BASE_URL}/cart/get-price-offer/?`+new URLSearchParams({
               pid : data.pid
            }),{
                method:'get',
                credentials:'include'
            })
            result = await result.json()
            setPrice(result.price)
            setOffer(result?.offer || 0)
            
            dispatch({
                type : "ADDPRICE",
                payload : {
                    index : index,
                    data : { 
                        ...data,
                        price : result.price,
                        offer : result?.offer || 0
                    }
                }
            })
        }
        
        getPriceAndOffer()
    }, [])



    return (
        <div className="cart-outer">
            <img src={data.pImageDetails[0].imageUrl} alt="" />

            <li>
            {data?.plabel}
            </li>
            <div className="quantity">
                
            <button className="btn" onClick={increaseQuantity}> + </button>
            <span>{data?.quantity}</span>
            <button className="btn" onClick={decreaseQuantity}> - </button>

            </div>
            <div className="priceFlex">
                <span className="price">
                ₹{offer ? (price - (price*(offer/100))):(price)}
                </span> - <span style={{color:'red',textDecorationLine:'line-through'}}>
                ₹{offer ? (price + (price*(offer/100))):
                    (price + (price*(15/100)))
                    }
                </span>
            </div>
            <div className="delete-Link">
                <span>
                    <Delete onClick={deleteCart} className="cartDelete"/>
                    <Link to={`/product/${data.pid}`}>
                        <LinkTwoTone className="linkcart"/>
                    </Link>
                </span>
            </div>
         </div>
   
    
    )
}

export default IndividualCart
