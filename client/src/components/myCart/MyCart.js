import React,{useEffect} from 'react'
import './MyCart.css'
import {useCartValue} from '../../contexts/CartProvider'
import IndividualCart from './IndividualCart'

function MyCart() {


    const [cart,cartDispatch] = useCartValue()

    console.log(cart)

    
  useEffect(()=>{

        const checkCartExist = async ()=>{
        const result = await fetch('http://localhost:8080/cart/get-cart',{
          mode:'cors',
          credentials:'include'
        })
        const data = await result.json()
        cartDispatch({
          type : 'SET_CART',
          payload : data.userCart
        })
        }
        checkCartExist()  
        
      
    
     },[])


    return (
        <div className="my-cart-outer">
        <div className="cart-grid">
            {
            cart?.productDetials?.length > 0 && cart.productDetials.map((data,index)=>   <IndividualCart data={data} key={index} index={index}/>)
         
            
            }
        </div>
        </div>
    )
}

export default MyCart
