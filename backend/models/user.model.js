import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import redisClient from "../services/redis.service.js";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLenght:[6,'Email must have atleast 6 characters'],
        maxLenght:[50,'Email must have more than 50 characters']
    },
    password:{
        type:String
    }
    
},{timestamps:true})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();    
    
    //isModified checks any field is modified or not

    this.password = await bcrypt.hash(this.password, 10)
    next()
}
)

userSchema.methods.isPasswordCorrect = async function
    (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateaccesstoken = async function () {
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        
    },
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
    // console.log("Generated Access Token:", token); // Log the token
    return token;
};


userSchema.methods.generaterefreshtoken = async function () {
    return jwt.sign({
        _id: this._id

    },
        process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const User=new mongoose.model('User',userSchema)
