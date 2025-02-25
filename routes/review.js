const express = require("express");
const router = express.Router({mergeParams:true});
const just=require("../utils/just.js");
const Review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {validateReview, loginchk, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

   // creating review
router.post("/" ,loginchk,validateReview,just( reviewController.createReview));
  
    //delete review
    router.delete("/:reviewID",loginchk,isReviewAuthor, just(reviewController.destroyReview));

    module.exports=router;