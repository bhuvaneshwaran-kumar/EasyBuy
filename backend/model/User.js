const Schema = require('mongoose').Schema

const User = new Schema({
    "User" : {
        "name" : String,
        "password" : String,
        "email" : String,
        // for otp purpose
        "verify" : {
            "status" : Boolean,
            "timespan" : Number,
            "otp":Number
        }
        ,
        "isSeller":Boolean,
        "address" : {
            "street":String,
            "city":String,
            "zipcode":Number
        }
    }
})

module.exports = require("mongoose").model("User",User)