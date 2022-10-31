const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//model of the patients data
const patientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    age: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: String, required: true,
    phoneNumber: { type: String, required: true }
})

module.exports = mongoose.model("patient",patientSchema)
