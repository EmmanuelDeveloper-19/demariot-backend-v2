const mongoose =  require("mongoose");

const location = new mongoose.Schema({
    type: {type: String, enum:['Point'], required: true},
    coordinates: {type:[Number], required: true}
});

const tdsShema = new mongoose.Schema({
    id_sensor: {type:String, required:true},
    timestamp: {type:Date, default: Date.now},
    values: {type: Number, required: true},
    location: {type: location, required:true}
});

const tds = mongoose.model("tdsSensor", tdsShema);
module.exports = tds;