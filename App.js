
// Setting up server
var express = require("express");
var parserBody = require('body-parser');
var http_port = process.env.PORT || 8080
require("dotenv").config();
const mongodb = require("mongoose")

var app = express();


// set body parser
app.use(parserBody.urlencoded({extended:false}));
app.use(parserBody.json())
app.use(express.static("views"));
app.use(express.static("public"))

// start server helper method
function onStartingServer(){
    console.log("The server is listenibng on the port: "+http_port);
}

// number validation
function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
}

const sessionsClient = require("client-sessions")

app.use(
    sessionsClient({
        cookieName: "session",
        secret: "NodeProject",
        duration: 100*60*1000,
        activeDuration: 1000*60*60
    })
);

//data models
const patientModel = require("./models/PatientModel.js")
const LoginRegisterModel = require("./models/LoginRegisterModel.js")
const { on } = require("events");
const { ppid } = require("process");``

//connecting to the db using the link in env file
mongodb.connect(process.env.DBCONN, { useNewUrlParser: true, useUnifiedTopology: true})

// working on register and login using methods

app.post("/register",(req,res)=>{
    const password = req.body.password
    
    var loginregisterUser = new LoginRegisterModel({
        username: req.body.username,
        nurseName: req.body.nurseName,
        nurseNumber: req.body.nurseNumber,
        password: req.body.password
    });
    if(req.body.username === "" ||req.body.nurseName === "" || req.body.nurseNumber === "" || req.body.password==="" || req.body.username ===undefined || req.body.nurseName === undefined || req.body.nurseNumber === undefined || req.body.password === undefined){
        res.send({
            "success": "false",
            "message": "every field needs to be filled"
        })
    }
    try{
        loginregisterUser.save();
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
    
});

//login backend where it will validate the register details and then login
app.post("/login",(req,res)=>{
    const username= req.body.username;
    const password = req.body.password;

    //validating the availability of both the fields
    if(username === "" || username === undefined || password === "" || password=== undefined){
        return res.render("login",{
            errorMsg:"fields can not be empty",
            layout: false,
        })
    }

    LoginRegisterModel.findOne({ username:username }, function(err, usr) {
        if (err) {
          res.send(err);
        } else {
            if(!usr){
                //if user is not in gthe registration db
                res.render("login",{
                    errorMsg:"UserName does not exist with this name",
                    layout: false,
                });
            }else{
                //if username exists
                if(password === usr.password){
                    //saving the details in sessions
                    req.body.user = {
                        username: usr.username,
                        nurseName:usr.nurseName,
                        nurseNumber:usr.nurseNumber,
                        password:usr.password
                    };
                    //is password matches
                    res.redirect("/getPatients");
                }else{
                    res.render("login",{
                        errorMsg:"password does not match",
                        layout: false,
                    })
                }
            }
        }
      });
});

app.get("/login",(req,res)=>{
    res.render("login",{layout:false});
});

// post patient data method
app.post("/patient",(req,res) =>{
    var newPatient = new patientModel({
        patient_id: req.body.patient_id,
        fullName: req.body.fullName,
        age: req.body.age,
        address: req.body.address,
        dob: req.body.dob,
        phoneNumber: req.body.phoneNumber
    });
    if(req.body.patient_id == "" || req.body.patient_id == undefined){
        res.send({
            "success": "false",
            "message": "PatientID is required"
        })
    }
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
    
});

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
app.get('/patients', async (req, res) => {
    try {
        const data = await patientModel.find();
        res.send({ data});
    } catch (err) {
        res.send({message: err });
   
    }
});


//ensuring that other pages are accessed only after login
function loginEnsuring(req,res,next){
    if(!req.body.user){
        res.redirect("/login")
    }else{
        next();
    }
}

//app listen
app.listen(http_port,onStartingServer)