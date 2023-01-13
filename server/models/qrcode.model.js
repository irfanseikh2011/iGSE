const mongoose = require('mongoose')


const QRCode = new mongoose.Schema({
    code : {type:String , required: true},
    expired: {type:Boolean, required: true, default: false}
}, {collection: "QRCode"})


const model = mongoose.model('QRCode',QRCode)

module.exports = model;