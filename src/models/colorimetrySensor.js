const mongoose = require("mongoose");

const location = new mongoose.Schema({
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, 
});

const metalConcentration = new mongoose.Schema({
    metal: { type: String, required: true }, 
    concentration_mgL: { type: Number, required: true }, 
    colorRGB: { type: [Number], required: true }, 
});

const colorimetrySchema = new mongoose.Schema({
    id_sensor: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    location: { type: location, required: true },
    metals: {type: metalConcentration, required: true},
});

const Colorimetry = mongoose.model("colorimetrySensor", colorimetrySchema);
module.exports = Colorimetry;