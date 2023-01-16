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

// mongoose.set('debug', function (coll, method, query, doc) {
//     console.log(coll + '.' + method, JSON.stringify(query), doc);
//   });
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

    console.log(req.body.property)
    try {

        const prevRate = await Rate.findOne({});

        if(prevRate.length===0){
            const rate = await Rate.create({
                dayRate : req.body.dayRate,
                nightRate : req.body.nightRate,
                gas : req.body.gas,
                standingRate : req.body.standingRate
            })
            return res.json({status:"ok",message:"Created new rate", data:rate})
        } else {
        //    console.log(prevRate.dayRate)
            if(req.body.type === "day"){
               const rate = await Rate.findOneAndUpdate({_id: prevRate._id},{dayRate : req.body.property})
               return res.json({status:"ok",message:"updated the rate",rates: rate})
            } else if(req.body.type === "night"){
                const rate = await Rate.findOneAndUpdate({_id: prevRate._id},{nightRate : req.body.property})
                return res.json({status:"ok",message:"updated the rate",rates: rate})
            } else if(req.body.type === "gas"){
                const rate = await Rate.findOneAndUpdate({_id: prevRate._id},{gas : req.body.property})
                return res.json({status:"ok",message:"updated the rate",rates: rate})
            } else {
                const rate = await Rate.findOneAndUpdate({_id: prevRate._id},{standingRate : req.body.property})
                return res.json({status:"ok",message:"updated the rate",rates: rate})
            }
        }
    } catch(e) {
        res.json({error: e});
    }
})


app.post('/api/postDayRate', async(req,res) => {

    try {
        const prevRate = await Rate.findOne({});

        if(prevRate !== null){
               const rate = await Rate.findOneAndUpdate({_id: prevRate._id},{dayRate : req.body.dayRate})
               return res.json({status:"ok",message:"updated the rate",rates: rate})
        }else {
            res.json({status:"ok", message: "No rates present"})
        }
    } catch(e) {
        res.json({error: e});
    }
})


app.post('/api/postNightRate', async(req,res) => {

    try {
        const prevRate = await Rate.findOne({});

        if(prevRate !== null){
               const rate = await Rate.findOneAndUpdate({_id: prevRate._id},{nightRate : req.body.nightRate})
               return res.json({status:"ok",message:"updated the rate",rates: rate})
        } else {
            res.json({status:"ok", message: "No rates present"})
        }
    } catch(e) {
        res.json({error: e});
    }
})


app.post('/api/postGasRate', async(req,res) => {

    try {
        const prevRate = await Rate.findOne({});

        if(prevRate !== null){
               const rate = await Rate.findOneAndUpdate({_id: prevRate._id},{gas : req.body.gas})
               return res.json({status:"ok",message:"updated the rate",rates: rate})
        }else {
            res.json({status:"ok", message: "No rates present"})
        }
    } catch(e) {
        res.json({error: e});
    }
})


