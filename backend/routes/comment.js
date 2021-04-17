const Router = require('express').Router()
const Comment = require("../model/Comment")
const User = require("../model/User")

Router.get("/getcomments",async (req,res)=>{
    // console.log(req.query.id)
    const productId = req.query.id
    try{
        const data = await Comment.find({productId})
        // console.log(data)
        res.statusCode = 200
        res.json({  
            message : 'Success.',
            data : data            
        })
    }catch(e){
        console.log("no comments")
    }
   
})

Router.post("/addcomment",async(req,res)=>{
    const request = req.body;
    try{
        const seller = await User.findById(request.sellerId)
        // console.log(seller)
        request.sellerName = await seller.User.name;
        // console.log(request)
        const comment = await new Comment(request)
        // console.log('get req',comment)
        comment.save()
        res.statusCode = 200
        res.json({
            message : 'Comment added successfully'
        })


    }catch(e){

    }
    res.json({})
})

Router.post("/comment-answer",async(req,res)=>{

})

Router.post("/deletecomment",async(req,res)=>{

})

Router.post("/update",async(req,res)=>{
    // console.log(req.body)
    let {commentId,Answer} = req.body
    try{
        const comment = await Comment.findById(commentId)
        comment.comment.Answer = Answer
        await comment.save()
        // console.log(comment)
        res.statusCode = 200
        res.json({
            message : 'success',
            data : comment
        })
    }
    catch(e){

    }
})

module.exports =  Router