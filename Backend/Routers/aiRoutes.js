const express=require("express");
const { enhancePost, generatePost, enhanceAbout } = require("../Controllers/aiPost.js");

const router = express.Router();

router.route("/enhancePost").post( enhancePost);
router.route("/generatePost").post( generatePost);
router.route("/enhance_profile_ai").post( enhanceAbout);


module.exports= router;
