const mongoose = require('mongoose')

const {Schema} =  mongoose

const Comment = new Schema({
    productId : String,
    userId : String,
    userName : String,
    sellerId : String,
    sellerName : String,
    comment : {
      Question : String,
      Answer : String  
    },
    timestamp : {
        type : String,
        default :Date.now()
    }
})

module.exports = mongoose.model("Comment",Comment)