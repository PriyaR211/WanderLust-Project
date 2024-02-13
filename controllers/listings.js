
const Listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
    let allListings = await Listing.find(); // show all
    res.render("listings/index.ejs", { allListings });
}


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
   
    let listing = await Listing.findById(id).populate({path:"review", populate: {path:"author"} }).populate("owner");
    if(!listing){
        req.flash("error", "This Listing does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
   
    let newListing = new Listing(req.body.listing);
    // saving image link and filename 
    newListing.image = {url, filename};
   
    // add owner  
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "This Listing does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_150");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
   
    let listing = await Listing.findByIdAndUpdate((id), { ...req.body.listing });
  
    if(typeof req.file !== "undefined"){
        console.log("Inside function:");
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    console.log("listing after saved:");
    console.log(listing);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedDocs = await Listing.findByIdAndDelete(id);
    // console.log(deletedDocs);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}



