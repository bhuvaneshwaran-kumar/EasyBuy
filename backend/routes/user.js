const Router = require('express').Router()
const User = require('../model/User')



Router.post("/deleteaddress",async(req,res)=>{

    try{
    res.statusCode = 200
    const data =  await User.findById(req.session._id)
    let load = String(req.body.id)
    console.log("id->to be deleted",load)

    let newAddress = data.User.address.filter((add)=>{
        let id = String(add._id)
        if(id !== load){
            return add
        }
    })
    console.log(newAddress)
    data.User.address = newAddress
    await data.save()
    res.json({
        "message" :"goot it ..🚀🚀🚀",
        "uAddress" : req.body        
    })
    }
    catch(err){
        console.log(err)
    }   

})


Router.post("/edit-name",async(req,res)=>{
    try{
        if(req.session.isAuth){
            const {name} = req.body
            const user = await User.findById(req.session._id)
            user.User.name = name
            user.save()
            res.statusCode = 200
            res.json({

            })
        }
    }
    catch(err){
        console.log(err)
    }
})


Router.post("/addaddress",async(req,res)=>{

    try{
    res.statusCode = 200
    const data =  await User.findById(req.session._id)
    data.User.address = [req.body,...data.User.address]
    data.save()
    res.json({
        "message" :"goot it ..🚀🚀🚀",
        "uAddress" : data.User.address[0]       
    })
    }
    catch(err){
        console.log(err)
    }   

})



module.exports = Router