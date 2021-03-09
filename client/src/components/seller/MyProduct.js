import React,{useCallback, useRef, useState, useEffect} from 'react'
import './MyProduct.css'

import {useProductValue} from '../../contexts/ProductProvider'
import {useUserValue} from '../../contexts/UserProvider'
import { Edit, CheckCircleOutline} from '@material-ui/icons'

function MyProduct(){
    
    const [products,pDispatch] = useProductValue()
    const [user,uDispatch] = useUserValue()
    const [skip,setSkip] = useState(products.length)
    const [loader,setLoader] = useState(true)
    const [hasMore,setHasMore] = useState(false)
    const observer = useRef(null)
    const [edit,setEdit] = useState(false)
    const input = useRef()
   

    const turnOnAndOffEdit = (index,status)=> {
      console.log("hii",index)
      pDispatch({
        type : "POST_EDIT_STATUS",
        payload : {
          index : index,
          status : status
        }
      })
    }

    const updateProduct = async (index,flagOneProductBug = false)=>{
      console.log("hiii-submit",products[index])
      const response = await fetch('http://localhost:8080/product/update',{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method : "POST",
        credentials : "include",
        body : JSON.stringify(products[index])
      })
      if(response.status === 200){
        turnOnAndOffEdit(index,false)
        setDisableUserInput(index,flagOneProductBug,true)        
      }

    } 

    // console.log(editProdutsState)

    // Handels Adding Observer To The Last Product Element 
    const lastPostRefCallback = useCallback(node => {
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
    
    // Fetch product from server when ever the State Skip change the value.
    useEffect(async ()=>{
      setLoader(true)  
      if(user.isSeller){            
            const response = await fetch('http://localhost:8080/product/?'+ new URLSearchParams({
              skip : skip 
            }),{
              credentials : "include"
            })      
            const data = await response.json()
            setHasMore(data.hasMore)

            pDispatch({
              type : "UPDATE_PRODUCT",
              payload : [...data.product]
            })
      }
      setLoader(false)
    },[skip])
    
    // Handels Edit post. 
    const setDisableUserInput = (index,flagOneProductBug = false,turnOff = false)=>{
      
      if(turnOff) {
        if(flagOneProductBug){
          input.current.plabel.setAttribute("disabled",'')
          input.current.pdescription.setAttribute("disabled",'')
          input.current.pstock.setAttribute("disabled",'')
          input.current.pcost.setAttribute("disabled",'')
          input.current.pwarrantyspan.setAttribute("disabled",'')
          return
        }else{
          input.current.plabel[index].setAttribute("disabled",'')
          input.current.pdescription[index].setAttribute("disabled",'')
          input.current.pstock[index].setAttribute("disabled",'')
          input.current.pcost[index].setAttribute("disabled",'')
          input.current.pwarrantyspan[index].setAttribute("disabled",'')
          return 
        }
      }
      

      if(flagOneProductBug){
        input.current.plabel.removeAttribute("disabled")
        input.current.pdescription.removeAttribute("disabled")
        input.current.pstock.removeAttribute("disabled")
        input.current.pcost.removeAttribute("disabled")
        input.current.pwarrantyspan.removeAttribute("disabled")
       
        return
      }else{

        input.current.plabel[index].removeAttribute("disabled")
        input.current.pdescription[index].removeAttribute("disabled")
        input.current.pstock[index].removeAttribute("disabled")
        input.current.pcost[index].removeAttribute("disabled")
        input.current.pwarrantyspan[index].removeAttribute("disabled")
      }

      // input.current.setAttribute("disabled", "");
    }

    // Handles Edit post.
    const handleProductValueChange = (index,name,value)=>{
      pDispatch({
        type : "UPDATE_ELEMENT",
        payload : {
          index : index,
          name : name,
          value : value
        }
      }) 
    }

    

    return(
        <div className="my-product">
            <form ref={input} action="">
            {
              products.map((product,index)=>(
                (index === products.length-1) ? (
                // Last product of my product to add observer. 
                <div className="prodact" key={index} ref={lastPostRefCallback}>
                  {/* Left Side of My-product */}

                  {/* Image of the Product  */}
                  <div className="left">
                    <img src={product.pImageDetails[0].imageUrl} alt=""/>
                  </div>
                
                  {/* Right Side of My-product */}
                
                  <div className="right">
                      {/* FOR LABEL */}
                      <div className="row form-group">
                        <label htmlFor="label">
                          Label : 
                        </label>
                        <input type="text" className="input-2" name="plabel" value={product.plabel} disabled
                        onChange={(e,i = index)=>{
                          handleProductValueChange(i,'plabel',e.target.value)
                          }                        
                        }
                        />
                      </div>
                      
                      {/* FOR DESCRIPTION */}
                      <div className="row form-group">
                        <label htmlFor="label">Product Description </label>
                        <textarea name="pdescription" id="" rows="5" className="input-2" value={product.pdescription} disabled  onChange={(e,i = index)=>{
                        handleProductValueChange(i,'pdescription',e.target.value)
                        }                        
                        }></textarea>
                      </div>
                      
                      {/* no of items in stock pstock */}
                      <div className="row form-group">
                          <label htmlFor="label">
                              No Of Items In Stock : 
                          </label>
                          <input type="number" name="pstock" className="input-2" value={product.pstock} disabled  onChange={(e,i = index)=>{
                        handleProductValueChange(i,'pstock',e.target.value)
                        }                        
                        }/>
                      </div>

                      {/* Cost/item pcost */}
                      <div className="row form-group">
                          <label htmlFor="label">
                             Cost Per Iteam :
                          </label>
                          <input type="number" name="pcost" className="input-2"  value={product.pcost} disabled  onChange={(e,i = index)=>{
                        handleProductValueChange(i,'pcost',e.target.value)
                        }                        
                        }/>
                      </div>

                      {/*  Warranty Period In pwarrantyspan */}
                      <div className="row form-group">
                          <label htmlFor="label">
                              Warranty Period In Months : 
                          </label>
                          <input type="number" name="pwarrantyspan" className="input-2"  value={product.pwarrantyspan} disabled  onChange={(e,i = index)=>{
                        handleProductValueChange(i,'pwarrantyspan',e.target.value)
                        }                        
                        }/>
                      </div>

                      {/*  Edit button */}
                      <div className="row bottom btn">

                     { product.EditStatus ?
                     
                     <div className="submit" onClick={()=>{ (products.length === 1) ? updateProduct(index,true) : updateProduct(index,false)}}>
                       <CheckCircleOutline className="check-circle"/>
                       <h3>Submit</h3>
                     </div>
                     :
                        <div className="edit" onClick={()=>{
                        (products.length === 1)? setDisableUserInput(index,true,false):
                          setDisableUserInput(index,false,false)
                          turnOnAndOffEdit(index,true)
                        }
                        }>
                        <Edit className="edit-icon"/>
                        <h3>Edit</h3>
                        </div>
                    }
                       
                      </div>
                   
                    </div>
                
                </div>
                
                ):

                <div className="prodact" key={index}>
                    {/* Left Side of My-product */}
                    {/* Image of the Product  */}
                    
                    <div className="left">
                      <img src={product.pImageDetails[0].imageUrl} alt=""/>
                    </div>
                    
                    {/* Right Side of My-product */}
                    <div className="right">
                      {/* FOR LABEL */}
                      <div className="row form-group">
                        <label htmlFor="label">
                          Label : 
                        </label>
                        <input type="text" className="input-2" name="plabel" value={product.plabel} disabled
                        onChange={(e,i = index)=>{
                          handleProductValueChange(i,'plabel',e.target.value)
                          }                        
                        }
                        />
                      </div>
                      
                      {/* FOR DESCRIPTION */}
                      <div className="row form-group">
                        <label htmlFor="label">Product Description </label>
                        <textarea name="pdescription" id="" rows="5" className="input-2" value={product.pdescription} disabled  onChange={(e,i = index)=>{
                        handleProductValueChange(i,'pdescription',e.target.value)
                        }                        
                        }></textarea>
                      </div>
                      
                      {/* no of items in stock pstock */}
                      <div className="row form-group">
                          <label htmlFor="label">
                              No Of Items In Stock : 
                          </label>
                          <input type="number" name="pstock" className="input-2" value={product.pstock} disabled  onChange={(e,i = index)=>{
                        handleProductValueChange(i,'pstock',e.target.value)
                        }                        
                        }/>
                      </div>

                      {/* Cost/item pcost */}
                      <div className="row form-group">
                          <label htmlFor="label">
                             Cost Per Iteam :
                          </label>
                          <input type="number" name="pcost" className="input-2"  value={product.pcost} disabled  onChange={(e,i = index)=>{
                        handleProductValueChange(i,'pcost',e.target.value)
                        }                        
                        }/>
                      </div>

                      {/*  Warranty Period In pwarrantyspan */}
                      <div className="row form-group">
                          <label htmlFor="label">
                              Warranty Period In Months : 
                          </label>
                          <input type="number" name="pwarrantyspan" className="input-2"  value={product.pwarrantyspan} disabled  onChange={(e,i = index)=>{
                        handleProductValueChange(i,'pwarrantyspan',e.target.value)
                        }                        
                        }/>
                      </div>

                      {/* Edit Button */}
                      <div className="row bottom btn">
                        
                        {
                          product.EditStatus  ?
                     
                        <div className="submit" onClick={()=>{updateProduct(index)}}>
                          <CheckCircleOutline className="check-circle"/>
                          <h3>Submit</h3>
                        </div>
                        :
                        <div className="edit" onClick={()=>{
                         
                        turnOnAndOffEdit(index,true)
                        setDisableUserInput(index)
                        }
                          }>
                        <Edit className="edit-icon"/>
                        <h3>Edit</h3>
                        </div> 
                         
                        }
                      </div>
                   
                    </div>
                
                </div>
              ))
            }
            {/* For Loader */}
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

