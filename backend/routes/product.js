const Router = require('express').Router()
const Product = require('../model/Product')
const cloudinary = require("../utils/cloudinary.js")


/*router.get('/', async (req, res) => {
    if (req.session.isAuth) {
        try {
            const skip = parseInt(req.query.skip) || 0
            const perPage = 5
            const totalCount = await Post.countDocuments()
            const posts = await Post.find().sort('-timestamp')
                .limit(perPage).skip(skip)
                .exec()

            const hasMore = ((skip + perPage) < totalCount) ? true : false

            res.json({ message: "Post sent to Frontend", report: true, posts: posts, hasMore: hasMore })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server Error", report: false })
        }
    }
    else {
        res.status(401).json({ message: "Unauthorized Access", report: false })
    }
})
*/

Router.post('/add',async (req, res) => {
    const { pName , pDescription, pImageDetials } = req.body
    // console.log(req.body)
    // console.log(pName,pDescription,pImageDetials.length)

    const uploadImage = async (imageString)=>{
        try{
            const result = await cloudinary.uploader.upload(imageString)
            console.log("result",result)
            return  result.secure_url
        }catch(err){
            console.log(err)
        }
    }


    if (req.session.isAuth) {
    
        let uploadedImages = []
        for(let image of pImageDetials){
            try{
                const result = await cloudinary.uploader.upload(image.data)
                console.log("result",result)
                 
                uploadedImages.push({
                    name : image.name,
                    imageUrl :  result.secure_url
                }) 
            }catch(err){
                console.log(err)
            }
        }

        console.log("result->processed image",uploadedImages)
        res.json({message:"GOt IMage"})
    }
    else {
        res.status(401).json({ message: "Unauthorized Access", report: false })
    }
})

module.exports = Router


        // const newPost = await new Post(post)
        // newPost.save()
        // console.log(`${newPost.authorName} has uploaded a New Post`)
        // res.status(201).json({ message: "post created", report: true, post: newPost })