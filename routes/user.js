const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewere.js");
const userController = require("../controller/users.js");

router
    .route("/signup")
    .get(userController.signUpFormRender)
    .post(wrapasync(userController.signupRoute));


router  
    .route("/login")
    .get(userController.loginFormRender)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.loginRoute)


router.get("/logout",userController.logoutRoute);

module.exports = router;