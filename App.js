
//#region Setting up server
var express = require("express");
var app = express();
var http_port = process.env.PORT || 8080

require("dotenv").config();



//using a body parser
var parserBody = require('body-parser');
app.use(parserBody.urlencoded({extended:false}));
function onStartingServer(){
    console.log("The server is listenibng on the port: "+http_port);
}
app.use(express.static("views"));
app.use(express.static("public"))



//mongodb database connections
const mongodb = require("mongoose")

//data models
const patientModel = require("./models/PatientModel.js")
const { findById } = require("./models/PatientModel.js");
const { on } = require("events");

//connecting to the db using the link in env file
mongodb.connect(process.env.DBCONN, { useNewUrlParser: true, useUnifiedTopology: true})

//Xbf0OWQpeq6wkuFR
//#endregion

function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
}

app.post("/patients",(req,res) =>{
    console.log({
        fullName: req.body.fullName,
        age: req.body.age,
        address: req.body.address,
        dob: req.body.dob,
        phoneNumber: req.body.phoneNumber
    })

    if(req.body.fullName == "" || req.body.fullName == undefined){
        res.send({
            "success" : "false",
            "message" : "fullName is required"
        })
    }

    if(!containsOnlyNumbers(req.body.age) || req.body.age == undefined){
        return res.send({
            "sucess": "false",
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

    var newPatient = new patientModel({
        fullName: req.body.fullName,
        age: req.body.age,
        address: req.body.address,
        dob: req.body.dob,
        phoneNumber: req.body.phoneNumber
    });

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


//app listen
app.listen(http_port,onStartingServer)