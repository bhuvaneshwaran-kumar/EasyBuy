const Router = require('express').Router()
const Product = require('../model/Product')
const cloudinary = require("../utils/cloudinary.js")
const Label = require('../model/Label.js')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


Router.get('/', async (req, res) => {
    if (req.session.isAuth) {
        try {
            // console.log("user getting post")
            const skip = parseInt(req.query.skip) || 0
            const perPage = 50
            const totalCount = await Product.countDocuments()
            const product = await Product.find({sellerId : req.session._id}).sort('-timestamp')
                .limit(perPage).skip(skip)
                .exec()

            const hasMore = ((skip + perPage) <= totalCount) ? true : false

            res.json({ message: "Post sent to Frontend", report: true, product: product, hasMore: hasMore })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server Error", report: false })
        }
    }
    else {
        res.status(401).json({ message: "Unauthorized Access", report: false })
    }
})

Router.get("/home/search",async (req,res)=>{
    try{
        console.log("get search request")

        let Searchkeys = req.query.Searchkeys
        
        const product = await Product.find({'plabel':Searchkeys})

        res.statusCode = 200
        return res.json({
            products : product
        })



    }
    catch(err){
        console.log(err)
    }
})

Router.get('/getproductdata', async (req, res) => {
        try {    
            const id = req.query.id
            console.log(id,'--> need to be fetched.')
            const product = await Product.findById(id)

            // console.log(product)

            res.json({ message: "Post sent to Frontend", result : product})
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server Error", report: false })
        }
})


