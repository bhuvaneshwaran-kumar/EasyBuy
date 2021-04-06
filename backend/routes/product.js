const Router = require('express').Router()
const Product = require('../model/Product')
const cloudinary = require("../utils/cloudinary.js")


Router.get('/', async (req, res) => {
    if (req.session.isAuth) {
        try {
            console.log("user getting post")
            const skip = parseInt(req.query.skip) || 0
            const perPage = 5
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

Router.get('/getproductdata', async (req, res) => {
        try {    
            const id = req.query.id
            
            const product = await Product.findById(id)

            console.log(product)

            res.json({ message: "Post sent to Frontend", result : product})
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server Error", report: false })
        }
})


Router.get('/home', async (req, res) => {
        try {
            console.log("user getting post")
            const skip = parseInt(req.query.skip) || 0
            const perPage = 5
            const totalCount = await Product.countDocuments()
            const product = await Product.find().sort('-timestamp')
                .limit(perPage).skip(skip)
                .exec()

            const hasMore = ((skip + perPage) <= totalCount) ? true : false

            res.json({ message: "Post sent to Frontend", report: true, product: product, hasMore: hasMore })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server Error", report: false })
        }
})



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
            console.log("User product detials",product)
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
            pcost, pImageDetails 
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

            await product.save()
            res.status = 200
            console.log("User updated product detials",product)
            res.json({message:"updated product",product : product})
        }catch(err){
            console.log("error while we save the data of product ",err)
        }
      

    }
    else {
        res.status(401).json({ message: "Unauthorized Access", report: false })
    }
})

module.exports = Router

