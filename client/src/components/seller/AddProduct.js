import React,{useState,useRef,useEffect} from 'react'
import './AddProduct.css'
import {Delete} from '@material-ui/icons'
import {useProductValue} from '../../contexts/ProductProvider'
import BASE_URL from '../../utils/BASE_URL'
function AddProduct() {
    let slides = useRef([])
    let slideIndex = 0;

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }
    function showSlides(n) {
        if (n > 2){
            n = 0
            slideIndex = 0 
        } 
        if(n < 0){
            n = 2
            slideIndex = 2 
        } 
        for(let i=0;i<3;i++){
            slides.current[i].style.display="none"
        }
        slides.current[n].style.display="block"
    }

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
            
            const response = await fetch(`${BASE_URL}/product/add`,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },    
                method : "POST",
                credentials : "include",
                body : JSON.stringify(data)
            })
            let productData = await response.json()
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
        const updatedImage = [...selectedImage]
        updatedImage.splice(index,1)
        setSelectedImage([...updatedImage])
    }



    useEffect(() => {
        for(let i=1;i<3;i++){
            slides.current[i].style.display="none"
        }
        let timer = setInterval(()=>{
            plusSlides(1);
        },4000)
        return ()=>clearInterval(timer)
    }, [])

    return (
        <div className="addproduct-outer">
         
            <div className="addproduct-left">
               {
                   [0,0,0].map((val,index)=>(
                       <img key={index} src={`/addproduct/0${index+1}.png`} alt=""
                       ref = {(ref)=>slides.current.push(ref)} />
                   ))
               }
               <ul>
                   <li>Perks of selling here :</li>
                   <li>Lowest cost of doing business.</li>
                   <li>Ease of doing business.</li>
                   <li>Highest growth rate.</li>
                   <li>Most approachable online marketplace.</li>
                   <li>With more than 10 crore registered customers .</li>
               </ul>
            </div>
            
         
            <div className={uploadStatus ? "addproduct reduce-opacity" : "addproduct"}>
            
            <form ref={form} onSubmit={submitFrom} >

                {/* Category pcategory */}
                <div className="row form-group">
                    <label htmlFor="ProductCat">
                        Select Category : 
                    </label>
                    <select className="input-2" name="pcategory" id="ProductCat">
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Grocery">Grocery</option>
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
                            <option value="Men T-shirts">Men T-shirts</option>
                            <option value="Detergent">Detergent</option>
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
                            <img className="" src={elm.data} alt="selected"/>
                            <div className="middle">
                                <div className="text">
                                    <p>{elm.name}</p>
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
        </div>
    )
}

export default AddProduct
