import React,{useState,useRef} from 'react'
import './AddProduct.css'
import {Delete} from '@material-ui/icons'
import {useProductValue} from '../../contexts/ProductProvider'
function AddProduct() {
    const [selectedImage, setSelectedImage] = useState([])
    const [uploadStatus,setUploadStatus] = useState(false)
    const [loader,setLoader] = useState(false)
    const [error,setError] = useState(false)
    const [message,setMessage] = useState('')
    const form = useRef()    
    const [,pDispatch] = useProductValue()
    const submitFrom = async (e)=>{
        e.preventDefault()
        setLoader(true)
        if(selectedImage.length === 0){
            setLoader(false)

            setError(true)
            setMessage('Image field is required')
            
            return
        }
        else{
            setUploadStatus(true)
            setError(true)
            setMessage("Don't switch tab's or don't navigate to any other page's")

            console.log("form data",form.current)

            const {pcategory, pitem,
                   plabel, pbrand,
                   pmodelno, pwarrantyspan, 
                   pdescription, pstock,
                   pcost, 
                  } = form.current

            

            const data = {
                pcategory : pcategory.value ,
                pitem : pitem.value,
                plabel : plabel.value ,
                pbrand : pbrand.value ,
                pmodelno : pmodelno.value ,
                pwarrantyspan : pwarrantyspan.value ,
                pdescription : pdescription.value,
                pstock : pstock.value ,
                pcost : pcost.value ,
                pImageDetails : [...selectedImage]
            }
            console.log(data)
            
            const response = await fetch(`http://localhost:8080/product/add`,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },    
                method : "POST",
                credentials : "include",
                body : JSON.stringify(data)
            })
            // console.log("from -> uploadin images..",await response.json())
            let productData = await response.json()
            console.log("from -> uploadin images..",data)
            if(response.status === 200){
                setError(false)
                setLoader(false)
                setMessage('Your product is successfully updated in your product list ...')
                setUploadStatus(false)

                pDispatch({
                    type : 'PREPEND_PRODUCT',
                    payload : productData.product
                })
                // Clearing the form values.
                pcategory.value = ''
                pitem.value = ''
                plabel.value = ''
                pbrand.value = ''
                pmodelno.value = ''
                pwarrantyspan.value = '' 
                pdescription.value = '' 
                pstock.value = ''
                pcost.value = '' 
                setSelectedImage([]) 
                



            }
            
        }
    }

    const handleImageSelect = (e) => {
        setError(false)
        setMessage('')
        if(e.target.files){
            Array.from(e.target.files).forEach((file) => {            
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onloadend = () => (
                    setSelectedImage(prev => ([...prev,{
                        name: file.name,
                        data: reader.result
                        }])
                    )
                )
            }
        )
      } 
    }   
    
    const removeImage = (index)=>{
        console.log(index,'index is removed')
        const updatedImage = [...selectedImage]
        updatedImage.splice(index,1)
        setSelectedImage([...updatedImage])
    }

    // selectedImage.forEach((id,elm)=>console.log(id,'->',elm))

    // console.log(selectedImage[0])


    return (
        <div className={uploadStatus ? "addproduct reduce-opacity" : "addproduct"}>
            
            <form ref={form} onSubmit={submitFrom} >

                {/* Category pcategory */}
                <div className="row form-group">
                    <label htmlFor="ProductCat">
                        Select Category : 
                    </label>
                    <select className="input-2" name="pcategory" id="ProductCat">
                            <option value="Electronics">Electronics</option>
                    </select>
                </div>
                
                {/* Item pitem */}
                <div className="row form-group">
                    <label htmlFor="ProductItm">
                        Select Items : 
                    </label>
                    <select className="input-2" name="pitem" id="ProductItm">
                            <option value="Mobile">Mobile</option>
                            <option value="Keyboard and Mouse">Keyboard and Mouse</option>
                    </select>
                </div>
               
               {/* Label plabel */}
                <div className="row form-group">
                    <label htmlFor="label">
                        Label : 
                    </label>
                    <input type="text" className="input-2" name="plabel" placeholder="This will appear as main label"/>
                </div>
               
               {/* Brand pbrand */}
                <div className="row form-group">
                    <label htmlFor="label">
                        Brand : 
                    </label>
                    <input type="text" className="input-2" name="pbrand" placeholder="Brand"/>
                </div>
              
               {/* Model no pmodelno */}
                <div className="row form-group">
                    <label htmlFor="label">
                        Model No : 
                    </label>
                    <input type="text" name="pmodelno" className="input-2" placeholder="Model No"/>
                </div>

                {/* Warranty period pwarrantyspan */}
                <div className="row form-group">
                    <label htmlFor="label">
                        Warranty Period In Months : 
                    </label>
                    <input type="number" name="pwarrantyspan" className="input-2" placeholder="Warranty Period In Months"/>
                </div>

                {/* Description pdescription */}
                <div className="row form-group">
                    <label htmlFor="label">
                       Product Description
                    </label>
                    <textarea name="pdescription" id="" rows="3" className="input-2" placeholder="Product Description"></textarea>
                   
                </div>

                {/* no of items in stock pstock */}
                <div className="row form-group">
                    <label htmlFor="label">
                        No Of Items In Stock : 
                    </label>
                    <input type="number" name="pstock" className="input-2" placeholder="No Of Items In Stock"/>
                </div>

                {/* Cost/item pcost */}
                <div className="row form-group">
                    <label htmlFor="label">
                       Cost Per Iteam :
                    </label>
                    <input type="number" name="pcost" className="input-2" placeholder="Cost Per Iteam :"/>
                </div>


                <div className="row row-image form-group">
                    <label className="input-2 " id="label"  htmlFor="image">Select Image</label>
                    <input type="file" 
                    id="image"
                    placeholder="Product Description" 
                    name="productDetials"
                    className="input-2"
                    required multiple accept="image/*"
                    onChange={handleImageSelect}
                    // value={selectedImage}
                    />   
                    <label  className="input-2 " id="label">{selectedImage.length} is Selected</label>     
                </div>

                <div className="ap-row form-group">
                    {
                        selectedImage.map((elm,id)=>(
                            <div key={id} className="product-img">
                            <img className="image" src={elm.data} alt="selected"/>
                            <div className="middle">
                                <div className="text">
                                    {elm.name}
                                <span>
                                        <Delete
                                        onClick={()=>removeImage(id)}/>
                                </span>
                                </div>
                                
                            </div>
                        </div>
                        ))

                    }
                
                       

                    
                </div>

                <div className="row row-bottom">
                  <button type="submit" className="btn btn-blue">
                   Add-Product
                  </button>
                  {
                     loader && 
                        <div className=" row form-group ib-ml-03">
                        <div class="loader"></div>
                        </div>    
                  }
                  <div>
                    <span className={!error?"message":"red"}>{message}</span>
                  </div>
                </div>
                            
               

            </form>
            
        </div>
    )
}

export default AddProduct
