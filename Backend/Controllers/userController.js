
const Connection  = require("../Models/connectionModel.js");
const Profile  = require("../Models/profileModel.js");
const  User  = require("../Models/UserModel.js");
const bcrypt=require("bcrypt");
const crypto=require("crypto");

module.exports.activeCheck=async (req,res) => {
    return res.status(200).json({msg:"Running"})
}

const jwt = require('jsonwebtoken');

const generateToken=(id,res)=>{
    const token= jwt.sign({id},"mysecret",{
        expiresIn:"30d",
    })
    res.cookie("jwt",token);
    return token;
}
module.exports.register=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        if(!name || !email || !password ){
            return res.status(400).json({msg:"All fields are required", success:false})
        }
        // console.log(User)
        const user =await User.findOne({$or:[{email},{email:email.toLowerCase()}]});
        if(user)   return res.status(400).json({msg:"User already exists", success:false})

        const hashedPass=await  bcrypt.hash(password,10);

        const newUser=new User({
            name,
            email,
            password:hashedPass
        })
        await newUser.save();

        const newProfile=new Profile({userId:newUser._id})

       await  newProfile.save();

        return res.status(200).json({msg:"User Created",success:true})
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})

    }
}

module.exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password ){
            return res.status(400).json({msg:"All fields are required",success:false})
        }
       
        const user =await User.findOne({$or:[{email},{email:email.toLowerCase()}]});
        if(!user)   return res.status(400).json({msg:"User Does not exist",success:false})
        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch)   return res.status(400).json({msg:"Invalid details",success:false})

        const token=generateToken(user._id,res);

       await User.updateOne({_id:user._id},{token});

       const userProfile=await Profile.findOne({userId:user._id});
        return res.json({token,msg:"Login Successfully",user,img:userProfile.coverPicture,success:true})

    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

