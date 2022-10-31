const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//model of the patients data
const patientSchema = new mongoose.Schema({
    "fullName": String,
    "id":{
        type: String,
        unique: true
    },
    age: String,
    phoneNumber: String
})


module.exports = mongoose.model("patients",patientSchema)
