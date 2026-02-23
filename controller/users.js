const User = require("../models/user.js");

module.exports.signUpFormRender = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signupRoute = async(req,res)=>{
    try{
    let {username,email,password} = req.body;
    const newUser = new User({username,email});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    

    req.login(registeredUser,(err)=>{
        if(err){
            console.log(err);
        }
        req.flash("success",`Hello ${username},Wellcome to AirBNB`);
        return res.redirect("/listings");
    });

    
    }catch(e){
        req.flash("error",e.message);
        return res.redirect("/signup");
    }
};

module.exports.loginFormRender = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.loginRoute = async(req,res)=>{
    let{username} = req.user;
    let redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash("success",`Hello ${username},Wellcome Back to AirBNB`);
    return res.redirect(redirectUrl);

};

module.exports.logoutRoute = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","You are successfully logout");
            return res.redirect("/listings")
        }
    });

};