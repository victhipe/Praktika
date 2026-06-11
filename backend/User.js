const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    login: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String,
    fullname: String,
    role: {type:String, default: "user"}
})
module.exports = model("User",userSchema,"User" );