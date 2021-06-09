const Router = require('express').Router()
const Product = require('../model/Product')
const cloudinary = require("../utils/cloudinary.js")
const Label = require('../model/Label.js')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


// SEND USER'S OWN PRODUCT
Router.get('/', async (req, res) => {
    if (req.session.isAuth) {
        try {
            // console.log("user getting post")
            const skip = parseInt(req.query.skip) || 0
            const perPage = 30
            const totalCount = await Product.countDocuments()
            const product = await Product.find({sellerId : req.session._id}).sort('-timestamp')
                .limit(perPage).skip(skip)
                .exec()

            const hasMore = ((skip + perPage) <= totalCount) ? true : false

            return res.json({ message: "Post sent to Frontend", report: true, product: product, hasMore: hasMore })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server Error", report: false })
        }
    }
    else {
        res.status(401).json({ message: "Unauthorized Access", report: false })
    }
})

// SEND USER'S SEARCH PRODUCT
Router.get("/home/search", async(req,res)=>{
    try{
        // console.log("get search request")

        let Searchkeys = req.query.Searchkeys
        
        let product = await Product.find({'plabel':Searchkeys})
        res.statusCode = 200  
        if(product.length === 1){
            return res.json({
                products : product
            })
        }else{
            product =  await Product.find({pcategory:'Grocery'}).sort('-timestamp')
            return res.json({
                products : product
            })
        }
        



    }
    catch(err){
        console.log(err)
    }
})


// SEND INDIVIDUAL PRODUCT DATA
Router.get('/getproductdata', async (req, res) => {
        try {    
            const id = req.query.id
            // console.log(id,'--> need to be fetched.')
            const product = await Product.findById(id)

            // console.log(product)

            return res.json({ message: "Post sent to Frontend", result : product})
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server Error", report: false })
        }
})


