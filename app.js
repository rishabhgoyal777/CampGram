var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose= require("mongoose"),
    flash = require("connect-flash"),
    passport= require("passport"),
    LocalStrategy= require("passport-local"),
    methodOverride = require("method-override"),
    passportLocalMongoose= require("passport-local-mongoose"),
    Campground= require("./models/campground"),
    User= require("./models/user"),
    Comment= require("./models/comment"),
    seedDB= require("./seeds");

//requiring routes
    var commentRoutes = require("./routes/comments"),            //refactoring routes
    campgroundRoutes = require("./routes/campgrounds"),     
    indexRoutes = require("./routes/index");
    
mongoose.connect("mongodb://localhost:27017/yelpcamp", { useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify: false} );

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); // without __dirname bhi chl jaygea it just makes sure that jis mei app.js hai uss directory + "/public" mei dekhega
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();    // in case to seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "some secret bullshit",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){                       
    res.locals.currentUser = req.user;      // currentUser = req.user passed in every template. no need to manually pass to every template
 // res.locals.message = req.flash("error"); // error is key and message associated with it is its value. Here We are defining word "message" to use this globally
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);          //refactoring routes
app.use("/campground/:id/comments", commentRoutes);
app.use("/campground", campgroundRoutes);

// var campgroundsarr=  [
//     {name: "triund", image:  "https://www.photosforclass.com/download/pb_5302236"},
//     {name: "kasol", image:"https://www.photosforclass.com/download/pb_1189929"},
//     {name: "kedarnath", image: "https://www.photosforclass.com/download/pb_1851092"}
// ];

app.listen(8080, '127.0.0.1', function(){
    console.log("the camper server has started");
});