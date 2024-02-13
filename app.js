// environment variables of cloud
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.env.SECRET);

const express = require("express");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override"); // for put/delete request in form
const ejsMate = require("ejs-mate");
const path = require("path");

const session = require("express-session");
const flash = require("connect-flash");

//To Use Express Router
const listingRouter = require("./routes/listing.js"); 
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Authenitication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const app = express();   
const port = 8080;

// const { EventEmitterAsyncResource } = require("events");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate); //To use boiler plate code
app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));

app.listen(port, () => {
    console.log("app is listening at port 8080...");
});

const sessionOptions = {
    secret : "myverysecretkey",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,     // in milli-sec
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // to check user is logged in or not (used req.user)
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
})


app.get("/", (req, res) => {
    res.send("hi, this is root");
})

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(Mongo_URL);
}

main().then((res) => {
    console.log("connected to database");
}).catch((err) => {
    console.log("error in connection");
})


// Routing
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


//// for all route other than above
app.use("*", (req, res, next) => {
    // console.log("inside all other listing requests");
    next(new ExpressError(404, "Page not found"));

})

// Error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    // res.status(status).send(message);
    res.render("error.ejs",{err});
})



