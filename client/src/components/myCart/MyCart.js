import React,{useEffect, useState} from 'react'
import './MyCart.css'
import {useCartValue} from '../../contexts/CartProvider'
import IndividualCart from './IndividualCart'
import PlaceOrder from "./PlaceOrder"
import ChooseAddress from "./ChooseAddress"
import {Cancel} from "@material-ui/icons"

function MyCart() {


    const [cart,cartDispatch] = useCartValue()
    const [showOrderDetials,setShowOrderDetials] = useState(false)
    const [totalPrice,setTotalPrice] = useState()
    const [savePrice,setsavePrice] = useState()
    const [checked,setChecked] = useState(false)
    console.log(cart)

    // setPrice(prev => console.log(prev))
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

        setChecked(true)

        }
        checkCartExist()  
      
    
     },[])

    const addTotalValue = ( )=>{
      let result = cart?.productDetials?.reduce((acc,data,index)=>{
        console.log(index,"->>>",typeof data?.offer)    
        if(data?.offer){
          return acc + ( data?.quantity * (data?.price - (data?.price * data?.offer/100 ) ))
        }else{
          return acc + (data?.quantity * data?.price)
        }
      },0)

      // console.log("total value : ",result)
      setTotalPrice(result)

      let result2 = cart?.productDetials?.reduce((acc,data,index)=>{
        console.log(index,"->>>",typeof data?.offer)    
        if(data?.offer){
          return acc + ( data?.quantity * (data?.price * data?.offer/100 ))
        }else{
          return acc + (data?.quantity * (data?.price * ( 15/100 )))
        }
      },0)

      // console.log("total value : ",result)
      setsavePrice(result2)

    }


    return (
      <div style={{height:'90vh'}}>
     { checked &&  
      <div className="my-cart-outer" style = { showOrderDetials ? { background : "rgba(1,1,1,0.1)"}:{}}>
       {
       cart?.productDetials?.length > 0 ? ( 
        <div>
        <div className="cart-grid">
            {
             cart.productDetials.map((data,index)=>   <IndividualCart data={data} key={index} index={index}  />)
            }
        </div>
        </div>
        ) : <div className="no-cart">
<p>No Products Available in Cart</p>
        </div>
      }
      {
        cart?.productDetials?.length > 0 && <PlaceOrder setShowOrderDetials= {setShowOrderDetials} addTotalValue={addTotalValue}/>
      }
      {
        showOrderDetials && (<div className="order-detials">
         <div className="top">
           <p>Order Detials</p>
           <Cancel className="cancel-btn" onClick={()=>setShowOrderDetials(prev=>!prev)}/>
         </div>
         <div className="bottom">
           {cart && <div className="bottom-top">
             <li>Quantity</li>
             <li>Price</li>
           </div>}
           {
          
            cart?.productDetials?.map((data,index)=>(
              
             
            <div className="order-iteam" key={index}>
               <img src={data.pImageDetails[0].imageUrl}></img>
               <li className="fuk-width">
                 {data?.plabel}
               </li>
               <li>
                 {data?.quantity}
               </li>
              {
               data?.offer ?
               <li>{data?.quantity * (data?.price - (data?.price * (data?.offer/100)))} <span style={{textDecoration:"line-through"}}>{data?.quantity * data?.price}</span></li> :
               <li>{data?.quantity * (data?.price)}<span style={{textDecoration:"line-through"}}>{data?.quantity * (data?.price + (data?.price * (15/100)))}</span> </li>
              }
             
            </div>
           ))
           }
             <div className="bottom-bottom">
              {
                cart &&
                <div className="total-price">
                  <p>Total price : ₹ {totalPrice}</p>
                  <p>You Save : ₹ {savePrice}</p>
                </div>
                
              }
               <ChooseAddress/>
                
                
                
              </div>
         </div>




        </div>)
      }
      </div>
      }
      </div>
    )
  
}

export default MyCart
