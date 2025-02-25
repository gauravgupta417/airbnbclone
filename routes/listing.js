const express = require("express");
const router = express.Router();
const just=require("../utils/just.js");
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");
const {reviewSchema } = require("../schema.js");
const Listing=require("../models/listing.js");
const {loginchk, isOwner} =require("../middleware.js");
const listingController=require("../controllers/listings.js");


const validateListing= (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
     if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
     }else{
      next();
     }
   };
  

// index route
router.route("/")
.get(just(listingController.index))
.post( validateListing, just(listingController.createListing));

//new route
router.get("/new",loginchk, listingController.renderNewForm);

// show route
router.route("/:id")
.get(just(listingController.showListing))
.put(loginchk,isOwner,validateListing, just(listingController.updateListing))
.delete(loginchk,isOwner, just(listingController.destroyListing));

// edit route
router.get("/:id/edit",loginchk,isOwner, just(listingController.renderEditForm));

module.exports=router;
