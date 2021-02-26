import React,{useState,useRef} from 'react'
import './AddProduct.css'
import {Delete} from '@material-ui/icons'
function AddProduct() {
    const [selectedImage, setSelectedImage] = useState([])
    const [error,setError] = useState(false)
    const [message,setMessage] = useState('')
    const form = useRef()    
    
    const submitFrom = async (e)=>{
        e.preventDefault()
        if(selectedImage.length === 0){
            setError(true)
            setMessage('Image fiels is required')
            return
        }
        else{
            const data = {
                pName : form.current.pName.value,
                pDescription : form.current.pDescription.value,
                pImageDetials : [...selectedImage]
            }
            console.log(data)
            const responce = await fetch(`http://localhost:8080/product/add`,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },    
                method : "POST",
                credentials : "include",
                body : JSON.stringify(data)
            })
            console.log("from -> uploadin images..",await responce.json())
        }
    }

    const handleImageSelect = (e) => {
        setError(false)
        setMessage('')
        if(e.target.files){
            const fileArray = Array.from(e.target.files).map((file) => {
                        
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
        <div className="addproduct">
            
            <form ref={form} onSubmit={submitFrom} >

                <div className="row form-group">
                    <label htmlFor="ProductC">
                        Select Category  
                    </label>
                    <select className="input-2" name="catagory" id="">
                            <option value="electronic gadjets"></option>
                    </select>
                </div>



                <div className="row row-image form-group">
                    <label  className="input-2 label"  htmlFor="image">Select Image</label>
                    <input type="file" 
                    id="image"
                    placeholder="Product Description" 
                    name="productDetials"
                    className="input-2"
                    required multiple accept="image/*"
                    onChange={handleImageSelect}
                    // value={selectedImage}
                    />   
                    <label  className="input-2 label">{selectedImage.length} is Selected</label>     
                </div>

                <div className="ap-row form-group">
                    {
                        selectedImage.map((elm,id)=>(
                            <div key={id} className="product-img">
                            <img className="image"src={elm.data}/>
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

                <div className="row">
                  <button type="submit" className="btn btn-blue">
                   Add-Product
                  </button>
                </div>
                            
                <div className="row form-group">
                <span className={!error?"message":"red"}>{message}</span>
                </div>

            </form>
                    
        </div>
    )
}

export default AddProduct
