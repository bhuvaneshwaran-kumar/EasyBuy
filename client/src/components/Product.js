import React,{useEffect, useState, useRef} from 'react'
import { Link, useParams } from 'react-router-dom';
import {Button} from "@material-ui/core" 
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

import './styles/Product.css'
import Comment from '../components/comment/Comment'
import {Security} from '@material-ui/icons';
import {useUserValue} from '../contexts/UserProvider'
// import {useCartValue} from '../contexts/CartProvider'

function Product() {
    const [product,setProduct] = useState(null)
    const [user] = useUserValue()
    const [isLiked,setIsLiked] = useState(false)
    const [isRemaind,setIsRemaind] = useState(false)
    const [cartExist,setCartExist] = useState(false)
    const [compare,setCompare] = useState(false)
    

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

            if(result.status === 200){
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
        const checkRemaindMe = async(id)=>{
            let RemaindMeData = {
                productId : id,
                userId : user._id,
                userEmail : user.email,
            }
            let  result  = await fetch('http://localhost:8080/product/check-remaind-me',{
                mode:"cors",
                credentials : "include",
                method : "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify(RemaindMeData)        
            })

            if(result.status === 200){
                setIsRemaind(true)
            }else{
                setIsRemaind(false)

            }
        }
        const checkCompareExist = async(id)=>{
            let result = await fetch(`http://localhost:8080/comparelist/get-user-compare-exist/?`+new URLSearchParams({
               pid : id
            }),{
                method:'get',
                credentials:'include'
            })
            if(result.status === 200){
                setCompare(true)
            }else{
                setCompare(false)
            }
        }

        checkWishlist(id)
        getProductDetials(id)
        checkCartExist()
        checkRemaindMe(id)
        checkCompareExist(id)

    },[])
    

    

    const addToCart =  async()=>{

        await fetch('http://localhost:8080/cart/add-cart/',{
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

        setCartExist(true)

    }


    const addRemoveWishlist = async ()=>{
        let result
        let wishlistData = {
            productId : id,
            userId : user._id,
            userEmail : user.email,
        }
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

    //Cloning for remaind me
    const addRemoveRemaindMe = async ()=>{
        let result
        let remaindMeData = {
            productId : id,
            userId : user._id,
            userEmail : user.email,
        }
        if(isRemaind){
            result  = await fetch('http://localhost:8080/product/remove-remaind-me',{
                mode:"cors",
                credentials : "include",
                method : "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify(remaindMeData)        
            })
        }else{
            result  = await fetch('http://localhost:8080/product/add-remaind-me',{
                mode:"cors",
                credentials : "include",
                method : "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify(remaindMeData)        
            })
        }
        if(result.status === 200){
            setIsRemaind((prev)=>!prev)
        }
    }


    // Add to Compare
    const AddToCompare = async ()=>{
        let detials = {
            uid : user._id,
            item : product?.pitem,
            pid:id
        }
        const result = await fetch("http://localhost:8080/comparelist/add-user-compare-list",{
            method :"post",
            mode:"cors",
            credentials : "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body :JSON.stringify(detials)
        })
        if(result.status === 200) {
            setCompare(true)
        }
    }

    return (
        product&&
        <div className = "mono-product-outer">
            <div className="mono-product-image" >
                <div className="mono-Pimage-left">
                {
                    product.pImageDetails.map((image,index)=>(
                       <img key={index} src={image.imageUrl} id={index} onClick={()=>changeMainImage(image.imageUrl)}  id="p-sample-image" alt={image.imageUrl}/>
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
                           { product.pstock > 0 ? ( !cartExist ? <button
                             onClick = {addToCart}
                             >Add To Cart</button>:
                             <button>
                                 <Link to="/my-cart" className="check-cart">
                                 check cart
                                 </Link>
                             </button>
                           ) :  <button onClick={addRemoveRemaindMe}>{isRemaind ? "Will Remaind You." : "Remaind Me"}</button>
                           }
                          {!compare ? <button onClick={AddToCompare}>
                               Add To Compare
                           </button> : <button>
                               Check Compare
                           </button> }
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
                <div>

                        <Comment product={product}/>

                </div>
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
