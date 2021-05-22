var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes here

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){     // jaha pe bhi chahiye ki wo chiz krne ke liye loged in hona jruri waha pe ye middleware laga do agar loged in hua to aage chlega nhi to login wale page le jayega
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You Need to Login First")
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership  = function(req,res,next){
    if(req.isAuthenticated()){              //check if logged in
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err) res.redirect("back");
            else{
                if(foundCampground.author.id.equals(req.user._id)){  //check if logged in user matches campground author. We cannot use === to compare because both of same values but one is of object type and one is string type.
                    next();
                } else{
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else{                 //if not logged in
        req.flash("error", "You need to be logged in");
        res.redirect("back");          //takes user back from where it came from
    }    
};

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){              //check if logged in
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) res.redirect("back");
            else{
                if(foundComment.author.id.equals(req.user._id)){  //check if logged in user matches campground author. We cannot use === to compare because both of same values but one is of object type and one is string type.
                    next();
                } else{
                    req.flash("error", "You dont have the permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else{                 //if not logged in
        req.flash("error", "You need to be logged in");
        res.redirect("back");          //takes user back from where it came from
    }    
};


module.exports = middlewareObj;