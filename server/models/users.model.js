const mongoose = require('mongoose')


const User = new mongoose.Schema({
    customerID: {type: String, required: true, unique: true},
    password: {type:String, required: true},
    address: {type:String, required: true},
    propertyType : {type:String, required: true},
    numberOfRooms : {type:String , required: true},
    balance: {type: Number, required: true},
    outstanding: {type: Number, required:true, default: 0},
    bills: [{type: mongoose.Schema.Types.ObjectId, ref:'Bill'}]
}, {collection: "Users"})


const model = mongoose.model('UserData',User)

module.exports = model;