import Reactm,{useRef, useState,useEffect} from 'react'
import './Style/Comment.css'
import {useUserValue} from '../../contexts/UserProvider'
import DisplayComment from './DisplayComment.js'
import DisplayCommentsSeller from './DisplayCommentsSeller.js'
import Rodal from 'rodal'
import '../../../node_modules/rodal/lib/rodal.css';


function Comment({product}) {
    const [show,setShow] = useState(false)
    // const [hide,setHide] = useState(true)


    const form = useRef()
    const [user] = useUserValue()
    const [comments,setComments] = useState([])
    const [showComments,setShowComments] = useState(false)
    let [canUpdate,setCanUpdate] = useState(null)
    // console.log(product.sellerId,user._id)

    const changeShowCommentState = ()=>{
        setShowComments((prev)=>!prev)
    }

    const formSubmmit = async (e)=>{
        e.preventDefault()
        const {_id,sellerId} = product;

        const data = {
            productId : _id,
            userId : user._id,
            userName : user.name,
            sellerId : sellerId,
            sellerName : '',
            comment : {
            Question : form.current.querry.value,
            Answer : null  
            },
            timestamp : Date.now()
        }

        const result = await fetch("http://localhost:8080/comment/addcomment/",{
            credentials : "include",
            mode:"cors",
            method : "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body : JSON.stringify(data)
        })

        // console.log(await result.json())
        if(result.status === 200){
            form.current.querry.value = ''
            setCanUpdate((prev)=>prev+1)
    }

    }

    useEffect((id = product._id) => {
        // console.log(id)
        const getComments = async (id)=>{
            const result = await fetch('http://localhost:8080/comment/getcomments/?'+ new URLSearchParams({
                id : id 
              }),{
                credentials : "include"
              })
            const data = await result.json()
            // console.log(data)
            setComments(data.data)
        }
        getComments(id)
    }, [showComments,canUpdate])
    // console.log(comments)
    return (
        <div id="comment-outer">
            {
                product.sellerId !== user._id &&
                <form onSubmit={formSubmmit} ref={form}>
                    <input type="text" className="input-2"
                    placeholder="Feel Free To Add Your Query. " name="querry" required/>
                    <button type="submit" style={{marginTop:'5px'}} className="btn">Post Your Comments</button>
                </form>
            }
            
            <button id="show-comment" className='btn' style={{marginTop : '10px',backgroundColor:'#3f44e0'}}onClick={()=>{changeShowCommentState();}}>{showComments && comments.length != 0 ? 'Hide' : 'Show'} Queries : {comments.length}</button>
            
            <div >
                {
                    product.sellerId !== user._id ?
                    showComments && comments.length != 0 && (
                        <DisplayComment 
                        setComments = {setComments}
                        comments = {comments}
                        />
                    
                    ) : showComments && comments.length != 0 && (
                        <div id="DisplayComment">
                        {comments.map((data,index)=>(
                            
                                <DisplayCommentsSeller key={index} data={data} index={index} setComments = {setComments}/>
                   
                        ))}
                        </div>
                    )
                }

                
            </div>
            <button onClick={()=>{
                    setShow((prev)=>!prev)
                }}>open</button>

                <Rodal visible={show} showCloseButton={false} onClose={()=>{setShow((prev)=>!prev)}}>
                    <div>Content
                        <span onClick={()=>{setShow((prev)=>!prev)}}>X</span>
                    </div>
                </Rodal>

        </div>
    )
}

export default Comment
/*
<button onClick={()=>{
                    setShow((prev)=>!prev)
                }}>open</button>

                <Rodal visible={show} showCloseButton={false} onClose={()=>{setShow((prev)=>!prev)}}>
                    <div>Content
                        <span onClick={()=>{setShow((prev)=>!prev)}}>X</span>
                    </div>
                </Rodal>
 */