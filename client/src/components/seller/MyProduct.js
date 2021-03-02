import React,{useCallback, useRef, useState, useEffect} from 'react'
import './MyProduct.css'

import {useProductValue} from '../../contexts/ProductProvider'
import {useUserValue} from '../../contexts/UserProvider'
import { Edit } from '@material-ui/icons'

function MyProduct(){
    const [products,pDispatch] = useProductValue()
    const [user,uDispatch] = useUserValue()
    const [skip,setSkip] = useState(products.length)
    const [loader,setLoader] = useState(true)
    const [hasMore,setHasMore] = useState(false)
    const observer = useRef(null)
    const [edit,setEdit] = useState(false)
    const input = useRef()

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
            console.log("->product : ",products)
            setHasMore(data.hasMore)

            pDispatch({
              type : "UPDATE_PRODUCT",
              payload : [...data.product]
            })
      
           
      
          }
      setLoader(false)
    },[skip])

    const editProduct = (index)=>{
      input.current.plabel[index].removeAttribute("disabled")
      // input.current.setAttribute("disabled", "");
    }

    return(
        <div className="my-product">
            <form ref={input} action="">
            {
              products.map((product,index)=>(
                (index === products.length-1) ? (
                  <div className="prodact" key={index} ref={lastPostRefCallback}>
                  <div className="left">
                    <img src={product.pImageDetails[0].imageUrl} alt=""/>
                  </div>
                  <div className="right">
                  <div className="row">
                        <input name="plabel" style={{width : "100%"}} type="text" 
                        onChange={
                          (e,i = index)=>{
                              pDispatch({
                                type : "UPDATE_ELEMENT",
                                payload : {
                                  index : i,
                                  name : 'plabel',
                                  value : e.target.value
                                }
                              })                  
                          }
                        }
                        className="input-2" 
                        value={product.plabel} disabled/>
                      </div>
                      <div className="row">
                      <textarea rows="5" name="pdescription" style={{width : "100%"}} type="text" className="input-2" value={product.pdescription} disabled/>
                      </div>
                      <div className="row">
                      <p>
                       <strong>Warranty Span :</strong> {product.pwarrantyspan}
                      </p>
                      </div>
                      <div className="row">
                      <p style={{color :(product.pstock <= 0)?"red":"blue"}}>
                       {
                         (product.pstock <= 0) ? "Out of Stock" : "only few left  hurry up"
                       }
                      </p>
                      </div>
                      <div className="row bottom btn">
                        <div className="edit" onClick={()=>{editProduct(index)}}>
                        <Edit className="edit-icon"/>
                        <h3>Edit</h3>
                        </div>
                       
                      </div>
                   
                  </div>
              </div>
                ):
                <div className="prodact" key={index}>
                    <div className="left">
                      <img src={product.pImageDetails[0].imageUrl} alt=""/>
                    </div>
                    <div className="right">
                      <div className="row">
                        <input name="plabel" style={{width : "100%"}} type="text" className="input-2" value={product.plabel} disabled/>
                      </div>
                      <div className="row">
                      <textarea rows="5" name="pdescription" style={{width : "100%"}} type="text" className="input-2" value={product.pdescription} disabled/>
                      </div>
                      <div className="row">
                      <p>
                       <strong>Warranty Span :</strong> {product.pwarrantyspan}
                      </p>
                      </div>
                      <div className="row">
                      <p style={{color :(product.pstock <= 0)?"red":"blue"}}>
                       {
                         (product.pstock <= 0) ? "Out of Stock" : "only few left  hurry up"
                       }
                      </p>
                      </div>
                      <div className="row bottom btn">
                        <div className="edit" onClick={()=>{editProduct(index)}}>
                        <Edit className="edit-icon"/>
                        <h3>Edit</h3>
                        </div>
                       
                      </div>
                   
                    </div>
                </div>
              ))
            }
            {loader && 
              <div className="spinner">
                  <div className="loader"></div>
              </div>
            }
            </form>
        </div>
    )




}
export default MyProduct

