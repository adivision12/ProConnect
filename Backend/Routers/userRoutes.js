const express=require("express");
const {   profilePicture, updateUserProfile, getUserAndProfile, getAllUserProfile, sendConnectionReq, getMyConnectionReq, getMyConnections, acceptConnectionReq, getProfile, updateProfileDetails, withdrawConnectionReq, getSearchUsers, removeConnection, getAllConnections, checkToken } = require("../Controllers/userController.js");

const router=express.Router();
const { secureRoute } = require("../Middleware/middleware.js");
const { storage } = require('./cloudinary');
const multer = require('multer');
const User = require("../Models/UserModel.js");
  
  const upload = multer({ storage: storage })


// router.route('/check_Token').post(secureRoute,checkToken);
// router.route('/register').post(register);
// router.route('/login').post(login);
router.route('/upload_Profile').post(  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'coverPicture', maxCount: 1 }, 
  ]),secureRoute,profilePicture)
router.route("/get_user_and_profile").get(secureRoute,getUserAndProfile)    
router.route("/getProfile").get(getProfile)    
router.route("/update_UserProfile").post(secureRoute,updateUserProfile)
// router.rout/pi/update_Profile_Data").post(secureRoute,updateProfileData);
router.route("/update_Profile_Details").post(secureRoute,updateProfileDetails);
router.route("/user/getAllUsers").get(getAllUserProfile);
router.route("/user/send_Connection_req").post(secureRoute,sendConnectionReq);
router.route("/user/get_my_Connection_req").get(secureRoute,getMyConnectionReq);
router.route("/user/getMyAll_Connections").get(secureRoute,getMyConnections);
router.route("/user/getAll_Connections").get(secureRoute,getAllConnections);
router.route("/user/accept_connection_req").post(secureRoute,acceptConnectionReq);
router.route("/user/withdraw_connection_req").post(secureRoute,withdrawConnectionReq);
router.route("/user/removeConnection").post(secureRoute,removeConnection);
// router.rout/pi/searchUser").get(secureRoute,getSearchUsers);

module.exports = router;