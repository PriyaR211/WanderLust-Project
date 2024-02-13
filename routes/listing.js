const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

// Conrollers
const listingController = require("../controllers/listings.js");

// for file parsing
const multer = require("multer");
const {storage} = require("../cloudConfig.js");

// file location to store
// const upload = multer({dest : "uploads/"});
const upload = multer({storage});


// home page - Index Route
// create route (validteListing->providing server side validation)
router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

//New route(to add new docs/listing)
router.get("/new", isLoggedIn, listingController.renderNewForm)


// show route
// index route(request coming via anchor/a tag)
// updating docs
// delete document
router.route("/:id")
.get( wrapAsync(listingController.showListings) )
.put( isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));





// edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;



