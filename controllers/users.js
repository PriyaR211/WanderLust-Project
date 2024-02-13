
const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        // Automatically login after signup
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });
        // req.flash("success", "Welcome to WanderLust!");
        // res.redirect("/listings");
    }
    catch (err) {
        req.flash("error", "Username already exists!");
        res.redirect("/signup");
    }

}


module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
}

module.exports.loginMsg = (req, res)=>{
    req.flash("success","Welcome to WanderLust! You are logged-in");
  
    let redirectUrlPath = res.locals.redirectUrl;
    if(redirectUrlPath){
        return res.redirect(redirectUrlPath);
    };
    res.redirect("/listings");

}

module.exports.logout = (req, res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged-out!")
        res.redirect("/listings");
    });
}














