const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    bio:{
        type:String,
        default:''
    },
    active:{
        type:Boolean,
        default:true
    },
    password: { type: String }, // present if signed up via email+password
  authProvider: { type: String, enum: ['local', 'google', 'email-otp'], required: true },
  otp: {
    hash: String,
    expiresAt: Date
  },
    profilePicture:{
        type:String,
        default:"https://res.cloudinary.com/dcgdg9ths/image/upload/v1751804674/ProConnect/ytgnrlngrrzx3zam9q4g.png"
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    token:{
        type:String,
        default:''
    }
})

const User=mongoose.model("User",userSchema);

module.exports= User;