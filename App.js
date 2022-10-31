
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



//mongodp database connecttions
const mongodb = require("mongoose")

//data models
const patientModel = require("./models/PatientModel.js")
const { findById } = require("./models/PatientModel.js")

//connnecting to the db using the link in env file
mongodb.connect(process.env.DBCONN, { useNewUrlParser: true, useUnifiedTopology: true})

//Xbf0OWQpeq6wkuFR
//#endregion

app.post("/addingPatients",(req,res) =>{
    var newPatient = new patientModel({
        fullName: req.body.fullName,
        id: req.body.id,
        age: req.body.age,
        phoneNumber: req.body.phoneNumber
    });
    newPatient.save();
})


//app listen
app.listen(http_port,onStartingServer)