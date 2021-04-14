import React,{useEffect, useState, useRef} from 'react'
import { useParams } from 'react-router-dom';
import './styles/Product.css'
import Comment from '../components/comment/Comment'
import {Security,SportsKabaddi} from '@material-ui/icons';
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
                    product.pImageDetails.map((image,index)=>(
                       <img src={image.imageUrl} id={index} onClick={()=>changeMainImage(image.imageUrl)}  id="p-sample-image" alt=""/>
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
                <span>Services :</span>
                <div className="warspan-col">
                <p>
                &nbsp;&nbsp;&nbsp;{product.pwarrantyspan}
                &nbsp; Months Warranty.<Security style={{fontSize:'large',position:'relative',top:'3px',left:'3px',color :'teal'}}/>
                </p>
                <p>
                &nbsp;&nbsp;&nbsp;7
                &nbsp;Days Replacement Policy.&nbsp;<span style={{fontSize:'large',position:'relative',top:'2px',left:'3px',color :'teal'}}>♻</span>
                </p>
                <p>
                &nbsp;
                &nbsp;Cash on Delivery available.&nbsp;<span style={{fontSize:'large',position:'relative',top:'2px',left:'3px',color :'teal'}}>₹</span>
                </p>
                </div>
                </div>
                <div className="col" id="pstatus">
                <span>Stock status :</span>
                <p>Only few left hurry up...!</p>
                </div>
                <div className="col" id="pstatus">
                    <span>Question And Answers :</span>
                <p>

                        <Comment product={product}/>

                </p>
                </div>
            </div>
        </div>
    )
}

export default Product
