const Comment = require("../Models/CommentModel");
const Post = require("../Models/PostModel");
const User = require("../Models/UserModel");


module.exports.check=async(req,res)=>{
    res.json({msg:"Route is working"})
}

module.exports.createPost=async(req,res)=>{
    // const {token}=req.body;
//    console.log((req.body.body))
//    console.log(req.file)
    try {
        const user=req.user;
        if(!user)   return res.status(400).json({msg:" user not found",success:false})

        // console.log(req.file)
        const newPost = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file?.path || "",
      fileType: req.file?.mimetype.split("/")[1] || "",
    });
        await newPost.save();
            return res.json({msg:"Post created",success:true})
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

module.exports.getAllPosts=async(req,res)=>{
    try {
  
        const posts=await Post.find()
        .populate('userId','name email username bio profilePicture') 
        // .comment.populate('userId','name bio profilePicture') 

        return res.json(posts);
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

module.exports.deletePost=async(req,res)=>{
     const {postId}=req.body;
     try {
        const user =req.user;
        if(!user){
            return res.status(400).json({msg:"User not found",success:false});
        }
        const post=await Post.findById(postId);
        if(!post){
            return res.status(400).json({msg:"Post not found",success:false});
        }
        if(user._id.toString()!==post.userId.toString()){
            return res.status(400).json({msg:"UnAuthorized",success:false});
        }
        const postComments=await Comment.find();
        await Comment.deleteMany({postId:post._id});
        await Post.deleteOne({_id:postId});
        res.json({msg:"Post deleted",success:true})
     }catch(err){
        return res.status(500).json({msg:err.message,success:false})
     }
}

module.exports.editPost=async(req,res)=>{
     const {postId}=req.query;
    try {
        const post=await Post.findById(postId);
            post.body=req.body.body;
          if(!req.body.media){
              post.media= req.file?.path || "";
      post.fileType= req.file?.mimetype.split("/")[1] || ""
        
          }
        // Object.assign(post,newdata);
        await post.save();
        return res.json({msg:"post updated" , success:true})
    } catch (err) {
         return res.status(500).json({msg:err.message,success:false})
    }
}


module.exports.PostComment=async(req,res)=>{
    const {postId,comment}=req.body;
    // console.log(req.body)
    try {
        const user =req.user;
        const userId=user._id;
        if(!user){
            return res.status(400).json({msg:"User not found",success:false});
        }
        const post=await Post.findById(postId);
        if(!post){
            return res.status(400).json({msg:"Post not found",success:false});
        }
        const newcomment=new Comment({
            userId,body:comment,postId
        })
        const savedComment=await newcomment.save();
        await Post.findByIdAndUpdate(postId, {
      $push: { comments: savedComment._id }
    });
        await post.save();
        res.json({msg:"Comment successfully",success:true})
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

module.exports.getPostComments=async(req,res)=>{
    const {postId}=req.query;
    try {
        const comments = await Comment.find({ postId })
      .populate("userId", "name profilePicture bio") // populate user details
      
        return res.json(comments);
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

module.exports.deleteComment=async(req,res)=>{
    const {commentId}=req.body;
    try {
        const user =req.user;
        if(!user){
            return res.status(400).json({msg:"User not found",success:false});
        }
        const comment=await Comment.findById(commentId);
        //  console.log(comment)
       const postId=comment.postId;
        
        if(comment.userId.toString()!==user._id.toString()){
            return res.status(400).json({msg:"You can not delete this comment",success:false});
        }
        await Comment.deleteOne({_id:commentId});

        await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId }
    });
        return res.json({msg:"Comment deleted",success:true})
        
    } catch (err) {
        return res.status(500).json({msg:err.message,success:false})
    }
}

module.exports.incrementLikes=async(req,res)=>{
    const post_id=req.body.id;
    // console.log(req.body)
    try {
        const post=await Post.findById(post_id);
        if(!post){
            return res.status(400).json({msg:"Post not found",success:false});
        }
        // console.log(post)
         const userId = req.user._id; // set by authMiddleware
    const idx = post.likes.indexOf(userId);

         if (idx === -1) {
      // add like
      post.likes.push(userId);
    } else {
      // remove like

      post.likes.splice(idx, 1);
    }
        await post.save();

        res.json({msg:"Post liked",success:idx === -1,})

    } catch (err) {
        return res.status(500).json({msg:err.message,success:false});   
    }
}