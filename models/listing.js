const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")
const listingSchema =new Schema({
    title : {
        type: String,
        required : true
    },
    description : String,
    image :{
        url : String,
        filename : String,
            },
    price : Number,
    location : String,
    country : String,
    // one to many database relationship(one listing has many reveiws)
    review : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    // for authentication of listing
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }
})
// mongoose middleware getting pre/post request by findByIdAndDelete()
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        // console.log(listing.review); // id in array
        await Review.deleteMany({_id : {$in : listing.review}});
    }

})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
















