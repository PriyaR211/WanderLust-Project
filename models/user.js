// schema for user signup validation
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

// username and password are already in passport
const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    }
})


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);






