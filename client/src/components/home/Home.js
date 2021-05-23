import React,{useRef,useCallback,useEffect,useState} from 'react'
// import { useState } from 'react'
import './homeStyles/Home.css'
import { useHistory,Link,useParams } from 'react-router-dom';
import Slider from './Slider.js'



function Home() {
    const {Searchkeys} = useParams()

    console.log(Searchkeys)

    const [productToBeFetched,setProductToBeFetched] = useState('all')
    const scrollTo = (element)=>{
        // const y = window.pageYOffset + 20;
        // element.current.scrollIntoView({ behavior: 'smooth',  block: "start" })
        element.current.scrollTop -= 10;
    }

    const productsDiv = useRef()
    const top = useRef()
    const [hasMore,setHasMore] = useState(false)
    const observer = useRef(null)
    const [skip,setSkip] = useState(0)
    const [products, setProducts] = useState([]) 
    const [searchProducts, setSearchProducts] = useState([]) 
    const [loader,setLoader] = useState(false)

    
  



        // Handels Adding Observer To The Last Product Element 
        const lastPostRefCallback = useCallback(node => {
            if (loader) return
            if (observer.current)
                observer.current.disconnect()
        
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setSkip(products.length)
                }
            })
        
            if (node)
                observer.current.observe(node)
          }, [loader,hasMore,products.length])   


          const productDetials = async (skip)=>{
            const response = await fetch('http://localhost:8080/product/home/?'+ new URLSearchParams({
                skip : skip ,
                productToBeFetched : productToBeFetched
              }),{
                credentials : "include"
              })      
              const data = await response.json()
              setProducts((prev)=>{
                  return [...prev,...data.product]
              })
            setHasMore(data.hasMore)
            setLoader(false)
            }   

        useEffect(()=>{
            setProducts([])
            setLoader(true)  
            productDetials(0)
        },[productToBeFetched])


        // Fetch product from server when ever the State Skip change the value.
        useEffect(()=>{
            setLoader(true)  
            productDetials(products.length)
          },[skip])

        useEffect(()=>{
            if(Searchkeys){
                const getSearchData = async()=>{
                    setSearchProducts([])
                    const response = await fetch('http://localhost:8080/product/home/search/?'+ new URLSearchParams({
                        Searchkeys : Searchkeys ,
                      }),{
                        credentials : "include"
                      })      
                      const data = await response.json()
                      console.log(data)
                      setSearchProducts((prev)=>{
                          return [...prev,...data.products]
                      })
                    setLoader(false)

                }
               getSearchData()
            }
        },[Searchkeys])


          console.log(products)
    return (
        <div ref={top} className="home-container" style={{minHeight:'50vw'}}>
             <div className="home-row home-top-nav" >
                <div onClick={()=>setProductToBeFetched('all') } className={productToBeFetched === "all" ?"btn top-nav-list active":"btn top-nav-list "}>
                 <img src="/Nav-img/Top offer.png" alt=""/>
                 <li>All</li>
                 </div>
                 <div onClick={()=>setProductToBeFetched('offer') } className={productToBeFetched === "offer" ?"btn top-nav-list active":"btn top-nav-list "}>
                 <img src="/Nav-img/Top offer.png" alt=""/>
                 <li>Top Offers</li>
                 </div>
                 <div onClick={()=>setProductToBeFetched('mobiles')} className={productToBeFetched === "mobiles" ?"btn top-nav-list active":"btn top-nav-list "}>
                 <img src="/Nav-img/Mobile.png" alt=""/>
                 <li>Mobiles</li>
                 </div>
                 <div onClick={()=>setProductToBeFetched('Fashion')} className={productToBeFetched === "Grocery" ?"btn top-nav-list active":"btn top-nav-list "}>
                 <img src="/Nav-img/Grocery.png" alt=""/>
                 <li>Grocery</li>
                 </div>
                 <div onClick={()=>setProductToBeFetched('Fashion')} className={productToBeFetched === "Fashion" ?"btn top-nav-list active":"btn top-nav-list "}>
                 <img src="/Nav-img/Fashion.png" alt=""/>
                 <li>Fashion</li>
                 </div>
                 <div onClick={()=>setProductToBeFetched('Fashion')} className={productToBeFetched === "Electronics" ?"btn top-nav-list active":"btn top-nav-list "}>
                 <img src="/Nav-img/Electronincs.png" alt=""/>
                 <li>Electronics</li>
                 </div>
             </div>  
             <div className="home-row slider">
                 <Slider/>
             </div> 
             <div ref={productsDiv} className="home-row products">
                {
                  !Searchkeys ?  products.map((product,index)=>(
                        (index === products.length-1) ? (
                        <Link to={`/product/${product._id}`} target="_blank" className="product-outer">
                        <div ref={lastPostRefCallback} key={product._id} id="home-outer">
                            <div className="left">
                            <img src={product.pImageDetails[0].imageUrl} alt=""/>
                            </div>
                            <div id="home-right">
                                <h4>{product.plabel}</h4>
                                {product.pofferspan && <p style={{fontWeight:'500',color:'green'}}>{product.pofferspan} % discount</p>}
                                <p style={{color : "green"}}>available</p>
                            </div>
                        </div>
                        </Link>):(
                        <Link key={product._id} to={`/product/${product._id}`} target="_blank" className="product-outer">
                        <div key={product._id} id="outer" >
                             <div className="left">
                             <img src={product.pImageDetails[0].imageUrl} alt=""/>
                             </div>
                             <div id="home-right">
                                 <h4>{product.plabel}</h4>
                                
                                 {product.pofferspan && <p style={{fontWeight:'500',color:'green'}}>{product.pofferspan} % discount</p>}
                                 <p style={{color : "green"}}>available</p>
                             </div>
                        </div>
                        </Link>
                        )
                
                    )) : (
                        <div ref={productsDiv} className="home-row products">
                       { searchProducts.map((product)=>(
                        <Link key={product._id} to={`/product/${product._id}`} target="_blank" className="product-outer">
                        <div key={product._id} id="outer" >
                             <div className="left">
                             <img src={product.pImageDetails[0].imageUrl} alt=""/>
                             </div>
                             <div id="home-right">
                                 <h4>{product.plabel}</h4>
                                
                                 {product.pofferspan && <p style={{fontWeight:'500',color:'green'}}>{product.pofferspan} % discount</p>}
                                 <p style={{color : "green"}}>available</p>
                             </div>
                        </div>
                        </Link>
                       ))
                        
                    }
                    </div>
                    )
                }
            </div>
             
        </div>
    )
}

export default Home
