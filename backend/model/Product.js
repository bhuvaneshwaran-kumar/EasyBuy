const Schema = require('mongoose').Schema

const Product = new Schema({
    pcategory : String,
    pitem : String,
    plabel : String,
    pbrand : String,
    pmodelno : String,
    pwarrantyspan : Number,
    pdescription : String,
    pstock : Number,
    pcost : Number,
    pImageDetails : [ {
        imageName: String,
        imageUrl: String
    } ],
    timestamp: {
        type: String
    },
    date:{
        type : Date
    },
    sellerId : String,
    pofferspan: Number,
    wishList:[{
        userId:String,
        userEmail : String,
        productId: String
    }],
    remaindMe:[{
        userId:String,
        userEmail : String,
        productId: String
    }]
    
})

module.exports = require('mongoose').model("Product", Product)