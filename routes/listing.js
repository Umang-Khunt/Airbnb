const express = require("express");
const app = express();
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/expressError.js");
const {isLoggedIn,isOwner,validateListing} =  require("../middlewere.js");
app.use(express.json());

const listingController = require("../controller/listings.js");

const {storage} = require("../cloudConfig.js");
const multer  = require('multer')
const upload = multer({ storage })

router
    .route("/")
    .get(validateListing,wrapAsync(listingController.index))
   // .post(isLoggedIn,validateListing,wrapAsync(listingController.listingCreator));
    .post(isLoggedIn,validateListing,upload.single("image"),listingController.listingCreator);
//

router.post("/coordinates",isLoggedIn,listingController.coordinateSaver);

router.get("/new",isLoggedIn,listingController.newFormRender);



router
    .route("/:id")
    .get(wrapAsync(listingController.infoPageRander))
    .put(isLoggedIn,isOwner,upload.single("image"),validateListing,wrapAsync(listingController.listingUpdater))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.listingDeleter));

router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.editPageRander));

router.get("/privacy",(req,res)=>{
    res.render("listings/privecy.ejs");
});

router.get("/terms",(req,res)=>{
    res.render("listings/terms.ejs");
});

router.get("/admin",wrapAsync(async (req,res,next)=>{
    allListings = await Listing.find({});
    res.render("listings/admin.ejs",{allListings});
}));


module.exports = router;