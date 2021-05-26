import React from 'react'


function PlaceOrder({setShowOrderDetials,addTotalValue}) {
    
    
    return (
        <div className="Place-order">
            <button className="place-order-btn" onClick={()=>{addTotalValue();setShowOrderDetials(prev=>!prev)}}>
                Place Order
            </button>
        </div>
    )
}

export default PlaceOrder
