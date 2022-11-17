
// Setting up server
var express = require("express");
var parserBody = require('body-parser');
var http_port = process.env.PORT || 8080
require("dotenv").config();
const mongodb = require("mongoose")
const cors = require('cors');

var app = express();


// set body parser
app.use(parserBody.urlencoded({extended:false}));
app.use(parserBody.json())
app.use(express.static("views"));
app.use(express.static("public"))
app.use(cors({origin: true, credentials: true}));

// start server helper method
function onStartingServer(){
    console.log("The server is listenibng on the port: "+http_port);
}

// number validation
function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
}



//data models
const patientModel = require("./models/PatientModel.js")
const RecordModel = require("./models/RecordModel.js")
const { on } = require("events");

//connecting to the db using the link in env file
mongodb.connect(process.env.DBCONN, { useNewUrlParser: true, useUnifiedTopology: true})

// post patient data method
app.post("/patient",(req,res) =>{

    console.log('/patient METHOD:POST')
    var newPatient = new patientModel({
        patient_id: req.body.patientId,
        fullName: req.body.fullName,
        age: req.body.age,
        address: req.body.address,
        dob: req.body.dob,
        phoneNumber: req.body.phoneNumber,
        image: req.body.image
    });
    if(req.body.fullName == "" || req.body.fullName == undefined){
        res.send({
            "success" : "false",
            "message" : "fullName is required"
        })
    }
    if(!containsOnlyNumbers(req.body.age) || req.body.age == undefined){
        return res.send({
            "success": "false",
            "message": "invalid age or age not given"
        })
    }
    if(req.body.address=="" || req.body.address == undefined){
        return res.send({
            "success" : "false",
            "message" : "address is required"
        })
    }
    if(req.body.dob=="" || req.body.dob == undefined){
        return res.send({
            "success" : "false",
            "message" : "dob is required"
        })
    }

    if(req.body.phoneNumber =="" || req.body.phoneNumber == undefined){  
        return res.send({
            "success" : "false",
            "message" : "phonenumber is required"
        })
    }else{
        if(!containsOnlyNumbers(req.body.phoneNumber) || !((req.body.phoneNumber.length) == 10)){
            return res.send({
                "success" : "false",
                "message" : "invalid phone number"
            }) 
        }    
    }

    try{
        newPatient.save();
        return res.send({
            "success": "true"
        })
    }catch(err){
        console.log(err)
        return res.send({
            "success": "false",
            "message": err
        })
    }
    
})

// find patient by id
app.get('/patient/:postId', async (req, res) => {
    try {
        const data = await patientModel.findById(req.params.postId);
        res.send({ data});
    } catch (err) {
        res.send({message: err });
   
    }
});

// delete patient by id
app.delete("/patient/:id", async (req, res) => { 
    try {
        const data = await patientModel.remove({ _id: req.params.id});
        res.send({ data});
    } catch (err) {
        res.send({message: err });
   
    }
})

// get all patients
app.get('/patients', (req, res) => {
    let posts = patientModel.find({}, function(err, posts){
        if(err){
            console.log(err);
        }
        else {
            res.send({posts});
        }
    });
});

//post record data method
app.post("/records",(req,res)=>{
    var newRecord = new RecordModel({
        fullName: req.body.fullName,
        time:req.body.time,
        bloodPressure: req.body.bloodPressure,
        respirationRate: req.body.respirationRate,
        bloodOxygen: req.body.bloodOxygen,
        heartBeat: req.body.heartBeat
        
    });
    if(req.body.fullName == "" || req.body.fullName == undefined || req.body.time =="" || req.body.time == undefined || req.body.bloodPressure == "" || req.body.bloodPressure == undefined || req.body.respirationRate == "" || req.body.respirationRate == undefined || req.body.bloodOxygen == "" || req.body.bloodOxygen == undefined){
        res.send({
            "success": "false",
            "message": "All the details needs to be filled"
        })
    }
    try{
        newRecord.save();
        return res.send({
            "success": "true"
        })
    }catch(err){
        console.log(err)
        return res.send({
            "success": "false",
            "message": err
        })
    }
})
//get all records
app.get('/records', async (req, res) => {
    try {
        const data = await RecordModel.find();
        res.send({ data});
    } catch (err) {
        res.send({message: err });
   
    }
});
//get records by id
app.get('/record/:postId', async (req, res) => {
    try {
        const data = await RecordModel.findById(req.params.postId);
        res.send({ data});
    } catch (err) {
        res.send({message: err });
   
    }
});

// delete record by id
app.delete("/record/:id", async (req, res) => { 
    try {
        const data = await RecordModel.remove({ _id: req.params.id});
        res.send({ data});
    } catch (err) {
        res.send({message: err });
   
    }
})



//app listen
app.listen(http_port,onStartingServer)