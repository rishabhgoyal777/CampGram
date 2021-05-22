var mongoose= require("mongoose");
var Campground= require("./models/campground");
var Comment= require("./models/comment");

var data=[
    {
        name: "Nature View",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtcGluZ3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, cupiditate facere autem placeat id laborum dicta optio? Sed ratione suscipit enim possimus expedita quam corrupti magnam autem? Repudiandae consequuntur sunt, voluptates at fugiat similique?"
    },
    {
        name: "Camp Sparrow",
        image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FtcGluZ3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, cupiditate facere autem placeat id laborum dicta optio? Sed ratione suscipit enim possimus expedita quam corrupti magnam autem? Repudiandae consequuntur sunt, voluptates at fugiat similique?"
    },
    {
        name: "Camp Woody",
        image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcGluZ3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore, cupiditate facere autem placeat id laborum dicta optio? Sed ratione suscipit enim possimus expedita quam corrupti magnam autem? Repudiandae consequuntur sunt, voluptates at fugiat similique?"
    }
];


function seedDB(){
    Campground.remove({}, function(err){
        if(err) console.log(err);
        else{
            console.log("removed all");
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err) console.log(err);
                    else{
                        console.log("added a campground");
                        Comment.create( {text:"nice", author:"rishabh"}, function(err,comment){
                            if(err) console.log(err);
                            else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created a new comment");
                            }
                        });
                    }
                });

            });
        }
    });

}

module.exports = seedDB;