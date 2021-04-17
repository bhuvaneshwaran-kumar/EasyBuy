const Schema = require('mongoose').Schema

const WishList = new Schema({
    userId:String,
    username : String,
    userEmail : String,
    productId: String
})

module.exports = require('mongoose').model("WishList", WishList)