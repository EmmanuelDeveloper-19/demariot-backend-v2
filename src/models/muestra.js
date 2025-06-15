const { default: mongoose } = require("mongoose");
const mogoose = require("mongoose");

const location = new mongoose.Schema({
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
});

const colorSchema = new mogoose.Schema({
    rgb: {
        r: { type: Number, required: true },
        g: { type: Number, required: true },
        b: { type: Number, required: true }
    },
    hsv: {
        h: { type: Number },
        s: { type: Number },
        v: { type: Number }
    },
    hex: { type: String },
    /*imageUrl:{type:String}, */
    intensityLevel: {type: String, enum: ['baja', 'media', 'alta']}
})

const muestraSchema = new mogoose.Schema({
    timestamp: { type: Date, default: Date.now },
    color: { type: colorSchema, required: true },
    observation: { type: String },
    location: { type: location, required: true }
});

const muestra = mongoose.model("muestra",muestraSchema );
module.exports = muestra;