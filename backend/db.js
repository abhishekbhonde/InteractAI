const mongoose = require("mongoose")
require('dotenv').config();
async function Connection() {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("connection established")
}

Connection()

const UserSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String
})

const User = mongoose.model("User", UserSchema)

module.exports = {User}