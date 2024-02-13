const express = require("express");
const router = express.Router({mergeParams:true});  // for taking id from parent route

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")

// Controller
const reviewController = require("../controllers/reviews.js");

// reviews
// post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview) );

// delete Reveiew Route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview) )


module.exports = router;





