const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/users.model')
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/users')

app.post('/api/register', async (req,res) => {
    console.log(req.body);
    const validCodes = ['DM8LEESR','XTX2GZAD','NDA7SY2V','RVA7DZ2D']
    var newBalance = 0
    console.log(validCodes.includes(req.body.balance))
    if(validCodes.includes(req.body.balance))
        {
            newBalance = 200;
        }
    try {

        const securedPassword = await bcrypt.hash(req.body.password, 10);
       
        console.log(newBalance);

        const user = await User.create({
            customerID : req.body.customerID,
            password : securedPassword,
            address : req.body.address,
            propertyType: req.body.propertyType,
            numberOfRooms: req.body.numberOfRooms,
            balance:newBalance
        });
        res.json({status:"ok"});
        console.log(user)
    } catch(err){
        res.json({status:"Error"})
    }    
})

app.post('/api/login', async (req,res) => {
    const user = await User.findOne({
        customerID: req.body.customerID,
    })

    const isValidPass = await bcrypt.compare(req.body.password,user.password);

    if(isValidPass){
            const token = jwt.sign({
                customerID : user.customerID,
            }, 'secret@123')

            res.json({status:"ok", user: token, userData: user});
    } else {
        res.json({status:"Error", user: false})   
    }      
})

// app.post('/api/userdata', async (req,res) => {
    
// })

app.listen(1337, () => {
    console.log("Server started at 1337");
})