Router.get('/home', async (req, res) => {
        try {
            console.log("user getting post")
            const productToBeFetched = req.query.productToBeFetched
            const skip = parseInt(req.query.skip) || 0
            const perPage = 20

            if(productToBeFetched === 'offer'){
                console.log('sending offer')

                let totalCount = await Product.find({ pofferspan : { $gt : 0 } }).countDocuments()
                let OfferProduct = await Product.find({ pofferspan : { $gt : 0 } }).sort('-pofferspan')
                .limit(perPage).skip(skip)
                .exec()
                // console.log("offer product",OfferProduct)
                const hasMore = ((skip + perPage) <= totalCount) ? true : false
                return res.json({ message: "Post sent to Frontend", report: true, product: OfferProduct, hasMore: hasMore })
            }

            if(productToBeFetched === 'Fashion'){
                console.log('sending fashion')

                let totalCount = await Product.find({pcategory:'Fashion'}).countDocuments()
                let OfferProduct = await Product.find({pcategory:'Fashion'}).sort('-timestamp')
                .limit(perPage).skip(skip)
                .exec()
                // console.log("offer product",OfferProduct)
                const hasMore = ((skip + perPage) <= totalCount) ? true : false
                return res.json({ message: "Post sent to Frontend", report: true, product: OfferProduct, hasMore: hasMore })
            }

            if(productToBeFetched === 'Grocery'){
                console.log('sending grocery')

                let totalCount = await Product.find({pcategory:'Grocery'}).countDocuments()
                let OfferProduct = await Product.find({pcategory:'Grocery'}).sort('-timestamp')
                .limit(perPage).skip(skip)
                .exec()
                // console.log("offer product",OfferProduct)
                const hasMore = ((skip + perPage) <= totalCount) ? true : false
                return res.json({ message: "Post sent to Frontend", report: true, product: OfferProduct, hasMore: hasMore })
            }

            if(productToBeFetched === 'Electronics'){
                console.log('sending electronics')

                let totalCount = await Product.find({pcategory:'Electronics'}).countDocuments()
                let OfferProduct = await Product.find({pcategory:'Electronics'}).sort('-timestamp')
                .limit(perPage).skip(skip)
                .exec()
                // console.log("offer product",OfferProduct)
                const hasMore = ((skip + perPage) <= totalCount) ? true : false
                return res.json({ message: "Post sent to Frontend", report: true, product: OfferProduct, hasMore: hasMore })
            }

            if(productToBeFetched === 'mobiles'){
                console.log('sending mobiles')

                let totalCount = await Product.find({pitem:'Mobile'}).countDocuments()
                let OfferProduct = await Product.find({pitem:'Mobile'}).sort('-timestamp')
                .limit(perPage).skip(skip)
                .exec()
                // console.log("offer product",OfferProduct)
                const hasMore = ((skip + perPage) <= totalCount) ? true : false
                return res.json({ message: "Post sent to Frontend", report: true, product: OfferProduct, hasMore: hasMore })
            }
            
            if(productToBeFetched === 'all'){
                console.log('sending all')
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
    // console.log(wishListData);
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

//cloneing for remaind me..
const sendMailForRemaindMe = async(wishListData,id)=>{ 
    // console.log(wishListData);
    if(wishListData.length > 0){
        for(data in wishListData){
            const email = {
                to: wishListData[data].userEmail, // Change to your recipient
                from: '"no-reply@Easy-buy.com"<bhuvaneshwarankumar2000@gmail.com >', // Change to your verified sender
                subject: 'Easy-buy Online Shopping ',
                text: `Product you asked us to remaind you.`,
                html: `<strong>Your RemaindMe product in EasyBuy is back in sale <a href="http://localhost:3000/product/${id}" target="_blank"> Click here to check</a></strong>`,
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
            return res.json({message:"GOt IMage",product : product})
        }catch(err){
            console.log("error while we save the data of product ",err)
        }
      

    }
    else {
        return res.status(401).json({ message: "Unauthorized Access", report: false })
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
            let prevStock = product.pstock
            product.pstock = pstock
            product.pcost = pcost
            let prevOffer = product.pofferspan
            product.pofferspan = pofferspan

            if(prevOffer < product.pofferspan){
                // console.log("send mail")
                setImmediate(()=>sendMail(product.wishList,product._id)
                )
                // sendMail(product.wishList,product._id)
            }
            // console.log(prevStock,product.pstock)
            if(prevStock <= 0 && product.pstock > 0){
                console.log("sending mail for user")
                setImmediate(()=>sendMailForRemaindMe(product.remaindMe,product._id))
            }

            await product.save()
            res.status = 200
            // console.log("User updated product detials",product)
            return res.json({message:"updated product",product : product})
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
        return res.json({message:"success user already liked the product"})
    }else{
        res.statusCode = 201
        return res.json({message:"nope user not liked the product"})
    }
})

Router.post('/addwishlist',async(req,res)=>{
    const {productId} = req.body
    const product = await Product.findById(productId)
    product.wishList = [...product.wishList,req.body]
    product.save()
    // console.log(product)
    res.statusCode = 200
    return res.json({message:"success"})
})

Router.post('/removewishlist',async(req,res)=>{
    const {productId,userId} = req.body
    const product = await Product.findById(productId)
    const filteredPeople = product.wishList.filter((item) => item.userId !== userId);
    product.wishList = filteredPeople
    product.save()
    // console.log('after removing',product)
    res.statusCode = 200
    return res.json({message:"success"})

})

// cloneing for remaind me .
Router.post('/check-remaind-me',async(req,res)=>{

    // d-structing data from req.
    const {productId,userId} = req.body

    // fetch product data form product collection using productID
    const product = await Product.findById(productId)

    //d-structing wishList data from product
    let {remaindMe} = product

    // check whether user liked the product
    let hasremaindMe = remaindMe.filter((wish)=>{
        return wish.userId === userId
    })

    if(hasremaindMe.length !== 0){
        res.statusCode = 200
        return res.json({message:"success user already liked the product"})
    }else{
        res.statusCode = 201
        return res.json({message:"nope user not liked the product"})
    }
})

Router.post('/add-remaind-me',async(req,res)=>{
    const {productId,userId} = req.body
    const product = await Product.findById(productId)
    product.remaindMe = [...product.remaindMe,req.body]
    product.save()
    // console.log(product)
    res.statusCode = 200
    return res.json({message:"success"})
})

Router.post('/remove-remaind-me',async(req,res)=>{
    console.log("removed remaind me")
    const {productId,userId} = req.body
    const product = await Product.findById(productId)
    const filteredPeople = product.remaindMe.filter((item) => item.userId !== userId);
    product.remaindMe = filteredPeople
    product.save()
    // console.log('after removing',product)
    res.statusCode = 200
    return res.json({message:"success"})

})


Router.post('/searchproduct',async(req,res)=>{
    try{
        const labels = await Label.find()
        return res.json({
            labelName : labels[0].labelName
        }) 
    }
    catch(e){
        console.log(e)
    }        
})

module.exports = Router

