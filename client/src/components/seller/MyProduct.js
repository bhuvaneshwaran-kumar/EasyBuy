import React,{useCallback, useRef, useState, useEffect} from 'react'
import './MyProduct.css'

import {useProductValue} from '../../contexts/ProductProvider'
import {useUserValue} from '../../contexts/UserProvider'

function MyProduct(){
    const [products,pDispatch] = useProductValue()
    const [user,uDispatch] = useUserValue()
    const [skip,setSkip] = useState(products.length)
    const [loader,setLoader] = useState(true)
    const [hasMore,setHasMore] = useState(false)
    const observer = useRef(null)


    const lastPostRefCallback = useCallback(node => {
      console.log("hii",node)
      if (loader) return
      if (observer.current)
          observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && hasMore) {
              console.log(node.textContent, 'is Intersecting', products.length)
              setSkip(products.length)
          }
      })
      if (node)
          observer.current.observe(node)
  }, [loader,hasMore,products.length])   
    
    
    useEffect(async ()=>{
      setLoader(true)  
      if(user.isSeller){

            
              const response = await fetch('http://localhost:8080/product/?'+ new URLSearchParams({
              skip : skip 
            }),{
              credentials : "include"
            })
      
            const data = await response.json()
            console.log(data)
            setHasMore(data.hasMore)

            pDispatch({
              type : "UPDATE_PRODUCT",
              payload : data.product
            })
      
           
      
          }
      setLoader(false)
    },[skip])


    return(
        <div className="my-product">
            {
              products.map((product,index)=>(
                (index === products.length-1) ? (
                  <div className="prodact" key={index} ref={lastPostRefCallback}>
                  <div className="left">
                    <img src={product.pImageDetails[0].imageUrl} alt=""/>
                  </div>
                  <div className="right">
                    <h3>{product.plabel}</h3>
                  </div>
              </div>
                ):
                <div className="prodact" key={index}>
                    <div className="left">
                      <img src={product.pImageDetails[0].imageUrl} alt=""/>
                    </div>
                    <div className="right">
                      <h3>{product.plabel}</h3>
                      <small>
                        {product.pdescription}
                      </small>
                    </div>
                </div>
              ))
            }
            {loader && 
              <div className="spinner">
                  <div className="loader"></div>
              </div>
            }
        </div>
    )




}
export default MyProduct

