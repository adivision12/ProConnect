const express=require("express");
const { activeCheck, register, login, profilePicture, updateUserProfile, getUserAndProfile, getAllUserProfile, sendConnectionReq, getMyConnectionReq, getMyConnections, acceptConnectionReq, getProfile, updateProfileDetails, withdrawConnectionReq, getSearchUsers, removeConnection } = require("../Controllers/userController.js");

const router=express.Router();
const { secureRoute } = require("../Middleware/middleware.js");
const { storage } = require('./cloudinary');
const multer = require('multer');
const User = require("../Models/UserModel.js");
  
  const upload = multer({ storage: storage })



router.route('/api/register').post(register);
router.route('/api/login').post(login);
router.route('/api/upload_Profile').post(  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'coverPicture', maxCount: 1 }, 
  ]),secureRoute,profilePicture)
router.route("/api/get_user_and_profile").get(secureRoute,getUserAndProfile)    
router.route("/api/getProfile").get(getProfile)    
router.route("/api/update_UserProfile").post(secureRoute,updateUserProfile)
// router.route("/api/update_Profile_Data").post(secureRoute,updateProfileData);
router.route("/api/update_Profile_Details").post(secureRoute,updateProfileDetails);
router.route("/api/user/getAllUsers").get(secureRoute,getAllUserProfile);
router.route("/api/user/send_Connection_req").post(secureRoute,sendConnectionReq);
router.route("/api/user/get_my_Connection_req").get(secureRoute,getMyConnectionReq);
router.route("/api/user/getMyAll_Connections").get(secureRoute,getMyConnections);
router.route("/api/user/accept_connection_req").post(secureRoute,acceptConnectionReq);
router.route("/api/user/withdraw_connection_req").post(secureRoute,withdrawConnectionReq);
router.route("/api/user/removeConnection").post(secureRoute,removeConnection);
// router.route("/api/searchUser").get(secureRoute,getSearchUsers);

module.exports = router;