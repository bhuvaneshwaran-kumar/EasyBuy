import React from 'react'
import {useUserValue} from '../../contexts/UserProvider'
import './styles/ManageAddress.css'
import {useRef,useState} from 'react'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
function ManageAddress() {
    const [user,dispatch] = useUserValue()
    const [address,setAddress] = useState(()=>user.address?user.address:[])
    const [NewAddress,setNewAddressStatus] = useState(false)

    const form = useRef(null)

    const submmitForm = async (e)=>{
        e.preventDefault()
        const {uName,uMobNum,uPinNum,uLocality,uAddress,uRegional,uAlMobNum,uState,uLandmark,uAddType} = form.current

        const data = {
        "uName":uName.value,
        "uMobNum":uMobNum.value,
        "uPinNum":uPinNum.value,
        "uLocality":uLocality.value,
        "uAddress":uAddress.value,
        "uRegional":uRegional.value,
        "uAlMobNum":uAlMobNum.value,
        "uState":uState.value,
        "uLandmark":uLandmark.value,
        "uAddType":uAddType.value
        }

        const result = await fetch("http://localhost:8080/user/addaddress",{
            method:"post",
            credentials : 'include',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
            body : JSON.stringify(data)  
        })

        if(result.status === 200){
            const data = await result.json() 
            dispatch({
                type:"UPDATE_USER_ADDRESS",
                payload:data.uAddress
            })
            setAddress(user.address)
        }
       
       setNewAddressStatus(false)
    }

    const deleteAddress = async (id)=>{
        
        const result = await fetch("http://localhost:8080/user/deleteaddress",{
            method:"post",
            credentials : 'include',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
            body : JSON.stringify({id:id})  
        })
        if(result.status === 200){
            await dispatch({
                type:"DELETE_USER_ADDRESS",
                payload: id
            })
            setAddress(user.address)
        }
    }
    

    return (

 
        <div className="m-inf-main">
            <div className="m-inf-cont">
                <p>Manage Address</p>
            </div>

            <div className="addNew-address" onClick={()=>setNewAddressStatus(true)}>
                <p>{ !NewAddress && <span id="add">+</span>} ADD A NEW ADDRESS</p>
    {  NewAddress &&    
        <form onSubmit={submmitForm} ref={form}>
        <div id="addAdd-row">
            <div className="m-inf-cont" id="addAdd-col">
                <label>User Name (Optional) :</label>
                <input type="text" className="input-2" name="uName"/> 
            </div>
            <div className="m-inf-cont" id="addAdd-col">
                <label>10-digit mobile number :</label>
                <input type="text" required className="input-2" name="uMobNum"/> 
            </div>

        </div>
        <div id="addAdd-row">
            <div className="m-inf-cont" id="addAdd-col">
                <label>Pincode :</label>
                <input type="text" required className="input-2" name="uPinNum"/> 
            </div>
            <div className="m-inf-cont" id="addAdd-col">
                <label>Locality :</label>
                <input type="text" required className="input-2" name="uLocality"/> 
            </div>

        </div>
        <div id="addAdd-row">
           
            <div className="m-inf-cont" id="textarea">
                <textarea required className="input-2" name="uAddress" id="" cols="100" rows="06" placeholder="Address(Area and street)"></textarea>
            </div>

        </div>
        <div id="addAdd-row">
            <div className="m-inf-cont" id="addAdd-col">
                <label>City/District/Town :</label>
                <input required type="text" className="input-2" name="uRegional"/> 
            </div>
            <div className="m-inf-cont" id="addAdd-col">
                <label>State :</label>
                <input type="text" required list="State" className="input-2" name="uState"/> 
                <datalist id="State">
                    <option value="Tamilnadu">Tamilnadu</option>
                </datalist>
            </div>

        </div>
        <div id="addAdd-row">
            <div className="m-inf-cont" id="addAdd-col">
                <label>Landmark (Optional) :</label>
                <input type="text" className="input-2" name="uLandmark"/> 
            </div>
            <div className="m-inf-cont" id="addAdd-col">
                <label>Alternate Phone (Optional) :</label>
                <input type="text" list="State" className="input-2" name="uAlMobNum"/> 
            </div>
        </div>
        <div id="radio-btn">
            <label htmlFor="uAddType">Address Type :</label> <br/>
            <input value="Home" type="radio" id= "Home" name="uAddType" defaultChecked/> <label htmlFor="Home">Home</label>
            <input value="Office" type="radio" id= "Office" name="uAddType"/><label htmlFor="Office">Office</label>
        </div>
        <div id="addAdd-row">
            <button className="btn" id="address-btn">Update</button>
        </div>
    </form> 
    }   
            </div>
         
            {
               
                address.map((addres)=>(
                    addres.uAddType !== "Shop Address" ?
                <div className="user-address" key={addres._id}>
                    <pre><strong>
                        {addres.uAddType}
                        <br/><br/>
                        </strong></pre>
                    <pre>
                    {addres.uAddress}
                    </pre>
                    <DeleteSweepIcon id="Add-delete" onClick={()=>{deleteAddress(addres._id)}}/>
                </div> :
                <div className="user-address" key={addres._id}>
                <pre><strong>
                    {addres.uAddType}
                    <br/><br/>
                    </strong></pre>
                <pre>
                {addres.uAddress}
                </pre>
                
            </div>
            ))        
            }
        </div>


    )
}

export default ManageAddress
