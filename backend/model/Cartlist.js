const mongoose = require('mongoose')

const {Schema} = mongoose

const Cartlist = new Schema({
    uid : String,
    productDetials : [{
        pid : String,
        plabel : String,
        pImageDetails : [ {
            imageName: String,
            imageUrl: String
        } ] ,
        quantity : Number
    }]

})

module.exports = mongoose.model("Cartlist",Cartlist)