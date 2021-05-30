const Router = require("express").Router()
const PlaceOrder = require("../model/PlaceOrder")
const Cartlist = require("../model/Cartlist")
const Product = require("../model/Product")

const flushUserCart = async (uid)=>{

    const userCartList = await Cartlist.findOne({uid : uid})
    userCartList.productDetials = []
    userCartList.save()

}

const decreaseProductCount = async (pid,quantity)=>{

    console.log(pid)
    const product = await Product.findById(pid)
    // console.log(product)
    product.pstock = product.pstock - quantity
    // console.log(product)
    product.save()

}



Router.post("/",async(req,res) => { 
    // console.log(req.body.data)
    if(req.session.isAuth){
        let uid = req.session._id
        // console.log("got req")
        try{
            req.body.data.forEach(async (data,index)=>{
                // console.log("loading index",index)
                const {pid,quantity,offer,price} = data
                let accPrice = (offer > 0 ) ? price-(price * offer/100) : price;
                await decreaseProductCount(pid,quantity)
                const code = 200
                const message = "Order Placed Successfully."
                const orderPlaced = await new PlaceOrder({
                    uid : uid,
                    productDetials : {
                        pid : pid,
                        quantity : quantity
                    },
                    price : accPrice,
                    orderStatus : {
                        code : code,
                        message : message
                    }
                })
                orderPlaced.save()
            })
            await flushUserCart(uid)
            res.statusCode = 200
            return res.json({
                message :"ok"
            })
        }
        catch(err){

        }
       

       
    }
})


Router.post("/get-product-detials",async(req,res)=>{

    try{
        const {pid} = req.body
        const product = await Product.findById(pid)
        let result = {
            label : product.plabel,
            pimage : product.pImageDetails[0].imageUrl
        }
        res.statusCode = 200
        return res.json({
            result : result
        })

    }
    catch(err){
        console.log(err)
    }

})


Router.get("/get-user-order-detials",async(req,res)=>{
    // console.log("fetching user order detials.")

    try{
        const orderDetials = await PlaceOrder.find({uid:req.session._id})
        // console.log(orderDetials.length)
        res.statusCode = 200   
        return res.json({
            data : orderDetials
        })
    }
    catch(err){
        console.log(err)
    }

})
module.exports = Router
