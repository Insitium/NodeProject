//login register model for nurses login

const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//register and login model
const nurseSchema = new Schema({
    "username":{
        type: String,
        unique: true
    },
    "nurseName":String,
    "nurseNumber":{
        type: String,
        unique: true
    },
    "password": String
})