const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//model of the patients data
const RecordSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    time: { type: String, required: true },
    bloodPressure: { type: String, required: true },
    respirationRate: { type: String, required: true },
    bloodOxygen: { type: String, required: true },
    heartBeat:{ type: String, required: true }
})

module.exports = mongoose.model("record",RecordSchema)
