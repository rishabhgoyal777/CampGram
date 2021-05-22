var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");


// ======================
// comment routes
//==========================

//comments new
router.get("/new", middleware.isLoggedIn, function(req,res){           
    Campground.findById(req.params.id, function(err, campground){      // campground dekha kaunsa hai pher new page pe chle gye
        if(err) console.log(err);
        else{
            res.render("comments/new", {campground: campground});
        }
    });
});

//comments create
router.post("/", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){ //campground dekha new comment create kiya form se aaya jo data pher uss campground pe push krdiya
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/campground");  
        } 
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err) console.log(err);
                else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added a comment");
                    res.redirect("/campground/"+campground._id);
                }
            });
        }
    });
});

// edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) res.redirect("back");
        else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) res.redirect("back");
        else{
            res.redirect("/campground/" + req.params.id);
        }
    });
});

//delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) res.redirect("back");
        else{
            req.flash("success", "Comment deleted");
            res.redirect("/campground/" + req.params.id);
        }
    })
});

//middleware
// function isLoggedIn(req, res, next){     // jaha pe bhi chahiye ki wo chiz krne ke liye loged in hona jruri waha pe ye middleware laga do agar loged in hua to aage chlega nhi to login wale page le jayega
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCommentOwnership(req,res,next){
//     if(req.isAuthenticated()){              //check if logged in
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err) res.redirect("back");
//             else{
//                 if(foundComment.author.id.equals(req.user._id)){  //check if logged in user matches campground author. We cannot use === to compare because both of same values but one is of object type and one is string type.
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
