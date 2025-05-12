const mongoose = require("mongoose");

const location = new mongoose.Schema({
    type: {type: String, enum:['Point'], required: true},
    coordinates: {type:[Number], required: true}
});

const network = new mongoose.Schema({
    signal_strength: {type: Number},
    last_connection: {type: Date},
});



const prototypeSchema = new mongoose.Schema({
    id_prototype: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    status: {type: Boolean,required: true},
    battery: {type: Number, required: true},
    location: {type: location, required:true},
    network: {type: network, required:true}
});

const prototype = mongoose.model("prototype", prototypeSchema);
module.exports = prototype;

