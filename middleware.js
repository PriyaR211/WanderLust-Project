// middleware section
const Listing = require("./models/listing.js")
const Review = require("./models/review.js")

const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js"); // for server-side validation
const {reviewSchema} = require("./schema.js"); // for server-side validation


// middleware to check user is logged in or not
module.exports.isLoggedIn = (req, res, next)=>{
    
    if(!req.isAuthenticated()){ // passport method to check login hai ki nahi
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be looged in to do changes!");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
      
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// middleware to check the owner of listing to edit or update
module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // console.log("listing is:", listing);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not owner of this Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


// server side schema validation using middleware
module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    // console.log(error);
    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    // console.log(error);
    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}


// middleware to check the author of review to edit or update
module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    // console.log("listing is:", listing);
    console.log("review is: ", review);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not author of this Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