app.post('/api/postStandingRate', async(req,res) => {

    try {
        const prevRate = await Rate.findOne({});

        if(prevRate !== null){
               const rate = await Rate.findOneAndUpdate({_id: prevRate._id},{standingRate : req.body.standingRate})
               return res.json({status:"ok",message:"updated the rate",rates: rate})
        }else {
            res.json({status:"ok", message: "No rates present"})
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
            const bills = await Bill.aggregate([
                { $match: { user: userId._id } },
                { $sort: { date: -1 } },
                { $group: { _id: "$user", lastBill: { $first: "$$ROOT" } } }
            ])

            const deleted = await Bill.deleteMany({ user: userId._id, _id: { $ne: bills[0].lastBill._id } })
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


app.get('/api/countCodes', async (req, res) => {
    try {
        const codes = await QRCode.countDocuments({expired: false});

        res.json({count: codes});
    } catch(e) {
        res.json({e});
    }
})

app.get('/api/countExpiredCodes', async (req, res) => {
    try {
        const codes = await QRCode.countDocuments({expired: true});

        res.json({count: codes});
    } catch(e) {
        res.json({e});
    }
})


app.get('/igse/propertycount', async (req,res) => {
    try {
       
        
        const Terraced = await User.where('propertyType').equals('terraced').countDocuments()
        const detached = await User.where('propertyType').equals('Detached').countDocuments()
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


app.get('/igse/:propertyType/:bedroom',async (req,res) => {

    const numberOfRoom = (req.params.bedroom);
    const property = (req.params.propertyType)
    try {

        const Rates = await Rate.findOne({});

        const dayRate = Rates.dayRate;
        const nightRate = Rates.nightRate;
        const gasRate = Rates.gas;
        const StandingRate = Rates.standingRate;



        const bills = await User.aggregate([
            {
                $lookup: {
                    from: "Bill",
                    localField: "_id",
                    foreignField: "user",
                    as: "bills"
                }
            },
            {
                $unwind: "$bills"
            },
            {
                $group: {
                    _id: "$_id",
                    customerID: { $first: "$customerID" },
                    password: { $first: "$password" },
                    address: { $first: "$address" },
                    propertyType: { $first: "$propertyType" },
                    numberOfRooms: { $first: "$numberOfRooms" },
                    balance: { $first: "$balance" },
                    outstanding: { $first: "$outstanding" },
                    latestBill: { $last: "$bills" },
                    firstBill: { $first: "$bills" },
                }
            },
            {
                $match: { propertyType:property }
            },
            {
                $match: {  numberOfRooms: numberOfRoom}
            },
            {
                $group: {
                    _id: null,
                    numberOfRooms: { $first: "$numberOfRooms" },
                    averageDay: {$avg: "$latestBill.dayElectricity"},
                    averageNight: {$avg: "$latestBill.nightElectricity"},
                    averageGas: {$avg: "$latestBill.gas"},
                    averageDays : {
                        $avg: {
                            $divide : [
                                { 
                                    $subtract: ["$latestBill.date", "$firstBill.date"] 
                                },
                                {
                                    $literal: 86400000
                                }
                            ]
                        }
                    }
                    
                }
            },
        ])

        if(bills.length === 0){
            return res.json({status:"empty", message: "No such category exists"})
        }
        

        const day = (bills[0].averageDay) * dayRate;
        console.log(day);
        const night =(bills[0].averageNight) * nightRate;
        console.log(night);
        const gas = (bills[0].averageGas) * gasRate;
        console.log(gas);
        const average_cost = (day+night+gas)/bills[0].averageDays + (StandingRate * bills[0].averageDays)
        console.log(average_cost);


        const data = {
            "type": req.params.propertyType,
            "bedroom": req.params.bedroom,
            "average_electricity_gas_cost_per_day": Number.parseFloat(average_cost).toFixed(2),
            "unit" : "pound"
        }

        res.json(data);
    } catch(e){
        res.json(e);
    }
})



app.get('/api/getAllBills',async (req,res) => {
    try {
        const bills = await User.aggregate([
            {
                $lookup: {
                    from: "Bill",
                    localField: "_id",
                    foreignField: "user",
                    as: "bills"
                }
            },
            {
                $unwind: "$bills"
            },
            {
                $group: {
                    _id: "$_id",
                    customerID: { $first: "$customerID" },
                    password: { $first: "$password" },
                    address: { $first: "$address" },
                    propertyType: { $first: "$propertyType" },
                    numberOfRooms: { $first: "$numberOfRooms" },
                    balance: { $first: "$balance" },
                    outstanding: { $first: "$outstanding" },
                    bills: {$push: "$bills"},
                 
                }
            }
          ])

        console.log(bills)
          
        if(bills.length !== 0){
            return res.json({status: "ok", data: bills})
        } else {
            return res.json({status:"ok", message: "Empty Directory"})
        }
    } catch (e) {
        return res.json(e);
    }
})




app.listen(1337, () => {
    console.log("Server started at 1337");
})