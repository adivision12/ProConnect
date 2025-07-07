const express=require("express");
const router=express.Router();
const multer=require("multer");
const { check, createPost, getAllPosts, deletePost, getPostComments, deleteComment, incrementLikes, PostComment, editPost } = require("../Controllers/postController");
const { secureRoute } = require("../Middleware/middleware");

const { storage } = require('./cloudinary');
  const upload = multer({ storage: storage })
router.route("/api/post").post(upload.single('media'),secureRoute,createPost);  
router.route("/api/posts").get(getAllPosts);
router.route("/api/delete_Post").delete(secureRoute,deletePost);
router.route("/api/edit_Post").post(upload.single('media'),secureRoute,editPost);
router.route("/api/post_comments").post(secureRoute,PostComment);
router.route("/api/get_post_comments").get(getPostComments);
router.route("/api/delete_Comment").delete(secureRoute,deleteComment);
router.route("/api/increment_likes").post(secureRoute,incrementLikes);

module.exports=router;
