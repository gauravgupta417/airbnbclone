const Listing=require("../models/listing.js");
const Review=require("../models/review.js");


module.exports.createReview=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);
     await newReview.save();
    await listing.save();
    req.flash("success","New review created!");
     res.redirect(`/listings/${listing._id}`);
    
    };

    module.exports.destroyReview=async(req,res)=>{
              let{id,reviewID}=req.params;
              await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
              await Review.findByIdAndDelete(reviewID);
              req.flash("success"," review deleted!");
              res.redirect(`/listings/${id}`);
        };