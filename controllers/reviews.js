
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")

module.exports.createReview = async(req, res)=>{
    console.log(req.params);
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log("new inserted review:", newReview);
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("review is saved");
    // res.send("review saved in database");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${req.params.id}`);

}



module.exports.destroyReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    // pull is for match the id in array
    await Listing.findByIdAndUpdate(id, {$pull : {review : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
    
}












