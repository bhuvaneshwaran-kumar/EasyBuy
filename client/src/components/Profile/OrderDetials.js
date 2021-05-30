import React, { useEffect, useState } from 'react'
import IndividualOrderDetials from "./IndividualOrderDetials.js"
import './styles/OrderDetials.css'
function OrderDetials() {

    const [data,setData] = useState()

    useEffect(()=>{
        const getOrderDetials = async()=>{
            const result = await fetch('http://localhost:8080/place-order/get-user-order-detials',{
            mode:'cors',
            credentials:'include'
            })
            const result_data = await result.json() 
            setData(result_data)
        }
        getOrderDetials()
    },[])


    return (
        <div className="OrderDetials">
            {
                 data && data?.data.map((iteam,index)=>(
                    <IndividualOrderDetials data={iteam} key = {index}/>

                 ))
            }
        </div>
    
    )
}



export default OrderDetials
