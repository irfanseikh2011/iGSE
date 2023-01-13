const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/users.model')
const bcrypt = require('bcrypt');
const Bill = require('./models/bill.model')
const Rate = require('./models/rates.model');
const { differenceInCalendarDays, parseISO } = require('date-fns');

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


app.post('/api/submitreading', async (req,res) => {
    const customer = await User.findOne({
        customerID: req.body.user
    })

    try {

        const prevBill = await Bill.findOne({user:customer._id}).sort({date: -1});

        if(prevBill!==null){
            const currDate = parseISO(req.body.date)
            const dateDifference = (differenceInCalendarDays(currDate, prevBill.date))
            
            if(dateDifference <= 0){
                res.json({status:"error",message:"Date cannot be prior or same to the previous reading date", code:"dateMismatch"})
            }

             else if(prevBill.dayElectricity > req.body.dayElectricity || prevBill.nightElectricity > req.body.nightElectricity || prevBill.gas > req.body.gas){
                res.json({status:"error",message:"Latest readings cannot be less than previous readings.",code:"readingsMismatch"})
            }
            else {
                const bill = await Bill.create({
                    date : req.body.date,
                    dayElectricity : req.body.dayElectricity,
                    nightElectricity : req.body.nightElectricity,
                    gas: req.body.gas,
                    user: customer._id
                })
                res.json({status:"ok", message:"created"});
                console.log(bill)
            }
        } else {

            const bill = await Bill.create({
                date : req.body.date,
                dayElectricity : req.body.dayElectricity,
                nightElectricity : req.body.nightElectricity,
                gas: req.body.gas,
                user: customer._id
            })
            res.json({status:"ok", message:"created"});
            console.log(bill)

        }

    } catch (e) {
        res.json({status: "error", user: customer})
    }
     
})



app.post('/api/topup', async (req,res) => {

    const user = await User.findOne({customerID:req.body.customerID});
     
    let AvailBalance = user.balance;
    const validCodes = ['DM8LEESR','XTX2GZAD','NDA7SY2V','RVA7DZ2D']
    if(validCodes.includes(req.body.qrCode))
        {
            AvailBalance = AvailBalance + 200;
        }
    try {
        const user = await User.findOneAndUpdate({
            customerID: req.body.customerID
        }, {balance: AvailBalance})
        res.json({status:"updated balance", data: user})
    } catch {
        res.json({status:"error"});
    }

})


app.get('/api/profile/:id', async (req,res) => {
    try {
        const param = req.params.id
        const user = await User.findOne({customerID: param});
        res.json({message: "ok",data:user});
    } catch {
        res.json({message:"error"})
    }
})


app.get('/api/getBill/:id', async (req,res) => {
    try {
        const id = req.params.id
        const userId = await User.findOne({customerID:id});
        const bill = await Bill.findOne({user:userId._id}).sort({date: -1});
        res.json({data:bill});
    }catch(err) {
        res.send(err);
    }
})

app.post('/api/postRate', async(req,res) => {
    try {

        const prevRate = await Rate.findOne({});

        if(prevRate.length===0){
            const rate = await Rate.create({
                dayRate : req.body.dayRate,
                nightRate : req.body.nightRate,
                gas : req.body.gas,
                standingRate : req.body.standingRate
            })
            res.json({status:"ok",message:"Created new rate", data:rate})
        } else {
           console.log(prevRate.dayRate)
            const rate = await Rate.findOneAndUpdate({_id: prevRate._id},
                {
                dayRate : req.body.dayRate,
                nightRate : req.body.nightRate,
                gas : req.body.gas,
                standingRate : req.body.standingRate
                })
            res.json({status:"ok",message:"updated the rate",rates: rate})
        }
    } catch(e) {
        res.json({error: e});
    }
})


app.get('/api/getRates', async(req,res) => {
    try{
        const rates = await Rate.find({});
        res.json({data:rates});
    } catch(e) {
        res.status({error: e});
    }
}
)


app.put('/api/updateOustanding', async(req,res) => {
    try {
        const userId = await User.findOne({customerID:req.body.customerID});
        const prevBill = await Bill.findOne({user:userId._id}).sort({date: 1})
        const currBill = await Bill.findOne({user:userId._id}).sort({date: -1})
        const rates = await Rate.findOne({});


        const day = (currBill.dayElectricity - prevBill.dayElectricity) * rates.dayRate;
        const night = (currBill.nightElectricity - prevBill.nightElectricity) * rates.nightRate;
        const gas = (currBill.gas - prevBill.gas) * rates.gas;
      

        const days = differenceInCalendarDays(currBill.date,prevBill.date);
        const standing = rates.standingRate * days;


        const outstanding = day + night + gas + standing;
        const calculate = await User.findByIdAndUpdate(userId._id, {outstanding: outstanding});

        res.json({data: calculate})

    } catch (e) {
        res.json({status:e})
    }
})


app.put('/api/paybill', async (req,res) => {
    try {
        const userId = await User.findOne({customerID:req.body.customerID});
        
        if(userId.outstanding > 0)
        {
            Bill.find().sort({_id: 1}).exec(async (err, allDocs) => {
                if(err) throw err;
                let lastDoc = allDocs.pop();
                await Bill.deleteMany({ _id: { $ne: lastDoc._id } }).exec();
            });

            const updatedBalance =  Number.parseFloat(userId.balance - userId.outstanding).toFixed(2);
            const updatedUser = await User.findOneAndUpdate(userId._id, {outstanding: 0, balance: updatedBalance});
            res.json({status:"ok", message: updatedUser})
        }

        else {
            res.json({status:"ok",message: "No outstanding"})
        }

        
    } catch(e) {
        res.json({status:"error", message:e})
    }
})




app.listen(1337, () => {
    console.log("Server started at 1337");
})