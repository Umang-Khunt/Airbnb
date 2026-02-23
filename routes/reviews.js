const express = require("express");
const router = express.Router({mergeParams:true});

const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/expressError.js");
const {validateReview, isLoggedIn, isReviewOwner} = require("../middlewere.js");
const reviewController = require("../controller/reviews.js")
//Review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.reviewCreate));

// review delete route

router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(reviewController.reviewDelete));

module.exports = router;