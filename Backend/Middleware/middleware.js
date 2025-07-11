const jwt = require('jsonwebtoken');


const User = require("../Models/UserModel");

module.exports.secureRoute=async(req,res,next)=>{
    try {
        if(req.headers.authorization){
        const token=req.headers.authorization.split(" ")[1];

        // console.log(token)
         const varified=jwt.verify(token,"mysecret");
      
        const user=await User.findById(varified.id).select("-password");
      
        // console.log(user);
        if(!user){
            return res.json({message:"not authorized"})
        }
    
        req.user=user;
        }
        next();
    } catch (error) {
        // console.log(error)
    }
}