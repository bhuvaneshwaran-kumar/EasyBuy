import React,{useEffect, useState, useRef, useContext} from 'react'
import { Link, useParams } from 'react-router-dom';
import {IconButton,Button} from "@material-ui/core" 
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

import './styles/Product.css'
import Comment from '../components/comment/Comment'
import {Security,SportsKabaddi} from '@material-ui/icons';
import {useUserValue} from '../contexts/UserProvider'
import {useCartValue} from '../contexts/CartProvider'

function Product() {
    const [product,setProduct] = useState(null)
    const [user] = useUserValue()
    const [isLiked,setIsLiked] = useState(false)
    const [cartExist,setCartExist] = useState(false)
    // console.log(user._id,product.sellerId)
    
    const [cart,cartDispatch] = useCartValue()

    const {id} = useParams();
    const image = useRef()
    const changeMainImage = (imageUrl)=>{
        image.current.src = imageUrl
    }
    useEffect(()=>{
        const checkWishlist = async(id)=>{
            let wishlistData = {
                productId : id,
                userId : user._id,
                userEmail : user.email,
            }
            let  result  = await fetch('http://localhost:8080/product/checkwishlist',{
                mode:"cors",
                credentials : "include",
                method : "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify(wishlistData)        
            })

            if(result.status == 200){
                setIsLiked(true)
            }else{
                setIsLiked(false)
            }
        }
        const getProductDetials = async (id)=>{
            const result = await fetch('http://localhost:8080/product/getproductdata/?'+ new URLSearchParams({
                id : id 
              }),{
                credentials : "include"
              })
            const data = await result.json()
            console.log(data)
            setProduct(data.result)
        }
        const checkCartExist = async ()=>{
            let result = await fetch(`http://localhost:8080/cart/check-cart-exist/?`+new URLSearchParams({
               pid : id
            }),{
                method:'get',
                credentials:'include'
            })
            if(result.status === 200){
                setCartExist(true)
            }
        }
      
        checkWishlist(id)
        getProductDetials(id)
        checkCartExist()

    },[])
    

    

    const addToCart =  async()=>{
        console.log("calling add to cart --->")

        const result = await fetch('http://localhost:8080/cart/add-cart/',{
            mode:"cors",
            credentials : "include",
            method : "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body : JSON.stringify({
                pid : product._id,
                plabel : product.plabel,
                pImageDetails : product.pImageDetails,
                quantity : 1
            })        
        })

        // if(result.status == 200){
        //     const data = {
        //         pid : product._id,
        //         plabel : product.plabel,
        //         pImageDetails : product.pImageDetails,
        //         quantity : 1
        //     }
        //    if(cart){
        //         cartDispatch({
        //             type : 'PREPANDCART',
        //             payload : data
        //         })
        //    }else{
        //     cartDispatch({
        //         type : 'SET_CART',
        //         payload : data
        //     })
        //    }
        // }
        setCartExist(true)

        const data = await result.json()
        console.log(data)
    }


    const addRemoveWishlist = async ()=>{
        console.log("add rome")
        let result
        let wishlistData = {
            productId : id,
            userId : user._id,
            userEmail : user.email,
        }
        console.log(id,wishlistData)
        if(isLiked){
            result  = await fetch('http://localhost:8080/product/removewishlist',{
                mode:"cors",
                credentials : "include",
                method : "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify(wishlistData)        
            })
        }else{
            result  = await fetch('http://localhost:8080/product/addwishlist',{
                mode:"cors",
                credentials : "include",
                method : "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify(wishlistData)        
            })
        }
        if(result.status === 200){
            setIsLiked((prev)=>!prev)
        }
    }

    // console.log(product)
    return (
        product&&
        <div className = "mono-product-outer">
            <div className="mono-product-image" >
                <div className="mono-Pimage-left">
                {
                    product.pImageDetails.map((image,index)=>(
                       <img src={image.imageUrl} id={index} onClick={()=>changeMainImage(image.imageUrl)}  id="p-sample-image" alt=""/>
                    ))
                }
                </div>
                <div className="mono-Pimage-right" >
                    <img ref={image} id="p-main-image" src={ product.pImageDetails[0].imageUrl} alt="" style={{marginBottom : '10px',height:"500px"}}/>
                    <div className="mono-cart-buy">
                        {
                            product.sellerId !== user._id &&
                             ( 
                                 <>
                           { product.pstock > 0 && ( !cartExist ? <button
                             onClick = {addToCart}
                             >Add To Cart</button>:
                             <button>
                                 <Link to="/my-cart" className="check-cart">
                                 check cart
                                 </Link>
                             </button>
                           )
                           }
                                {
                                    product.pstock > 0 ? 
                            <button>Buy Now</button> :
                            <button>Remaind Me</button>
                                }
                                </>
                             )
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
                {
                    product.pofferspan ?
                    <>
                    <span>₹{product.pcost - (product.pcost * product.pofferspan/100)}</span>
                    <span>₹{product.pcost}</span>
                    <span>{product.pofferspan}% off</span>
                    </> :
                    <>
                    <span>₹{product.pcost}</span>
                    <span>₹{product.pcost + product.pcost * 15/100}</span>
                    <span>15% off</span>
                    </>
                }
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
           
           
                <div className="product-addWishlist">
                  { user._id !== product.sellerId && 
                    <Button variant="contained" onClick={addRemoveWishlist}>
                        { isLiked ? <FavoriteIcon style={{color:'red'}}/>: <FavoriteBorderIcon/>}
                        + Add WishList
                    </Button>
                 }
                </div>
           
            </div>
        </div>
    )
}

export default Product
