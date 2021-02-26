const Schema = require('mongoose').Schema

const Product = new Schema({
    pName: String,
    pDescription: String,
    pImageDetials: [ {
        imageName: String,
        imageUrl: String
    } ],
    publicId : String,
    timestamp: {
        type: String
    },
})

module.exports = require('mongoose').model("Product", Product)