Router.get('/home', async (req, res) => {
        try {
            // console.log("user getting post")
            const productToBeFetched = req.query.productToBeFetched
            const skip = parseInt(req.query.skip) || 0
            const perPage = 20

            if(productToBeFetched === 'offer'){
                let totalCount = await Product.find({ pofferspan : { $gt : 0 } }).count()
                let OfferProduct = await Product.find({ pofferspan : { $gt : 0 } }).sort('-pofferspan')
                .limit(perPage).skip(skip)
                .exec()
                // console.log("offer product",OfferProduct)
                const hasMore = ((skip + perPage) <= totalCount) ? true : false
                return res.json({ message: "Post sent to Frontend", report: true, product: OfferProduct, hasMore: hasMore })
            }

            if(productToBeFetched === 'Fashion'){
                let totalCount = await Product.find({pcategory:'Fashion'}).count()
                let OfferProduct = await Product.find({pcategory:'Fashion'}).sort('-timestamp')
                .limit(perPage).skip(skip)
                .exec()
                // console.log("offer product",OfferProduct)
                const hasMore = ((skip + perPage) <= totalCount) ? true : false
                return res.json({ message: "Post sent to Frontend", report: true, product: OfferProduct, hasMore: hasMore })
            }

            if(productToBeFetched === 'mobiles'){
                let totalCount = await Product.find({pitem:'Mobile'}).count()
                let OfferProduct = await Product.find({pitem:'Mobile'}).sort('-timestamp')
                .limit(perPage).skip(skip)
                .exec()
                console.log("offer product",OfferProduct)
                const hasMore = ((skip + perPage) <= totalCount) ? true : false
                return res.json({ message: "Post sent to Frontend", report: true, product: OfferProduct, hasMore: hasMore })
            }
            
            if(productToBeFetched === 'all'){
                const totalCount = await Product.countDocuments()
                const product = await Product.find().sort('-timestamp')
                    .limit(perPage).skip(skip)
                    .exec()
    
                const hasMore = ((skip + perPage) <= totalCount) ? true : false
    
                return res.json({ message: "Post sent to Frontend", report: true, product: product, hasMore: hasMore })
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server Error", report: false })
        }
})


const sendMail = async(wishListData,id)=>{ 
    console.log(wishListData);
    if(wishListData.length > 0){
        for(data in wishListData){
            const email = {
                to: wishListData[data].userEmail, // Change to your recipient
                from: '"no-reply@Easy-buy.com"<bhuvaneshwarankumar2000@gmail.com >', // Change to your verified sender
                subject: 'Easy-buy Online Shopping ',
                text: `Your One Time Password is link`,
                html: `<strong>Your wishList product in EasyBuy got a jaw dropping offer<a href="http://localhost:3000/product/${id}" target="_blank"> Click here to check</a></strong>`,
              }

            sgMail
            .send(email)
            .then(async () => {
            console.log('Email sent')
            })
            .catch((error) => {
            console.error(error)
            })
        }
    }
}

/**  Handles Adding Products  Routes functionality */ 

Router.post('/add',async (req, res) => {
    console.log(`seller adding a product ....:-)`)
    const { pcategory, pitem,
            plabel, pbrand,
            pmodelno, pwarrantyspan, 
            pdescription, pstock,
            pcost, pImageDetails 
            }   = req.body
    
    // checks seller is authenticated... 
    if (req.session.isAuth) {
    
        let uploadedImages = []
    // upload all the imageString to cloudinary.  
        for(let image of pImageDetails){
            try{
                const result = await cloudinary.uploader.upload(image.data)
                // console.log("result",result)
                 
                uploadedImages.push({
                    name : image.name,
                    imageUrl :  result.secure_url
                }) 
            }catch(err){
                console.log(err)
            }
        }

    // Store the product detials in mongoDb
        try{
            const product =await new Product({
                pcategory : pcategory,
                pitem : pitem,
                plabel : plabel,
                pbrand : pbrand,
                pmodelno : pmodelno,
                pwarrantyspan : pwarrantyspan,
                pdescription : pdescription,
                pstock : pstock,
                pcost : pcost,
                pImageDetails : uploadedImages,
                timestamp:Date.now(),
                date:new Date(),
                sellerId : req.session._id
            })
            await product.save()
            res.status = 200
            // console.log("User product detials",product)
            res.json({message:"GOt IMage",product : product})
        }catch(err){
            console.log("error while we save the data of product ",err)
        }
      

    }
    else {
        res.status(401).json({ message: "Unauthorized Access", report: false })
    }
})

/**  Handles updating Products  Routes functionality */ 
Router.post('/update',async (req, res) => {
    console.log(`seller updating a product ....:-)`)
    const { pcategory, pitem,
            plabel, pbrand,
            pmodelno, pwarrantyspan, 
            pdescription, pstock,
            pcost, pImageDetails ,pofferspan
            }   = req.body
    
    // checks seller is authenticated... 
    if (req.session.isAuth) {
    
    // Store the product detials in mongoDb
        try{
            const product = await Product.findById(req.body._id)

            product.plabel = plabel
            product.pwarrantyspan = pwarrantyspan 
            product.pdescription = pdescription
            product.pstock = pstock
            product.pcost = pcost
            let prevOffer = product.pofferspan
            product.pofferspan = pofferspan

            if(prevOffer < product.pofferspan){
                console.log("send mail")
                setImmediate(()=>sendMail(product.wishList,product._id)
                )
                // sendMail(product.wishList,product._id)
            }

            await product.save()
            res.status = 200
            // console.log("User updated product detials",product)
            res.json({message:"updated product",product : product})
        }catch(err){
            console.log("error while we save the data of product ",err)
        }
      

    }
    else {
        res.status(401).json({ message: "Unauthorized Access", report: false })
    }
})


Router.post('/checkwishlist',async(req,res)=>{

    // d-structing data from req.
    const {productId,userId} = req.body

    // fetch product data form product collection using productID
    const product = await Product.findById(productId)

    //d-structing wishList data from product
    let {wishList} = product

    // check whether user liked the product
    let hasWishlist = wishList.filter((wish)=>{
        return wish.userId === userId
    })

    if(hasWishlist.length !== 0){
        res.statusCode = 200
        res.json({message:"success user already liked the product"})
    }else{
        res.statusCode = 201
        res.json({message:"nope user not liked the product"})
    }
})

Router.post('/addwishlist',async(req,res)=>{
    const {productId,userId} = req.body
    const product = await Product.findById(productId)
    product.wishList = [...product.wishList,req.body]
    product.save()
    // console.log(product)
    res.statusCode = 200
    res.json({message:"success"})
})

Router.post('/removewishlist',async(req,res)=>{
    const {productId,userId} = req.body
    const product = await Product.findById(productId)
    const filteredPeople = product.wishList.filter((item) => item.userId !== userId);
    product.wishList = filteredPeople
    product.save()
    // console.log('after removing',product)
    res.statusCode = 200
    res.json({message:"success"})

})

Router.post('/searchproduct',async(req,res)=>{
    try{
        const labels = await Label.find()
        res.json({
            labelName : labels[0].labelName
        }) 
    }
    catch(e){
        console.log(e)
    }        
})

module.exports = Router

