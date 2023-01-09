const mongoose = require('mongoose')


const Bill = new mongoose.Schema({
    date: {type: Date, required: true, default: Date.now },
    dayElectricity: {type:Number, required: true},
    nightElectricity: {type:Number, required: true},
    gas : {type:Number, required: true},
    user : {type: mongoose.Schema.Types.ObjectId, ref:'User'},
}, {collection: "Bill"})


const model = mongoose.model('Bill',Bill)

module.exports = model;