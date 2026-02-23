if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path =require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const listingrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/reviews.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");



app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"/public")));

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRETE
    },
    touchAfter:24*3600,
})


const sessionOptions = {
    store:store,
    secret:process.env.SECRETE,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};

store.on("error",(err)=>{
    console.log("Error in mongo-sessions",err);
})


main()
.then(()=>{
    console.log("connection sucessfull");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
      res.locals.errorMsg = req.flash("error");
      res.locals.currUser = req.user;
    next();
})



app.use("/listings",listingrouter);
app.use("/listings/:id/reviews",reviewrouter);

app.use("/",userRouter);
 

app.all("/*any",(req,res,next)=>{
    
    next(new ExpressError(404,"page not found"));
}) 

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"} = err;
    res.status(statusCode).render("users/error.ejs", {err} );
    
});

app.listen(8080,()=>{
    console.log("port is listneing to http://localhost:8080/");
});





