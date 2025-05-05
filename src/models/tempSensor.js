const mongoose = require("mongoose");

const location = new mongoose.Schema({
    type: {type: String, enum:['Point'], required: true},
    coordinates: {type:[Number], required: true}
});

const tempSensorSchema = new mongoose.Schema({
    id_sensor: {type: String, required: true},
    timestamp: {type: Date, default: Date.now},
    values: {type: Number, required: true},
    location: {type: location, required:true}
});

const temperature = mongoose.model("tempSensor", tempSensorSchema);
module.exports = temperature;

