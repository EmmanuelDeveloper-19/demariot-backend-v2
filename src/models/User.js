const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    street: {type: String, required:true},
    city: {type: String, required:true},
    state:{type:String, required:true},
    zip:{type:String, required:true}
});

const userSchema = new mongoose.Schema({
    first_name: {type: String, required:true},
    last_name:{type: String, required:true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required:true},
    address: {type: addressSchema, required:true},
    phone: {type: String, required:true, unique:true},
    role: {type: String, enum: ["admin", "user"], required:true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    last_login: {type: Date, default:null},
    profile_picture: {type: String, default: null}
});

userSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

const user = mongoose.model("user", userSchema);
module.exports = user;