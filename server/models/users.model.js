const mongoose = require('mongoose')


const User = new mongoose.Schema({
    customerID: {type: String, required: true, unique: true},
    password: {type:String, required: true},
    address: {type:String, required: true},
    propertyType : {type:String, required: true},
    numberOfRooms : {type:Number , required: true},
    balance: {type: Number, required: true}
}, {collection: "Users"})


const model = mongoose.model('UserData',User)

module.exports = model;