import React,{useCallback, useRef, useState, useEffect} from 'react'
import './MyProduct.css'

import {useProductValue} from '../../contexts/ProductProvider'
import {useUserValue} from '../../contexts/UserProvider'
import { Edit, CheckCircleOutline} from '@material-ui/icons'
import {Link} from 'react-router-dom'

function MyProduct(){
    
    const [products,pDispatch] = useProductValue()
    const [user] = useUserValue()
    const [skip,setSkip] = useState(products.length)
    const [loader,setLoader] = useState(true)
    const [hasMore,setHasMore] = useState(false)
    const observer = useRef(null)
    // const [edit,setEdit] = useState(false)
    const input = useRef()
   const slide = useRef()

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
    useEffect(()=>{
      setLoader(true)
      const getUserPost = async ()=>{  
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
    }
      getUserPost()
      setLoader(false)
    },[skip,pDispatch,user.isSeller])
    
    // Handels Edit post. 
    const setDisableUserInput = (index,flagOneProductBug = false,turnOff = false)=>{
      
      if(turnOff) {
        if(flagOneProductBug){
          input.current.plabel.setAttribute("disabled",'')
          input.current.pdescription.setAttribute("disabled",'')
          input.current.pstock.setAttribute("disabled",'')
          input.current.pcost.setAttribute("disabled",'')
          input.current.pwarrantyspan.setAttribute("disabled",'')
          input.current.pofferspan.setAttribute("disabled",'')
          return
        }else{
          input.current.plabel[index].setAttribute("disabled",'')
          input.current.pdescription[index].setAttribute("disabled",'')
          input.current.pstock[index].setAttribute("disabled",'')
          input.current.pcost[index].setAttribute("disabled",'')
          input.current.pwarrantyspan[index].setAttribute("disabled",'')
          input.current.pofferspan[index].setAttribute("disabled",'')
          return 
        }
      }
      

      if(flagOneProductBug){
        input.current.plabel.removeAttribute("disabled")
        input.current.pdescription.removeAttribute("disabled")
        input.current.pstock.removeAttribute("disabled")
        input.current.pcost.removeAttribute("disabled")
        input.current.pwarrantyspan.removeAttribute("disabled")
        input.current.pofferspan.removeAttribute("disabled")
       
        return
      }else{

        input.current.plabel[index].removeAttribute("disabled")
        input.current.pdescription[index].removeAttribute("disabled")
        input.current.pstock[index].removeAttribute("disabled")
        input.current.pcost[index].removeAttribute("disabled")
        input.current.pwarrantyspan[index].removeAttribute("disabled")
        input.current.pofferspan[index].removeAttribute("disabled")
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

    useEffect(()=>{
      let num = 1
      const timer = setInterval(()=>{
        if(num === 4)
          num = 1
        slide.current.src = `/addproduct/0${num}.png`
        num+=1
      },3000)
      return ()=> clearInterval(timer) 
    })

    return(
        <div className="my-product">
            <div className="my-product-left">
                       <img src={`/addproduct/0${1}.png`} alt=""
                       ref = {slide}/>
               <ul>
                   <li>Perks of selling here :</li>
                   <li>Lowest cost of doing business.</li>
                   <li>Ease of doing business.</li>
                   <li>Highest growth rate.</li>
                   <li>Most approachable online marketplace.</li>
                   <li>With more than 10 crore registered customers .</li>
               </ul>
            </div>
 

            <div className="my-product-right">
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

                      {/*  special offer Period In pwarrantyspan */}
                      <div className="row form-group">
                          <label htmlFor="label">
                              Offer in percentage : 
                          </label>
                          <input type="number" name="pofferspan" value={product.pofferspan} className="input-2"  disabled  onChange={(e,i = index)=>{
                        handleProductValueChange(i,'pofferspan',e.target.value)
                        }                        
                        }/>
                        
                      </div>
                      
                      <Link to={`/product/${product._id}`} target="_blank" className="product-outer">
                       <p className="btn"> click here to respose to your querry </p>
                      </Link>
                      
                      
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

                      {/*  special offer Period In pwarrantyspan */}
                      <div className="row form-group">
                          <label htmlFor="label">
                              Offer in percentage : 
                          </label>
                          <input type="number" name="pofferspan" className="input-2"  value={product.pofferspan}  disabled  onChange={(e,i = index)=>{
                        handleProductValueChange(i,'pofferspan',e.target.value)
                        }                        
                        }/>
                      </div>

                      <Link to={`/product/${product._id}`} target="_blank" className="product-outer">
                       <p className="btn"> click here to respose to your querry </p>
                      </Link>

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
       
       
       
        </div>
    )




}
export default MyProduct

