const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
require('dotenv').config();
console.log("Mapbox Token:", process.env.MAP_TOKEN); 
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index=async (req, res) => {
    const alllists = await Listing.find({});
    res.render("./listings/index.ejs", { alllists });
};

module.exports.renderNewForm=(req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
   const llist = await Listing.findById(id)
   .populate({
    path:"reviews",
    populate:{
       path:"author",
    },
   }).populate("owner");
    if(!llist){
        req.flash("error","listing doesn't exist");
    return    res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { llist });
};


module.exports.createListing=async (req, res, next) => {
   let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
    
    const newListing = new Listing(req.body.listing);
    console.log(req.body.listing);
    newListing.owner=req.user._id;
    newListing.geometry=response.body.features[0].geometry;
  let savedListing=  await newListing.save();
  console.log(savedListing);
    req.flash("success","New listing created!");
    res.redirect("/listings");

};

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing doesn't exist");
    return    res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
};

module.exports.updateListing=async (req, res) => {

    if (!req.body.listing) {
        throw new ExpressError(400, "send valid data for listing!!");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success"," listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," listing deleted!");
    res.redirect("/listings");
};

