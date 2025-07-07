const mongoose=require("mongoose");
const Comment = require("./CommentModel");
const commentSchema = require("./CommentModel");

const postSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    body:{
        type:String,
        required:true,
    },
    likes:{
         type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    default: [],
    },
    media:{
        type:String,
        default:"",
    },
    fileType:{
        type:String,
        default:"",
    },
    active:{
        type:Boolean,
        default:true
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    },
    
})

const Post=mongoose.model("Post",postSchema);

module.exports=Post;