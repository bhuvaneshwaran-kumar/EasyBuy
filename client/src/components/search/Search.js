import React, { useRef, useState } from 'react'
import './Search.css'
import SearchIcon from '@material-ui/icons/Search'
import {useHistory} from 'react-router-dom'
import BASE_URL from '../../utils/BASE_URL'
function Search() {
    const form = useRef()
    const [productLabel,setProductLabel] = useState(null)
    const history = useHistory()

    const formSubmit = (e)=>{
        e.preventDefault()
        history.push(`/search/${form.current.search.value}`)
        form.current.search.value = ""
        

    }

    const checkLabelExist = async(e)=>{
       if(!productLabel){
        const result = await fetch(`${BASE_URL}/product/searchproduct`,{
            mode:"cors",
            method : "post",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
        })
        const labels = await result.json()
        setProductLabel(labels.labelName)
       }
        
    }


    return (
        <div className="Search-div">
            <form autoComplete="off" ref={form} onSubmit={formSubmit}>
                <input type="text" className="input-2" name="search" list="search" style={{ borderTopRightRadius: '0px'}} onChange={checkLabelExist} required/>
                <datalist id="search">
                    {
                        productLabel && (
                            productLabel.map((productName)=><option value={productName}>Alpha</option>)
                        )
                    }
                </datalist>
               
                <button type="submit"><SearchIcon/></button>
               
            </form>
        </div>
    )
}

export default Search
