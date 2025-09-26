const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
require('dotenv').config();

const Profile = require("../Models/profileModel.js");
const User = require("../Models/UserModel.js");
const bcrypt = require("bcrypt");
const { sendOtpMail } = require('../Utils/sendOtp');
const jwt = require('jsonwebtoken');

const generateToken = (id, res) => {
  const token = jwt.sign({ id }, "mysecret", { expiresIn: "7d" });
  res.cookie("jwt", token);
  return token;
};

// ===================== TOKEN CHECK =====================
exports.checkToken = async (req, res) => {
  try {
    if (req.user) return res.status(200).json({ msg: "Valid token", user: req.user, success: true });
    return res.status(200).json({ msg: "Invalid token", success: false });
  } catch (err) {
    return res.status(500).json({ msg: err.message, success: false });
  }
};

// ===================== REGISTER =====================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required", success: false });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) return res.status(400).json({ msg: "User already exists", success: false });

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email: email.toLowerCase(), password: hashedPass, authProvider: 'email-otp' });
    await newUser.save();

    const newProfile = new Profile({ userId: newUser._id });
    await newProfile.save();

    return res.status(200).json({ msg: "User Created", success: true });
  } catch (err) {
    return res.status(500).json({ msg: err.message, success: false });
  }
};

// ===================== LOGIN =====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "All fields are required", success: false });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "User does not exist", success: false });

    if(user.password==null || user.password==undefined){
      return res.status(400).json({ msg: "Password is not setup Please login using Google or OTP", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid details", success: false });

    const token = generateToken(user._id, res);
    await User.updateOne({ _id: user._id }, { token });

    const userProfile = await Profile.findOne({ userId: user._id });
    return res.json({ token, msg: "Login Successful", user, img: userProfile.coverPicture, success: true });
  } catch (err) {
    return res.status(500).json({ msg: err.message, success: false });
  }
};

// ===================== GOOGLE LOGIN =====================
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    // console.log("Google token:", req.body);
    if (!token) return res.status(400).json({ msg: 'Token missing', success: false });

    const ticket = await client.verifyIdToken({ idToken: token, audience: "1085194267725-26qrpv843psqjg62l2319fsnli4iva6j.apps.googleusercontent.com" });
    // console.log("Google ticket:", ticket);
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // console.log("Google payload:", payload);
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, authProvider: 'google' });
    } else if (user.authProvider !== 'google') {
      user.authProvider = 'google';
      await user.save();
    }

    const jwtToken = generateToken(user._id, res);
    user.token = jwtToken;
    // console.log("picture", picture);
    user.profilePicture = picture;
    const update_Profile_Data=await user.save();
    // console.log("update_Profile_Data", update_Profile_Data);
    let userProfile = await Profile.findOne({ userId: user._id });
    if (!userProfile) {
      const newProfile = new Profile({ userId: user._id });
      await newProfile.save();
    }
     userProfile = await Profile.findOne({ userId: user._id });
    return res.json({ success: true, msg: 'Google login success', img:userProfile.coverPicture,user, token: jwtToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Google login failed', success: false });
  }
};

// ===================== SEND OTP =====================
const OtpTemp = require('../Models/OtpTemp');

exports.sendOtp = async (req, res) => {
  try {
    const { email, isLogin, name } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email required', success: false });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    if (isLogin) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(400).json({ msg: 'Account does not exist. Please signup.', success: false });
      user.otp = { hash, expiresAt };
      user.authProvider = 'email-otp';
      await user.save();
    } else {
      if (!name) return res.status(400).json({ msg: 'Name required', success: false });
      // store OTP temporarily
      await OtpTemp.findOneAndUpdate(
        { email },
        { email, hash, expiresAt },
        { upsert: true }
      );
    }
    // console.log("Generated OTP:", otp);
    await sendOtpMail(email, otp);
    return res.json({ msg: 'OTP sent', success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error', success: false });
  }
};


// ===================== VERIFY OTP =====================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, isLogin, name, password } = req.body;
    if (!email || !otp) return res.status(400).json({ msg: 'Email and OTP required', success: false });

    if (isLogin) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !user.otp) return res.status(400).json({ msg: 'Invalid OTP', success: false });

      const valid = await bcrypt.compare(otp, user.otp.hash);
      if (!valid) return res.status(400).json({ msg: 'Invalid OTP', success: false });

      if (new Date() > new Date(user.otp.expiresAt)) {
        user.otp = undefined;
        await user.save();
        return res.status(400).json({ msg: 'OTP expired', success: false });
      }
       const userProfile = new Profile({ userId: user._id });
      user.otp = undefined;
      await user.save();
      const token = generateToken(user._id, res);
      return res.json({ msg: 'OTP verified', success: true, token, user,img:userProfile.coverPicture  });
    } else {
      // SIGNUP
      const otpRecord = await OtpTemp.findOne({ email });
      if (!otpRecord) return res.status(400).json({ msg: 'OTP Expired', success: false });
      if (new Date() > otpRecord.expiresAt) {
        await OtpTemp.deleteOne({ email });
        return res.status(400).json({ msg: 'OTP expired', success: false });
      }
//  const hash = await bcrypt.hash(otp, 10);
//  console.log(hash+" "+otpRecord.hash);
       const valid = await bcrypt.compare(otp, otpRecord.hash);
      if (!valid) return res.status(400).json({ msg: 'Invalid OTP', success: false });

      // OTP verified → create user now
      if (!name || !password) return res.status(400).json({ msg: 'Name and password required', success: false });
        const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        await OtpTemp.deleteOne({ email });
        return res.status(400).json({ msg: 'User already exists. Please login.', success: false });
      }
      const hashedPass = await bcrypt.hash(password, 10);
      const user = new User({ name, email: email.toLowerCase(), password: hashedPass, authProvider: 'email-otp' });
      await user.save();
      await OtpTemp.deleteOne({ email });

      const newProfile = new Profile({ userId: user._id });
    await newProfile.save();
      const token = generateToken(user._id, res);
      return res.json({ msg: 'Signup successful', success: true, token, user: { id: user._id, email: user.email, name: user.name } });
    }
  } catch (err) {

    console.error(err);
    return res.status(500).json({ msg: 'Server error', success: false });
  }
};

// 3️⃣ Reset Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword)
    return res.status(400).json({ success: false, msg: "Passwords do not match" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    
  const hashedPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedPass; // pre-save hook will hash it
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.status(200).json({ success: true, msg: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};