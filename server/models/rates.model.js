const mongoose = require('mongoose')


const Rate = new mongoose.Schema({
    dayRate : {type:Number , required: true},
    nightRate : {type:Number , required: true},
    gas : {type:Number , required: true},
    standingRate : {type:Number , required: true},
}, {collection: "Rate"})


const model = mongoose.model('Rate',Rate)

module.exports = model;