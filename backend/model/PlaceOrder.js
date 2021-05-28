const mongoose = require('mongoose')

const {Schema} = mongoose

const PlaceOrder = {
    uid : String,
    suid:String,
    duid:String,
    productDetials : {
        pid : String,
        quantity : Number
    },
    price : Number,
    orderStatus : {
        code :Number,
        message : String
    },
    timestamp : {
        type : String,
        default :Date.now()
    },
    orderPlacedTimeStamp : {
        type : Date,
        default : new Date()
    }
}

module.exports = mongoose.model("PlaceOrder",PlaceOrder)