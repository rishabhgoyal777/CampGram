var express = require("express");
var router = express.Router({mergeParams: true});
var User= require("../models/user");
var passport= require("passport");

// all purpose routes that are not particularly related to a particular model are generally named index.js file

router.get("/", function(req,res){
    res.render("landing");
});


// auth routes
//===============

//show register form
router.get("/register", function(req,res){
    res.render("register");
});

router.post("/register", function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "Welcome " + user.username);
            res.redirect("/campground");
        });
    });
});

//show login form
router.get("/login", function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",    // router.post("/login", middleware, callback)
    {
        successRedirect: "/campground",
        failureRedirect: "/login"       
    }), function(req,res){
});

//logout route
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged you Out");
    res.redirect("/campground");
})



// function isLoggedIn(req, res, next){     // jaha pe bhi chahiye ki wo chiz krne ke liye loged in hona jruri waha pe ye middleware laga do agar loged in hua to aage chlega nhi to login wale page le jayega
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;
