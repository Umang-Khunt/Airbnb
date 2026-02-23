const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

//-----Review Create route

module.exports.reviewCreate = async(req,res)=>{
    let {id} = req.params;
    let {rating,comment} = req.body;
    let listing = await Listing.findById(id).populate("reviews");

   let newReview = new Review({
    comment:comment,
    rating:rating,
    author:req.user._id
   });
   console.log(newReview);
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save(); 
   req.flash("success","New review created");
   return res.redirect(`/listings/${id}`);
    
};

//-----Review Delete route

module.exports.reviewDelete = async(req,res)=>{

    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
};