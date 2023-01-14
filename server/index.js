const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/users.model')
const bcrypt = require('bcrypt');
const Bill = require('./models/bill.model')
const Rate = require('./models/rates.model');
const QRCode = require('./models/qrcode.model');
const { differenceInCalendarDays, parseISO } = require('date-fns');

app.use(cors());
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/users')

function generateCode() {
    var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
    for (var i = 0; i < 8; i++)
      code += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return code;
  }

app.post('/api/register', async (req,res) => {
    
    try {
        const ValidCode = await QRCode.findOne({code:req.body.balance})
        const prevUser = await User.findOne({customerID:req.body.customerID});

        if(prevUser !== null){
            return res.json({status:"error",message:"CustomerID exists"})
        }
        if(ValidCode === null){
        return res.json({status:"Error", message:"Code Invalid"});
       } else if(ValidCode.expired === true) {
        return res.json({status:"Error", message:"Code Expired"});
       }else {
        var newBalance = 200;
        const securedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            customerID : req.body.customerID,
            password : securedPassword,
            address : req.body.address,
            propertyType: req.body.propertyType,
            numberOfRooms: req.body.numberOfRooms,
            balance:newBalance
        });

        const codes = await QRCode.findOneAndUpdate(ValidCode._id,{expired:true})

        res.json({status:"ok",message:"Account Created."});
        console.log(user)
       }
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
    try {

        const userID = await User.findOne({customerID:req.body.customerID});
        const ValidCode = await QRCode.findOne({code:req.body.qrCode})
        let AvailBalance = userID.balance;

        if(ValidCode!== null && ValidCode.expired === true){
            res.json({status:"Coupon Code Expired"});
        }
        else if(ValidCode!== null)
        {
                AvailBalance = AvailBalance + 200;
                const user = await User.findOneAndUpdate({
                    customerID: req.body.customerID
                }, {balance: AvailBalance})

                const codes = await QRCode.findOneAndUpdate(ValidCode._id,{expired:true})
                res.json({status:"updated balance", data: user})
        } else {
            res.json({status:"Coupon Code is Invalid"});
        } 
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


app.post('/api/generateCode', async (req,res) => {
    try {
        const qrCode = generateCode();
        const prevCode = await QRCode.findOne({code: qrCode});

        while(prevCode == qrCode){
            qrCode = generateCode();
        }

        const Code = await QRCode.create({
            code : qrCode,
        })
        res.json({status:"ok",message:"Created new qrCode", data:Code})
    } catch(e) {
        res.json({status:"Error",message:"Something went wrong"})
    }
})


app.get('/igse/propertycount', async (req,res) => {
    try {
       
        
        const Terraced = await User.where('propertyType').equals('terraced').countDocuments()
        const detached = await User.where('propertyType').equals('detached').countDocuments()
        const Semidetached = await User.where('propertyType').equals('semi-detached').countDocuments()
        const Flat = await User.where('propertyType').equals('flat').countDocuments()
        const Cottage = await User.where('propertyType').equals('cottage').countDocuments()
        const Bungalow = await User.where('propertyType').equals('bungalow').countDocuments()
        const Mansion = await User.where('propertyType').equals('mansion').countDocuments()

       

        const data = [
            {
            "Terraced" : Terraced
            },
            {
            "detached" : detached
            },
           {
            "Semidetached" : Semidetached
           },
           {
            "Flat" : Flat
           },
           {
            "Cottage" : Cottage
           },
           {
            "Bungalow" : Bungalow
           },
           {
            "Mansion" : Mansion
           }
        ]

        res.json(data);
    }catch(e) {
        res.json({status: e})
    }
})




app.listen(1337, () => {
    console.log("Server started at 1337");
})