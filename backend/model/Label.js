const mongoose = require('mongoose')

const {Schema} =  mongoose

const Label = new Schema({
    labelName : [String]
})

module.exports = mongoose.model("Label",Label)