var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

//============================
// campgrounds routes
//=======================

//INDEX route- display all
router.get("/", function(req,res){
    Campground.find({}, function(err,campgroundsfromdb){          // this campgroundsfromdb is return from db using find
        if(err) console.log("hi");
        else{
            res.render("campgrounds/index",{camps: campgroundsfromdb, currentUser: req.user});   // this campgrounds is ejs file. camps is variable used in ejs file with value returned from campgroundsfromdb
        }
    });
});

//CREATE route- add new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    var name= req.body.name;
    var price= req.body.price;
    var image=req.body.image;
    var desc=req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground= {name: name, price: price, image: image, description: desc, author: author};
    Campground.create(newCampground, function(err,newlycreated){
        if(err) console.log(err);
        else{
            req.flash("success", "Successfully added a campground");
            res.redirect("/campground");
        }
    });
});

//NEW route- show form to create new
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW route- shows more info about one capmground
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundacamp){  // simce we have referenced two models we need to populate to show the refrenced data(comments)
        if(err) console.log(err);
        else{
            res.render("campgrounds/show",{camp: foundacamp});
        }
    });
});

//edit route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campground");
        } else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//update route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
        if(err){
            res.redirect("/campground");
        } else{
            res.redirect("/campground/" + req.params.id)
        }       
    });
});

//delete route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campground");
        } else{
            res.redirect("/campground");
        }
    });
});

// function isLoggedIn(req, res, next){     // jaha pe bhi chahiye ki wo chiz krne ke liye loged in hona jruri waha pe ye middleware laga do agar loged in hua to aage chlega nhi to login wale page le jayega
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCampgroundOwnership(req,res,next){
//     if(req.isAuthenticated()){              //check if logged in
//         Campground.findById(req.params.id, function(err, foundCampground){
//             if(err) res.redirect("back");
//             else{
//                 if(foundCampground.author.id.equals(req.user._id)){  //check if logged in user matches campground author. We cannot use === to compare because both of same values but one is of object type and one is string type.
//                     next();
//                 } else{
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else{                 //if not logged in
//         res.redirect("back");          //takes user back from where it came from
//     }    
// };

module.exports = router;


