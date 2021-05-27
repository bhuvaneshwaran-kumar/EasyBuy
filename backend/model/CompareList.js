const mongoose = require('mongoose')

const {Schema} = mongoose

const CompareList = new Schema({
    "uid" : String,
    "pitem" : [
            {"name":String}
        ],
    "product":[
            {
                "pid":String,
                "category":String
            }
        ]
})

module.exports = mongoose.model("CompareList",CompareList)