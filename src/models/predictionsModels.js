const mongoose = require("mongoose");
const turbidez = require("./turbitySensor");

const location = new mongoose.Schema({
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
});

const predictionSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    location: { type: location, required: true },
    temporada: {type: String, required:true},
    ph: {type: Number, required:true},
    turbidez: {type: Number, required:true},
    temp: {type: Number, required:true},
    tds: {type: Number, required:true},
    colorimetria: {type: String, required:true},
    metal: {type: String, required:true},
});

const prediction = mongoose.model("predictions", predictionSchema);
module.exports = prediction;

