import mongoose from "mongoose";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    }


})
const generatejwtToken = (id)=>{
    return jwt.sign({id}, process.env.SECRET_KEY)
}

const User = mongoose.model("user", userSchema)

export {User, generatejwtToken}