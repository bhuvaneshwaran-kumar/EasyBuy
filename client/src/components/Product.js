import React,{useEffect, useState, useRef} from 'react'
import { useParams } from 'react-router-dom';
import './styles/Product.css'
function Product() {
    const [product,setProduct] = useState(null)
    const {id} = useParams();
    const image = useRef()
    const changeMainImage = (imageUrl)=>{
        image.current.src = imageUrl
    }
    useEffect(()=>{
        
        const getProductDetials = async (id)=>{
            const result = await fetch('http://localhost:8080/product/getproductdata/?'+ new URLSearchParams({
                id : id 
              }),{
                credentials : "include"
              })
            const data = await result.json()
            setProduct(data.result)
        }

        getProductDetials(id);

    },[])
    console.log(product)

    return (
        product&&
        <div className = "mono-product-outer">
            <div className="mono-product-image">
                <div className="mono-Pimage-left">
                {
                    product.pImageDetails.map((image)=>(
                       <img src={image.imageUrl} onClick={()=>changeMainImage(image.imageUrl)}  id="p-sample-image" alt=""/>
                    ))
                }
                </div>
                <div className="mono-Pimage-right">
                    <img ref={image} id="p-main-image" src={ product.pImageDetails[0].imageUrl} alt=""/>
                    <div className="mono-cart-buy">
                        <button>Add To Cart</button>
                        {
                            product.pstock ? 
                            <button>Buy Now</button> :
                            <button>Remaind Me</button>
                        }
                    </div>
                </div>
                
            </div>
            <div className="mono-product-detials">
                <div className="col" id=" plabel">
                    <h3>
                        {product.plabel}
                    </h3>
                </div>
                <div className="col" id="price">
                <span>₹{product.pcost}</span>
                <span>₹{product.pcost + product.pcost * 15/100}</span>
                <span>15% off</span>
                </div>
                <div className="col" id="pdescription">
                <span>About product :</span>
                <pre>{product.pdescription}</pre>
                </div>
                <div className="col" id="pwarspan">
                <span>Warranty period :</span>
                <span>{product.pwarrantyspan}</span>
                <span> months.</span>
                </div>
                <div className="col" id="pstatus">
                <span>Stock status :</span>
                <p>Only few left hurry up...!</p>
                </div>
            </div>
        </div>
    )
}

export default Product
