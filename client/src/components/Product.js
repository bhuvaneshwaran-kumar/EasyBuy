import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';

function Product() {
    const [product,setProduct] = useState(null)
    const {id} = useParams();
    console.log("hiihi",id)
    useEffect(()=>{
       
    },[])
    return (
        product&&
        <div>
            {product}
        </div>
    )
}

export default Product
