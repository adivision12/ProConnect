const router = require('express').Router();
const authController = require('../Controllers/authController.js');
const { secureRoute } = require("../Middleware/middleware.js");

router.route('/check_Token').post(secureRoute,authController.checkToken);

router.route('/signup').post(authController.register);
router.route('/login').post( authController.login)
router.route('/google-login').post( authController.googleLogin);
router.route('/send-otp').post(authController.sendOtp);
router.route('/verify-otp').post(authController.verifyOtp);
router.route('/reset-password').post(authController.resetPassword);


module.exports = router;
