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
        "address" : [
            {
                "uName":String,             "uMobNum":String,               "uPinNum":String,               "uLocality":String,
                "uAddress":String,                "uRegional":String,
                "uAlMobNum":String,
                "uState":String,              "uLandmark":String,
                "uAddType":String,       
            }
        ]

    }
})

module.exports = require("mongoose").model("User",User)