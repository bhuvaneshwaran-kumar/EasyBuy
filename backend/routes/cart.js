const Router = require('express').Router()
const Cartlist = require('../model/Cartlist')
const Product = require('../model/Product')
const User = require('../model/User')


Router.post("/add-cart",async(req,res)=>{


    const uid = req.session._id
    const {pid,plabel,pImageDetails,quantity} = req.body

    const productData = {
        pid:pid,
        plabel:plabel,
        pImageDetails:pImageDetails,
        quantity:quantity
    }

    if(req.session.isAuth){
        try{
            const userCart = await Cartlist.findOne({
                uid:uid
            })
            
            if(userCart){
                let checkCartExist = userCart.productDetials.filter((data)=>{
                    if(data.pid === pid){
                        return data
                    }                
                })
    
                if(checkCartExist.length > 0){
                    res.statusCode = 201
                    console.log("data is already exist...!")
                }
                else{
                    res.statusCode = 200
                    userCart.productDetials = [productData,...userCart.productDetials]
                    await userCart.save()
                }
            }
            else{
                try{
                    let createUserCart =await new Cartlist({
                        uid,
                        productDetials : [
                            productData
                        ]
                    })
                    await createUserCart.save()
                    res.statusCode = 200
                  //  console.log(createUserCart)
                }
                catch(err){
                    console.log(err)
                }
                
    
            }
        }
        catch(err){
            console.log(err)
        }
        
    }

    
    return res.json({
        message:"Ok."
    })
})

Router.get("/get-user-address",async(req,res)=>{
    console.log("getAddress")
    if(req.session.isAuth){
        let uid = req.session._id
        const user = await User.findById(uid)
        const Address = user.User.address
        res.statusCode = 200
        return res.json({
            address : Address
        })

    }

})

Router.get('/get-price-offer',async(req,res)=>{
  
    try{
        if(req.session.isAuth){
         let {pid} = req.query
        //  console.log(pid)
         const product = await Product.findById(pid)
         let {pcost, pofferspan} = product
         return res.json({
             price : pcost,
             offer : pofferspan 
         })
        }
        else{
           
        }
    }
    catch(err){
        console.log(err)
    }
    
})

Router.get('/check-cart-exist',async(req,res)=>{
  
    try{
        if(req.session.isAuth){
         let {pid} = req.query
         let uid = req.session._id
         const cartList =await Cartlist.findOne({
            uid : uid
         })

         if(cartList){


            for(let data of cartList?.productDetials ){
              
                if(data.pid === pid){
                    // console.log("match")
                    res.statusCode = 200
                    return res.json({
                        match : true
                    })
                }

            }
         }
        res.statusCode = 201
        return  res.json({})
        }
    }
    catch(err){
        console.log(err)
    }
    
})


Router.get('/delete-cart',async(req,res)=>{
  
    try{
        if(req.session.isAuth){
         let {pid} = req.query
         let uid = req.session._id
         const cartList = await Cartlist.findOne({
             uid : uid
         })
         try{
            cartList.productDetials = cartList.productDetials.filter((data)=> data.pid !== pid) 
            cartList.save()
            res.statusCode = 200
           //  console.log(pid)
           return  res.json({
               message:"ok"
           })
         }catch(e){
             console.log("i'm the one only one from cart")
         }
         
        
        }
        else{
           
        }
    }
    catch(err){
        console.log(err)
    }
    
})


Router.get('/get-cart',async(req,res)=>{
  
    try{
        if(req.session.isAuth){
            let UserCart = await Cartlist.findOne({"uid":req.session._id})
      
            if(UserCart){
                res.statusCode = 200
                return res.json({
                    userCart : UserCart
                })
            }
            else{
                res.statusCode = 201
                return res.json({})
            }
        }
        else{
           
        }
    }
    catch(err){
        console.log(err)
    }
    return res.json({})
})


module.exports = Router