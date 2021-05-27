const Router = require("express").Router()
const CompareList = require("../model/CompareList")
const User = require("../model/User")
const Product = require("../model/Product")



Router.get("/get-user-compare-list",async(req,res)=>{
    if(req.session.isAuth){
        try{
            const compareList = await CompareList.findOne({"uid":req.session._id})
            res.statusCode = 200
            if(compareList){
                res.json(compareList)
            }
            else{
                res.json(undefined)
            }
        }
        catch(err){

        }
    }
})

Router.get("/get-product-data",async(req,res)=>{
    if(req.session.isAuth){
        try{
            const product = await Product.findById(req.query.pid)
            res.statusCode = 200
            // console.log(product)
            res.json(product)
        }
        catch(err){

        }
    }
})

Router.get("/get-user-compare-exist",async(req,res)=>{
    if(req.session.isAuth){
        const compareList = await CompareList.findOne({uid:req.session._id})
        let result = compareList.product.filter(data=>data.pid === req.query.pid)
        // console.log("result of check compare exist",result,req.query)
        if(result.length >= 1){
            res.statusCode = 200
            res.json({message:"Exist"})
        }else{
            res.statusCode = 201
            res.json({message:"Not Exist"})
        }
    }
})

Router.post("/add-user-compare-list",async(req,res)=>{
    if(req.session.isAuth){
        // console.log("User try to add to compare product",req.body)
        let {uid,item,pid} = req.body
        // console.log(uid,item,pid)
        try{
            const compareList = await CompareList.findOne({uid:uid})
            if(compareList){
                // console.log("User's Compare List is already exist....😋😋")
                let result = compareList.pitem.filter(data=>data.name === item)
                // console.log(result)
                if(result.length === 1){
                    let resultinside = compareList.product.filter(data=>data.pid === pid)
                    if(resultinside.length === 0){
                        compareList.product = [...compareList.product,{pid:pid,"category":item}]
                    }
                }else{
                    compareList.pitem = [...compareList.pitem,{"name":item}]
                    compareList.product = [...compareList.product,{pid:pid,"category":item}]
                }
                compareList.save()
            }else{
                // console.log("Creating a new compareList for User....😋😋")

                const newCompareList = await new CompareList({
                    uid : uid,
                    pitem :[{"name":item}],
                    product:[{pid,"category":item}]
                    
                })
                newCompareList.save()
            }
        }catch(err){

        }
        res.statusCode = 200
        res.json({})
    }
})

Router.get("/alter-user-compare-list",async(req,res)=>{
    console.log("geting request")
    if(req.session.isAuth){
        try{
            await CompareList.deleteOne({uid:req.session._id})
            res.statusCode = 200
            console.log("deleted success")
            return res.json({
                message:"Successfully flushed the data.."
            })
        }
        catch(err){
            console.log(err)
        }
    }

})



module.exports = Router