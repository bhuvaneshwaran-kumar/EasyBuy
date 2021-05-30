import './Style/DisplayComment.css'
import React from 'react'

function DisplayComment({comments,setComments}) {
    return (
        <div id="DisplayComment">
            {
                comments.map((data,index)=>(
            <div id="individual-comment" key={index}>
                <h5>Buyer Querry :</h5>
                <p style={{color:'black',marginBottom:'2px'}}><span>{data.userName} :</span>{data.comment.Question}</p>
                <h5>Seller Answer :</h5>
                <p style={{color:'black',marginBottom:'2px'}}><span>{data.sellerName} :</span>{data.comment.Answer}</p>
            </div>
                ))
            }
            
        </div>
    )
}

export default DisplayComment
