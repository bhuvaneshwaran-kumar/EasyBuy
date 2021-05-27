import React, { useEffect,useState } from 'react'
import "./CompareList.css"
import CompareListRight from "./CompareListRight";
function CompareList() {
    const [compareList,setCompareList] = useState()
    const [category,setCategory] = useState()
    const [selectodId,setSelectodId] = useState()
    const [selectodName,setSelectodName] = useState()
    const [rightDisplay,setRightDisplay] = useState()
    
    const showRightSide = (id,name,tot_data)=>{
        console.log(id,name,tot_data)
        setSelectodId(id)
        setSelectodName(name)
        setRightDisplay(tot_data.filter(data=> name === data.category))
    }

    useEffect(()=>{
        const getUserCompareList = async()=>{
            let result = await fetch(`http://localhost:8080/comparelist/get-user-compare-list/`,{
                method:'get',
                credentials:'include'
            })
            if(result.status === 200){
                // console.log("Compare Exist")
                let data = await result.json()
                
                setCompareList(data?.product)
                setCategory([...data?.pitem])
                showRightSide(data?.pitem[0]._id,data?.pitem[0].name,data?.product)
                
            }else{
                console.log("Compare not Exist")
                // setCompare(false)
                setCompareList(undefined)

            }
        }
        getUserCompareList()
    },[])
    console.log("compareList",compareList)
    console.log(selectodName)
    console.log("right side",rightDisplay)

    const DeleteCompare = async(id)=>{
        console.log("clicking delete",id)
        const result = await fetch('http://localhost:8080/comparelist/alter-user-compare-list',{
                    method:"get",
                    credentials:"include"
        })
        if(result.status === 200){
            console.log("noooooo")

            setCompareList(undefined)
            setRightDisplay(undefined)
            setCategory(undefined)
        }else{
            console.log("noooooo")
        }
    }

    return (
        <div className="CompareList-outer">
            <div className="CompareList-left">
           {category &&
               category.map((data)=>(
                <li className={selectodId == data._id ?"active":""} onClick={()=>showRightSide(data._id,data.name,compareList)}>{data.name}</li>
               ) 
               )
           }
           {category && <li onClick={()=>DeleteCompare()}>Delete Compare</li>}
            </div>
            <div className="CompareList-right">
                {
                    rightDisplay &&
                    rightDisplay.map((data)=>(

                        <CompareListRight key={data._id} data={data}/>



                    ))
                }
            </div>
        </div>
    )
}
export default CompareList
