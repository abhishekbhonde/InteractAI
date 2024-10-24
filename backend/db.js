const mongoose = require("mongoose")

async function Connection() {
    await mongoose.connect("mongodb://localhost:27017/")
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