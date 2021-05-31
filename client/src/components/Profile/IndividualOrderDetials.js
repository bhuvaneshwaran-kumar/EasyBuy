import React,{useEffect, useState} from 'react'
import BASE_URL from '../../utils/BASE_URL'

function IndividualOrderDetials({data}) {
    const [product,setProduct] = useState()
    const [date] = useState(new Date(data?.orderPlacedTimeStamp))
    useEffect(()=>{
        const getProductsDetials = async ()=>{

            let Data = {
                pid : data.productDetials.pid
            }
            const result =  await fetch(`${BASE_URL}/place-order/get-product-detials`,{
                method : "post",
                mode:"cors",
                credentials : "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify(Data)        
            })
            let datum = await result.json()
            setProduct(datum.result)

        }
        getProductsDetials()
    },[])

    return (
        <div className="individual-order">
              {
                  product &&
                  <img src={product.pimage} alt="" />
              }
              <div className="text-data-order">
                  <li style={{color : "teal"}}>
                      {product?.label}
                  </li>
                  <li>
                      Quantity : <span
                       style={{color : "teal"}}
                       >
                      {data?.productDetials?.quantity}
                      </span>
                  </li>
                  <li>
                      Price : <span style={{color : "green"}}>₹ &nbsp; 
                      {
                          data?.price
                      }
                      </span>

                  </li>
                  <li>
                      Order placed At : <span style={{color : "teal"}}> {date.getFullYear()} - {date.getDate()} - {date.getMonth()+1}
                      </span>
                      </li>
              </div>
              <div className="order-status">

                      <p style={{color : data.orderStatus.code !==204 ? 'green' : 'red'}}>
                          {data.orderStatus.message}
                      </p>



              </div>
            
        </div>
    )
}

export default IndividualOrderDetials
