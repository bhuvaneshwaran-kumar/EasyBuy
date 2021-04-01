import React,{useRef,useCallback,useEffect} from 'react'
import { useState } from 'react'
import './styles/Home.css'
import { useHistory,Link } from 'react-router-dom';



function Home() {

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
    const [loader,setLoader] = useState(false)

    
    const openNewTab = async(id)=>{
        // console.log("open New tab ..... :-)"+id)
        // localStorage.setItem("productID",id)

        window.open(`http://localhost:3000/product/id:${id}`, "_blank") //to open new page

    }



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

        // Fetch product from server when ever the State Skip change the value.
        useEffect(()=>{
            setLoader(true)  
            const productDetials = async ()=>{
                const response = await fetch('http://localhost:8080/product/home/?'+ new URLSearchParams({
                    skip : skip 
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
            productDetials()
          },[skip])

          console.log(products)
    return (
        <div ref={top} className="home-container">
             <div className="home-row home-top-nav">
                 <div onClick={()=>scrollTo(productsDiv)} className="btn top-nav-list ">
                 <img src="https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100" alt=""/>
                 <li>Mobiles</li>
                 </div>
             </div>  
             <div className="home-row slider">
                 
             </div> 
             <div ref={productsDiv} className="home-row products">
                {
                    products.map((product,index)=>(
                        (index === products.length-1) ? (
                        <div className="product-outer" ref={lastPostRefCallback} key={product._id}
                        onClick = {()=>openNewTab(product._id)}
                        >
                            <div className="left">
                            <img src={product.pImageDetails[0].imageUrl} alt=""/>
                            </div>
                            <div className="right">
                                <h4>{product.plabel}</h4>
                                <p>10 % Offer</p>
                                <p style={{color : "green"}}>available</p>
                            </div>
                        </div>):(
                        <Link to={`/product/${product._id}`} target="_blank" className="product-outer">
                        <div key={product._id}  
                        // onClick = {()=>openNewTab(product._id)}
                        >
                             <div className="left">
                             <img src={product.pImageDetails[0].imageUrl} alt=""/>
                             </div>
                             <div className="right">
                                 <h4>{product.plabel}</h4>
                                
                                 <p>10 % Offer</p>
                                 <p style={{color : "green"}}>available</p>
                             </div>
                        </div>
                        </Link>
                        )
                
                    ))
                }
            </div>
             <button onClick={
                 ()=>scrollTo(top)
             } className="btn"> top </button>
        </div>
    )
}

export default Home
