import React,{useRef, useState} from 'react'

function DisplayCommentsSeller({data,setComments,index}) {
    // console.log(data.comment.Answer)
    const form = useRef()
    const [comment,setComment] = useState(data)
    
    const submitForm = async(e)=>{
        e.preventDefault()
        const updateData = {
            commentId : data._id,
            Answer : form.current.Answer.value
        }
        // console.table(updateData)
        const response = await fetch(`http://localhost:8080/comment/update`,{
            mode:"cors",
            credentials : "include",
            method : "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body : JSON.stringify(updateData)        
        }) 
        const result = await response.json()
        if(response.status === 200)
            form.current.Answer.value = ''
        setComment(result.data)
    }

    return (
        <div style={{marginBottom:'4px',borderBottom :'2px solid rgb(226, 223, 223)',paddingBottom:'4px'}}>
            <h5>Buyer Querry :</h5>
            <p style={{color:'black',marginBottom:'2px'}}><span>{comment.userName} :</span>{comment.comment.Question}</p>
            <h5>Seller Answer :</h5>
            <p style={{color:'black',marginBottom:'2px'}}><span>{comment.sellerName} :</span>
            {
                comment.comment.Answer === null ? 
                <form ref={form} onSubmit={submitForm} style={{display:'inline-block',width:'250px',marginLeft:'10px'}} action="">
                <input required name='Answer' style={{display:'inline-block',width:'250px'}} type="text" placeholder="Enter your comment" className="input-2"/>
                <button type='submit' className="btn" style={{padding:'2px',backgroundColor : '#3f44e0',marginTop:'3px',float:'right'}}>Post</button>
                </form> : <p  style={{color:'black',display:'inline-block'}}> { comment.comment.Answer } </p>  
            
            }</p>
        </div>
    )
}

export default DisplayCommentsSeller
