import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
function CompareListRight({data}) {
    const [product,setProduct] = useState()
    useEffect(() => {
        const getProductDetials = async ()=>{
            let result = await fetch(`http://localhost:8080/comparelist/get-product-data/?`+new URLSearchParams({
               pid : data.pid
            }),{
                method:'get',
                credentials:'include'
            })
            if(result.status === 200){
                const data = await result.json()
                setProduct(data)
            }
        }
        getProductDetials()
    }, [])
    console.log("product",product)
    return (
        <div className="CompareList-right-inner">
            <img src={product?.pImageDetails[0]?.imageUrl} alt="" />
            <p className="label">{product?.plabel}</p>
            <p className="warenty-span">
                Warranty Span : 
                <span>  {product?.pwarrantyspan} in Months</span>
            </p>
            <div className="description-product">
                <h3>Description :</h3>
                <textarea rows="10" value={product?.pdescription} disabled></textarea>
            </div>
            <p className="warenty-span">No of people wishListed : <span>{product?.wishList.length + 1000}</span></p>
           {
           product?.pofferspan ?
           
           <p className="warenty-span">Price : <span>
               ₹{
                product?.pcost - ( product?.pcost *  product?.pofferspan/100)
                }
            </span>
            <span style={{color:'red',textDecoration:'line-through'}}>
            ₹{product?.pcost}
            </span>
            </p> :
            <p className="warenty-span">Price : <span>
            ₹{
                 product?.pcost
            }
            </span>
            <span style={{color:'red',textDecoration:'line-through'}}>
            ₹ {product?.pcost + ( product?.pcost *  15/100)}
            </span>
            </p> 
            }
            <Link className="product-link" to={`/product/${product?._id}`}>GET ME TO THE PRODUCT</Link>
        </div>
    )
}

export default CompareListRight
