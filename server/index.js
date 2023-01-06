const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/users.model')
app.use(cors());
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/users')

app.post('/api/register', async (req,res) => {
    console.log(req.body);
    try {
        const user = await User.create({
            customerID : req.body.customerID,
            password : req.body.password,
            address : req.body.address,
            propertyType: req.body.propertyType,
            numberOfRooms: req.body.numberOfRooms,
            balance:req.body.balance
        });
        res.json({status:"ok"});
        console.log(user)
    } catch(err){
        res.json({status:"Error"})
    }    
})

app.post('/api/login', async (req,res) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })
    if(user){
            res.json({status:"ok", user: true});
    } else {
        res.json({status:"Error", user: false})   
    }      
})

app.listen(1337, () => {
    console.log("Server started at 1337");
})