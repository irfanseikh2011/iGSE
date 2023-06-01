const mongoose = require('mongoose')
require('dotenv').config();

const url = process.env.MONGO_URL


module.exports.connect = () => {
    mongoose.connect(url).then((res) => console.log("MongoDB Connected")).catch((err)=> console.log('Errorr...',err))
}