module.exports.profilePicture=async(req,res)=>{
     const profilePic = req.files['profilePicture']?.[0]?.path || null;
    const coverPic = req.files['coverPicture']?.[0]?.path || null;
    try {
        const user=req.user;
        if(!user)   return res.status(400).json({msg:" user not found",success:false})

            const userProfile=await Profile.findOne({userId:user._id});
             if (profilePic) user.profilePicture = profilePic;
    if (coverPic) userProfile.coverPicture = coverPic;

            await user.save();
            await userProfile.save();
            return res.json({msg:"Profile picture uploaded",user,img:userProfile.coverPicture,success:true})
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

module.exports.updateUserProfile=async(req,res)=>{
    // const {token}=req.body.authUser;
    const {...newUserData}=req.body;
    console.log(newUserData)
    // console.log(req.body)
    try {
        let user=req.user;
       if(user.name==newUserData.name && user.bio==newUserData.bio){
         return res.json({msg:"Updated something",success:false})
       }
       console.log(user)
        Object.assign(user,newUserData);
       const updatedUser= await user.save();

        return res.json({msg:"user updated",user:updatedUser,success:true})
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

module.exports.getUserAndProfile=async(req,res)=>{
    try {
        const user=req.user;
        if(!user)   return res.status(400).json({msg:"User not found",success:false})
            // console.log(user)
        const userProfile=await Profile.findOne({userId:user._id})
           .populate('userId','name email bio  profilePicture')    

        return res.json({"profile":userProfile,success:true}); 
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}
module.exports.getProfile=async(req,res)=>{
    // console.log(req.query.id)
    const id=req.query.id;
    try {
        // const user=await User.findById(req.body);
        // if(!user)   return res.status(400).json({msg:"User not found",success:false})
            // console.log(user)
        const userProfile=await Profile.findOne({userId:id})
           .populate('userId','name email bio username profilePicture')    

        //    console.log(userProfile)
        return res.json({"profile":userProfile,success:true}); 
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}



module.exports.updateProfileDetails=async(req,res)=>{
    // console.log(req.body);
    
    try {
        const user=req.user;
        if(!user)   return res.status(400).json({msg:"User not found",success:false})

            const profileToUpdate=await Profile.findOne({userId:user._id});
               Object.assign(profileToUpdate,req.body);
           const updated= await profileToUpdate.save();
            // console.log(updated)
            return res.json({msg:"profile updated ",success:true}); 
    } catch (err) {
         return res.status(500).json({msg:err.message,success:false})
    }
}
module.exports.getAllUserProfile=async(req,res)=>{
    try {
        // const user=req.user;
        //  if(!user)   return res.status(400).json({msg:"User not found",success:false})

        const allUsers=await Profile.find().populate('userId','name bio email profilePicture') 
        // console.log(allUsers)
        return res.json({allUsers,success:false});
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

module.exports.sendConnectionReq=async(req,res)=>{
    const {connectionId}=req.body;
    try {
        const user=req.user;
        if(!user)   return res.status(400).json({msg:"User not found",success:false})

            const connectionUser=await User.findById(connectionId);
            if(!connectionUser)   return res.status(400).json({msg:"Connection User not found",success:false})

        const existingReq=await Connection.findOne({userId:user._id,connectionId:connectionUser._id});

        if(existingReq) return res.status(400).json({msg:"Connection Request already sent",success:false})

        const newReq=new Connection({
            userId:user._id,
            connectionId:connectionUser._id
        })
        await newReq.save();
        
        return res.status(200).json({msg:"Request sent",newReq,success:true});
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

module.exports.getMyConnectionReq=async(req,res)=>{
    try {
        const user=req.user;
        if(!user)   return res.status(400).json({msg:"User not found",success:false})

            const connections=await Connection.find({userId:user._id})
            .populate('connectionId','name email bio profilePicture') 

           return res.json({"connections":connections,success:true})
       
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

module.exports.getMyConnections=async(req,res)=>{
    
    try {
        const user=req.user;
        if(!user)   return res.status(400).json({msg:"User not found",success:false})
            const myConnections=await Connection.find({$or:[{userId:user._id},{connectionId:user._id}]})
            .populate('userId connectionId','name email bio profilePicture') 


            // console.log(myConnections)
            return res.json({myConnections,success:true}); 
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

module.exports.getAllConnections=async(req,res)=>{
    try {
            const allConnections=await Connection.find()
            .populate('userId connectionId','name email bio profilePicture') 

            return res.json({allConnections,success:true}); 
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

module.exports.acceptConnectionReq=async(req,res)=>{
    const {requestId,action}=req.body;
    try {
        const user=req.user;
        if(!user)   return res.status(400).json({msg:"User not found",success:false})

            const connection=await Connection.findOne({_id:requestId});
            if(!connection)  return res.status(400).json({msg:"connection not found",success:false})

            if(action=="accept"){
                connection.status_accepted=true;
                  await connection.save();

            return res.json({msg:"Request accepted",success:true})
            }else{
               await  Connection.deleteOne({_id:requestId})
            //    await Connedction.save();
               return res.json({msg:"Request ignored",success:true})
            } 
          
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}
module.exports.withdrawConnectionReq=async(req,res)=>{
    const {connectionId}=req.body;
    try {
        const user=req.user;
    
        if(!user)   return res.status(400).json({msg:"User not found",success:false})

            const connection=await Connection.findOne({$or:[{$and:[{userId:user._id},{connectionId}]},{$and:[{userId:connectionId},{connectionId:user._id}]}]});
            if(!connection)  return res.status(400).json({msg:"connection not found",success:false})

               await  Connection.deleteOne({_id:connection._id})
            //    await Connedction.save();
            if(connection.status_accepted){
          return res.json({msg:"Connection removed",success:true})
            }
              
         return res.json({msg:"Connection Req removed",success:true})
          
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}
module.exports.removeConnection=async(req,res)=>{
    const {id1,id2}=req.body.id;
    try {
        const user=req.user;
        if(!user)   return res.status(400).json({msg:"User not found",success:false})

            const connection=await Connection.findOne({$or:[{$and:[{userId:id1},{connectionId:id2}]},{$and:[{userId:id2},{connectionId:id1}]}]});
            if(!connection)  return res.status(400).json({msg:"connection not found",success:false})

               await  Connection.deleteOne({_id:connection._id})

          return res.json({msg:"Connection removed",success:true})
            
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

