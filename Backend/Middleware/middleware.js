// const jwt = require('jsonwebtoken');


const User = require("../Models/UserModel");

module.exports.secureRoute=async(req,res,next)=>{
    try {
        if(req.headers.authorization){
        const token=req.headers.authorization.split(" ")[1];
        // const token=req.cookies.jwt;
        // if(token){
        // console.log("token=",token);
        // console.log(req.headers.authorization);
        
        // if(!token){
        //    return  res.json({message:"not authorized"})
        // }
        const varified=await User.findOne({token});
        // console.log(varified);
        if(!varified){
            return res.json({message:"not authorized"})
        }
        // const user=await User.findById(varified.id).select("-password");
        // if(!user){
        //     return res.json({message:"not found user"})
        
        // console.log(user)
        req.user=varified;
        }
        next();
    } catch (error) {
        // console.log(error)
    }
}